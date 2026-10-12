import {must,validId,scoreQuestions,fingerprint} from './engine.js';
const correctionStrip=x=>{const {_updateTime,...r}=x||{};return r;};
export const correctionRevision=m=>m?.revision||0;
export async function correctedQuestions(db,questions){
 return Promise.all(questions.map(async q=>{
  const override=await db.get(`questions/${q.id}/answerCorrections/${q.version||1}`);
  if(!override)return q;
  const correctIndex=q.options.indexOf(override.correctText);
  must(correctIndex>=0,'Stored question options do not match the correction.',409);
  return {...q,correctIndex,explanation:override.explanation,correctionId:override.correctionId};
 }));
}
export function correctionEvidenceDelta(review,before,after,answers){
 const concepts=new Map((review?.concepts||[]).map(c=>[c.name,{...c}]));
 const outcome=(q,a)=>a===null?'unanswered':a===q.correctIndex?'correct':'wrong';
 before.forEach((q,i)=>{const old=outcome(q,answers[i]),next=outcome(after[i],answers[i]);if(old===next)return;const c=concepts.get(q.concept||'Foundations');must(c&&c[old]>0,'Historical evidence cannot be reconciled automatically.',409);c[old]--;c[next]++;});
 return {...correctionStrip(review),concepts:[...concepts.values()],revision:(review?.revision||0)+1};
}
export async function correctionPage(db,cursor={}){
 let uid=cursor.uid,userToken=cursor.userToken||'',historyToken=cursor.historyToken||'';
 if(!uid){const page=await db.list('users',{limit:1,pageToken:userToken});if(!page.items.length)return {items:[],next:null};uid=page.items[0].id;userToken=page.nextPageToken||'';}
 const page=await db.list(`users/${uid}/history`,{limit:10,pageToken:historyToken});
 return {uid,items:page.items,next:page.nextPageToken?{uid,userToken,historyToken:page.nextPageToken}:userToken?{userToken}:null};
}
export async function correctionRoute(path,body,{db,user}){
 if(path==='admin/corrections/audit'){must(typeof body.id==='string'&&/^[a-z0-9-]+$/.test(body.id),'Invalid correction.');return db.list(`corrections/${body.id}/receipts`,{limit:50,pageToken:body.pageToken||''});}
 if(path==='admin/corrections/list')return {jobs:(await db.list('corrections',{limit:50})).items};
 if(path==='admin/corrections/preview'){
  must(validId(body.questionId),'Choose a question.');const q=await db.get(`questions/${body.questionId}`);must(q,'Question not found.',404);
  const page=await correctionPage(db,body.cursor),affected=page.items.filter(h=>h.questionIds?.includes(q.id));
  return {cursor:page.next,done:!page.next,scanned:page.items.length,affected:affected.length,legacy:affected.filter(h=>!h.questionSnapshot).length,expectedUpdateTime:q._updateTime};
 }
 if(path==='admin/corrections/create'){
  must(validId(body.questionId),'Choose a question.');must(typeof body.reason==='string'&&body.reason.trim().length>=10&&body.reason.length<=1000,'Explain the correction (10–1000 characters).');
  const [q,meta,catalog]=await Promise.all([db.get(`questions/${body.questionId}`),db.get('metadata/corrections'),db.get('metadata/catalog')]);
  must(q,'Question not found.',404);must(q._updateTime===body.expectedUpdateTime,'Question changed. Preview again.',409);must(!meta?.active,'Finish the active correction first.',409);
  must(Number.isInteger(body.correctIndex)&&body.correctIndex>=0&&body.correctIndex<q.options.length&&body.correctIndex!==q.correctIndex,'Choose a different correct option.');
  const version=q.version||1,id=String(9999999999999-Date.now())+'-'+crypto.randomUUID(),createdAt=new Date().toISOString();
  const job={id,questionId:q.id,reason:body.reason.trim(),beforeIndex:q.correctIndex,afterIndex:body.correctIndex,fromVersion:version,toVersion:version+1,createdAt,createdBy:user.uid,status:'pending',cursor:{},scanned:0,corrected:0,manualReview:0};
  const prior=await db.all(`questions/${q.id}/answerCorrections`,100);
  const explanation=body.explanation===undefined?q.explanation:body.explanation.trim();must(explanation&&explanation.length<=3000,'Provide the corrected explanation (up to 3000 characters).');
  const override={correctText:q.options[body.correctIndex],explanation,correctionId:id};
  const writes=[db.write(`corrections/${id}`,job,null),db.write(`questions/${q.id}/versions/${version}`,correctionStrip(q)),db.write(`questions/${q.id}`,{...correctionStrip(q),version:version+1,correctIndex:body.correctIndex,explanation,updatedAt:createdAt},q),db.write(`questions/${q.id}/answerCorrections/${version}`,override),db.write('metadata/corrections',{revision:correctionRevision(meta)+1,active:id},meta),db.write('metadata/catalog',{revision:(catalog?.revision||0)+1,updatedAt:createdAt},catalog)];
  for(const old of prior)if(old.id!==String(version))writes.push(db.write(`questions/${q.id}/answerCorrections/${old.id}`,override,old));
  await db.commit(writes);return job;
 }
 must(path==='admin/corrections/process'&&typeof body.id==='string'&&/^[a-z0-9-]+$/.test(body.id),'Invalid correction request.');
 let job=await db.get(`corrections/${body.id}`);must(job,'Correction not found.',404);if(['completed','needs-review'].includes(job.status))return correctionStrip(job);
 const page=await correctionPage(db,job.cursor),uid=page.uid;
 for(const item of page.items){
  const receiptPath=`corrections/${job.id}/receipts/${uid}_${item.id}`;
  if(await db.get(receiptPath))continue;
  const h=await db.get(`users/${uid}/history/${item.id}`);if(!h.questionIds?.includes(job.questionId))continue;
  let writes=[],outcome='unchanged';
  const meta=await db.get('metadata/corrections');must(meta?.active===job.id,'Correction state changed.',409);
  if(!h.questionSnapshot){outcome='manual-review';const progress=await db.get(`progress/${uid}`);writes.push(db.write(`progress/${uid}`,{...correctionStrip(progress),correctionPending:true,revision:(progress?.revision||0)+1},progress));writes.push(db.write(`users/${uid}/history/${h.id}`,{...correctionStrip(h),correctionNotice:'An answer-key correction affects this legacy attempt. Its shuffled question snapshot is unavailable; manual review is required.',manualCorrectionId:job.id},h));}
  else {
   const before=h.evaluatedQuestions||h.questionSnapshot,after=await correctedQuestions(db,h.questionSnapshot);
   if(JSON.stringify(before)!==JSON.stringify(after)){
    const [progress,review,session]=await Promise.all([db.get(`progress/${uid}`),db.get(`users/${uid}/reviews/${h.competencyId}`),db.get(`sessions/${uid}`)]);
    const grade=scoreQuestions(after,h.answers),evidence=correctionEvidenceDelta(review,before,after,h.answers),next={...correctionStrip(progress),revision:(progress?.revision||0)+1};
    const weak=evidence.concepts.filter(c=>c.wrong>0).sort((a,b)=>b.wrong/(b.correct+b.wrong)-a.wrong/(a.correct+a.wrong)||b.wrong-a.wrong).slice(0,6).map(c=>c.name);
    next.weakConcepts={...next.weakConcepts,[h.competencyId]:weak};
    if(h.completion==='submitted'&&progress?.scoreAttempts?.[h.competencyId]===h.id)next.scores={...next.scores,...grade.scores};
    const notice={correctionId:job.id,reason:job.reason,beforeScore:h.score,afterScore:grade.overall,beforeMarks:h.marks,afterMarks:grade.marks,correctedAt:new Date().toISOString()};
    const updated={...correctionStrip(h),evaluatedQuestions:after,score:grade.overall,marks:grade.marks,correct:grade.correct,wrong:grade.wrong,unanswered:grade.unanswered,passed:h.completion==='submitted'&&grade.passed,corrections:[...(h.corrections||[]),notice]};
    next.lastCorrection=notice;
    writes.push(db.write(`users/${uid}/history/${h.id}`,updated,h),db.write(`progress/${uid}`,next,progress),db.write(`users/${uid}/reviews/${h.competencyId}`,evidence,review));
    if(session?.historyId===h.id)writes.push(db.write(`sessions/${uid}`,{...correctionStrip(session),result:{...session.result,...grade,passed:updated.passed,correction:notice}},session));
    outcome='corrected';
   }
  }
  writes.push(db.write(receiptPath,{uid,historyId:h.id,outcome},null),db.write('metadata/corrections',correctionStrip(meta),meta));await db.commit(writes);
 }
 // Receipts make retrying a partially processed page safe.
 let corrected=0,manualReview=0;
 for(const item of page.items){const r=await db.get(`corrections/${job.id}/receipts/${uid}_${item.id}`);if(r?.outcome==='corrected')corrected++;if(r?.outcome==='manual-review')manualReview++;}
 const meta=await db.get('metadata/corrections');
 const updated={...correctionStrip(job),cursor:page.next||{},scanned:job.scanned+page.items.length,corrected:job.corrected+corrected,manualReview:job.manualReview+manualReview,status:page.next?'processing':job.manualReview+manualReview?'needs-review':'completed',updatedAt:new Date().toISOString()};
 const writes=[db.write(`corrections/${job.id}`,updated,job)];if(!page.next)writes.push(db.write('metadata/corrections',{revision:correctionRevision(meta)+1,active:null},meta));await db.commit(writes);return updated;
}

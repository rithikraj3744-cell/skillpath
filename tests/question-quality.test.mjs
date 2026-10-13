import test from 'node:test';
import assert from 'node:assert/strict';
import {AppError} from '../server/engine.js';
import {qualityAssessmentWrites,qualityRoute,qualityReview} from '../server/question-quality.js';
import {correctionRoute} from '../server/corrections.js';
import {handleAPI} from '../server/api.js';
class DB{
 constructor(){this.docs=new Map();this.serial=0;}
 async get(p){return structuredClone(this.docs.get(p)||null);}
 async list(p,{limit=100,pageToken=''}={}){let rows=[...this.docs].filter(([k])=>k.startsWith(p+'/')&&k.split('/').length===p.split('/').length+1).sort(([a],[b])=>a.localeCompare(b)).filter(([k])=>k>pageToken);let chunk=rows.slice(0,limit);return {items:chunk.map(([k,v])=>({...structuredClone(v),id:k.split('/').pop()})),nextPageToken:rows.length>limit?chunk.at(-1)[0]:null};}
 async all(p){return (await this.list(p,{limit:10000})).items;}
 write(p,data,previous){return {p,data,previous};}
 async commit(ws){for(const w of ws){const c=this.docs.get(w.p);if(w.previous!==undefined&&(w.previous===null?!!c:w.previous._updateTime!==c?._updateTime))throw new AppError(409,'Concurrent update');}for(const w of ws)this.docs.set(w.p,{...structuredClone(w.data),_updateTime:String(++this.serial)});}
 async put(p,d,old){return this.commit([this.write(p,d,old)]);}
}

const question={id:'quality-question',version:1,competencyId:'html',prompt:'Which option is correct?',options:['A','B','C'],correctIndex:1,explanation:'Original explanation',concept:'Basics',difficulty:'Beginner'};
const env={GEMINI_API_KEY:'test-key',GEMINI_MODEL:'test-model'};
const aiResponse=(result={verdict:'suspected-error',suggestedIndex:2,explanation:'Option C satisfies the stated condition.',verificationNeeded:'Check an authoritative reference.'})=>async()=>new Response(JSON.stringify({candidates:[{content:{parts:[{text:JSON.stringify(result)}]}}]}));
async function setup(){const db=new DB();await db.put('questions/'+question.id,question);await db.put('users/student/history/attempt',{id:'attempt',questionSnapshot:[question],answers:[2]});const call=(path,body={},extra={})=>qualityRoute(path,body,{db,user:{uid:'student',admin:false},env:{},...extra});const report=(extra={})=>call('questions/report',{historyId:'attempt',index:0,proposedIndex:2,reason:'I believe C meets the stated condition.',...extra});return {db,call,report};}
test('student report persists after one attempt, is deduplicated and never changes marks or key',async()=>{
 const h=await setup();assert.equal((await h.report()).saved,true);assert.equal((await h.report()).duplicate,true);const flag=await h.db.get('questionFlags/quality-question_v1');assert.equal(flag.reportCount,1);assert.equal(flag.status,'open');assert.equal((await h.db.get('questions/quality-question')).correctIndex,1);assert.equal(await h.db.get('progress/student'),null);
});
test('reporting and answer access require an owned terminal history snapshot',async()=>{
 const h=await setup();await assert.rejects(h.call('questions/report',{historyId:'../other',index:0,proposedIndex:2,reason:'This should fail.'}));await assert.rejects(h.call('questions/attempt',{historyId:'missing'}),e=>e.status===404);await assert.rejects(h.call('questions/attempt',{historyId:'attempt'},{user:{uid:'someone-else'}}),e=>e.status===404);await assert.rejects(h.report({index:2}));await assert.rejects(h.report({reference:'javascript:alert(1)'}));
});
test('automatic alert requires three distinct learners, maps shuffled choices and ignores repeated attempts',async()=>{
 const {db}=await setup();for(const uid of ['one','one','two']){const p=await qualityAssessmentWrites(db,uid,[question],[2]);await db.commit(p.writes);}assert.equal(await db.get('questionFlags/quality-question_v1'),null);
 const shuffled={...question,options:['C','A','B'],correctIndex:2};const p=await qualityAssessmentWrites(db,'three',[shuffled],[0]);await db.commit(p.writes);assert.deepEqual(p.flags,['quality-question_v1']);assert.equal((await db.get('questionSignals/quality-question_v1')).respondents,3);assert.deepEqual((await db.get('questionSignals/quality-question_v1')).counts,[0,0,3]);
});
test('AI can review one report without changing the key and caches a validated suggestion',async()=>{
 const h=await setup();await h.report();let calls=0;const fetcher=async(url,init)=>{calls++;assert.ok(!init.body.includes('users/student'));return aiResponse()();};const a=await qualityReview(h.db,env,'quality-question_v1',fetcher);assert.equal(a.status,'ready');assert.equal(a.suggestedIndex,2);assert.equal(a.sourcesVerified,false);await qualityReview(h.db,env,'quality-question_v1',fetcher);assert.equal(calls,1);assert.equal((await h.db.get('questions/quality-question')).correctIndex,1);
});
test('AI failure and malformed suggestions leave reports intact and scores untouched',async()=>{
 const h=await setup();await h.report();const r=await qualityReview(h.db,env,'quality-question_v1',aiResponse({verdict:'suspected-error',suggestedIndex:99,explanation:'Invalid',verificationNeeded:'Check'}));assert.equal(r.status,'unavailable');assert.equal((await h.db.get('questionFlags/quality-question_v1')).reportCount,1);assert.equal((await h.db.get('questions/quality-question')).correctIndex,1);
});
test('question changes during AI generation discard the stale recommendation',async()=>{
 const h=await setup();await h.report();const r=await qualityReview(h.db,env,'quality-question_v1',async()=>{const q=await h.db.get('questions/quality-question');await h.db.put('questions/quality-question',{...q,version:2,correctIndex:2},q);return aiResponse()();});assert.equal(r.status,'unavailable');assert.notEqual((await h.db.get('questionFlags/quality-question_v1')).ai.status,'ready');
});
test('AI review budget is bounded and reports still save when quota is exhausted',async()=>{
 const h=await setup();const day=new Date().toISOString().slice(0,10);await h.db.put('aiUsage/question_review_'+day,{count:10});await h.report();const r=await qualityReview(h.db,env,'quality-question_v1',()=>{throw new Error('Must not call provider');});assert.equal(r.status,'quota');assert.equal((await h.db.get('questionFlags/quality-question_v1')).status,'open');
});
test('students cannot inspect the admin queue or resolve flags; approval requires explicit verification',async()=>{
 const h=await setup();await h.report();await assert.rejects(h.call('admin/quality/list'),e=>e.status===403);await assert.rejects(h.call('admin/quality/resolve',{id:'quality-question_v1',status:'dismissed',reason:'Student attempts closure.'}),e=>e.status===403);
 const q=await h.db.get('questions/quality-question');const body={questionId:q.id,correctIndex:2,reason:'Teacher verified the answer.',expectedUpdateTime:q._updateTime,flagId:'quality-question_v1'};await assert.rejects(correctionRoute('admin/corrections/create',body,{db:h.db,user:{uid:'admin'}}),/verification/);assert.equal((await h.db.get('questions/quality-question')).correctIndex,1);
 const result=await correctionRoute('admin/corrections/create',{...body,verified:true},{db:h.db,user:{uid:'admin'}});assert.equal(result.flagId,'quality-question_v1');assert.equal((await h.db.get('questionFlags/quality-question_v1')).status,'correction-started');
});
test('admin decisions are audited and a new student report reopens a dismissed review',async()=>{
 const h=await setup();await h.report();await h.call('admin/quality/resolve',{id:'quality-question_v1',status:'dismissed',reason:'Verified against the reference.'},{user:{uid:'admin',admin:true}});assert.equal((await h.db.all('questionFlags/quality-question_v1/decisions')).length,1);await h.db.put('users/another/history/attempt',{id:'attempt',questionSnapshot:[question],answers:[2]});await h.call('questions/report',{historyId:'attempt',index:0,proposedIndex:2,reason:'Another independent explanation.'},{user:{uid:'another',admin:false}});assert.equal((await h.db.get('questionFlags/quality-question_v1')).status,'open');
});
test('uncertain AI reviews do not suggest a definitive answer',async()=>{
 const h=await setup();await h.report();const r=await qualityReview(h.db,env,'quality-question_v1',aiResponse({verdict:'uncertain',suggestedIndex:-1,explanation:'The wording is ambiguous.',verificationNeeded:'Clarify the premise.'}));assert.equal(r.status,'ready');assert.equal(r.suggestedIndex,-1);
});
test('student daily report cap rejects a sixth new question without losing existing reports',async()=>{
 const h=await setup();for(let i=0;i<6;i++){const q={...question,id:'q-'+i};await h.db.put('questions/'+q.id,q);await h.db.put('users/student/history/attempt-'+i,{id:'attempt-'+i,questionSnapshot:[q],answers:[2]});const pending=h.call('questions/report',{historyId:'attempt-'+i,index:0,proposedIndex:2,reason:'The proposed answer is incorrect.'});if(i<5)assert.equal((await pending).saved,true);else await assert.rejects(pending,e=>e.status===429);}assert.equal((await h.db.all('questionFlags')).length,5);
});
test('completed assessment API automatically requests AI review for queued candidates',async()=>{
 const h=await setup();await h.report();await h.db.put('users/student',{id:'student',careerId:'full-stack'});await h.db.put('sessions/student',{id:'session',status:'submitted',result:{completion:'submitted',qualityFlags:['quality-question_v1']}});
 const request=new Request('https://test/api/assessments/submit',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'session'})});const response=await handleAPI(request,{...env,FIREBASE_PROJECT_ID:'p',FIREBASE_API_KEY:'k',FIREBASE_AUTH_DOMAIN:'a',FIREBASE_APP_ID:'i',FIREBASE_SERVICE_ACCOUNT_JSON:'x'},{db:h.db,verify:async()=>({uid:'student',admin:false}),fetcher:aiResponse()});assert.equal(response.status,200);assert.equal((await h.db.get('questionFlags/quality-question_v1')).ai.status,'ready');
});

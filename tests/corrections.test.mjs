import test from 'node:test';
import assert from 'node:assert/strict';
import {correctionRoute} from '../server/corrections.js';
import {assessmentRoute} from '../server/assessments.js';
import {AppError,scoreQuestions} from '../server/engine.js';
import {handleAPI} from '../server/api.js';
import {SEED} from '../server/seed.js';
class DB{
 constructor(){this.docs=new Map();this.serial=0;}
 async get(p){return structuredClone(this.docs.get(p)||null);}
 async list(p,{limit=100,pageToken=''}={}){let rows=[...this.docs].filter(([k])=>k.startsWith(p+'/')&&k.split('/').length===p.split('/').length+1).sort(([a],[b])=>a.localeCompare(b)).filter(([k])=>k>pageToken);let chunk=rows.slice(0,limit);return {items:chunk.map(([k,v])=>({...structuredClone(v),id:k.split('/').pop()})),nextPageToken:rows.length>limit?chunk.at(-1)[0]:null};}
 async all(p){return (await this.list(p,{limit:10000})).items;}
 write(p,data,previous){return {p,data,previous};}
 async commit(ws){for(const w of ws){const c=this.docs.get(w.p);if(w.previous!==undefined&&(w.previous===null?!!c:w.previous._updateTime!==c?._updateTime))throw new AppError(409,'Concurrent update');}for(const w of ws)this.docs.set(w.p,{...structuredClone(w.data),_updateTime:String(++this.serial)});}
 async put(p,d,old){return this.commit([this.write(p,d,old)]);}
}
async function setup(){const db=new DB();for(const q of SEED.questions.filter(q=>q.competencyId==='html'))await db.put('questions/'+q.id,q);await db.put('users/student',{id:'student',careerId:'full-stack'});let now=1800000000000;
 const assessment=async(name,body={})=>assessmentRoute('assessments/'+name,body,{db,user:{uid:'student'},cat:{...SEED,questions:await db.all('questions')},profile:{careerId:'full-stack'},env:{},now:++now});
 const correction=(name,body={})=>correctionRoute('admin/corrections/'+name,body,{db,user:{uid:'admin',admin:true}});
 async function start(){await assessment('start',{competencyId:'html'});return db.get('sessions/student');}
 async function create(q){const original=await db.get('questions/'+q.id);return correction('create',{questionId:q.id,expectedUpdateTime:original._updateTime,correctIndex:(original.correctIndex+1)%original.options.length,reason:'The original answer key was incorrect.'});}
 async function finish(job){let r;do{r=await correction('process',{id:job.id});}while(['pending','processing'].includes(r.status));return r;}
 return {db,assessment,correction,start,create,finish};}
test('correction maps shuffled options by text and atomically updates score, evidence and history',async()=>{
 const h=await setup(),s=await h.start(),target=s.questions[0],original=await h.db.get('questions/'+target.id),correctText=original.options[(original.correctIndex+1)%original.options.length],answers=s.questions.map(q=>q.correctIndex);answers[0]=target.options.indexOf(correctText);
 await h.assessment('submit',{sessionId:s.id,answers});const before=await h.db.get('progress/student'),job=await h.create(target);assert.equal((await h.finish(job)).corrected,1);
 const progress=await h.db.get('progress/student'),history=(await h.db.all('users/student/history'))[0];assert.equal(history.marks,40);assert.equal(progress.scores.html,100);assert.ok(progress.revision>before.revision);assert.equal(history.corrections[0].beforeMarks,38.75);assert.deepEqual(history.questionSnapshot,s.questions);
 const review=await h.db.get('users/student/reviews/html');assert.equal(review.concepts.reduce((n,c)=>n+c.wrong,0),0);
 const stable=structuredClone(progress);await h.finish(job);assert.deepEqual(await h.db.get('progress/student'),stable);
});
test('active attempts apply the corrected key even when the history scan already finished',async()=>{
 const h=await setup(),s=await h.start(),q=s.questions[0],job=await h.create(q);await h.finish(job);const current=await h.db.get('questions/'+q.id),answers=s.questions.map(q=>q.correctIndex);answers[0]=q.options.indexOf(current.options[current.correctIndex]);const result=await h.assessment('submit',{sessionId:s.id,answers});assert.equal(result.marks,40);
});
test('later mastery is preserved when an older attempt is corrected',async()=>{
 const h=await setup(),s=await h.start();await h.assessment('submit',{sessionId:s.id,answers:s.questions.map(q=>q.correctIndex)});const next=await h.start();await h.assessment('submit',{sessionId:next.id,answers:Array(40).fill(null)});const job=await h.create(s.questions[0]);await h.finish(job);assert.equal((await h.db.get('progress/student')).scores.html,0);assert.equal((await h.db.get('users/student/reviews/html')).attempts,2);
});
test('overlapping jobs and stale administrator previews are rejected',async()=>{
 const h=await setup(),q=(await h.db.all('questions'))[0],job=await h.create(q);await assert.rejects(h.create(q),e=>e.status===409);await h.finish(job);await assert.rejects(h.correction('create',{questionId:q.id,correctIndex:q.correctIndex,expectedUpdateTime:q._updateTime,reason:'A second correction with stale data.'}),e=>e.status===409);
});
test('legacy shuffled indices are never guessed; guidance remains suppressed',async()=>{
 const h=await setup(),q=(await h.db.all('questions'))[0];await h.db.put('users/student/history/legacy',{id:'legacy',questionIds:[q.id],answers:[0],score:50});const job=await h.create(q),done=await h.finish(job);assert.equal(done.status,'needs-review');assert.equal(done.manualReview,1);assert.equal((await h.db.get('users/student/history/legacy')).score,50);assert.equal((await h.db.get('progress/student')).correctionPending,true);await assert.rejects(h.assessment('review',{competencyId:'html'}),e=>e.status===409);
});
test('interrupted page retries use receipts and do not duplicate score adjustments',async()=>{
 const h=await setup(),s=await h.start();await h.assessment('submit',{sessionId:s.id,answers:s.questions.map(q=>q.correctIndex)});const job=await h.create(s.questions[0]),commit=h.db.commit.bind(h.db);let fail=true;h.db.commit=async ws=>{if(fail&&ws.some(w=>w.p==='corrections/'+job.id)){fail=false;throw new AppError(503,'Interrupted checkpoint');}return commit(ws);};await assert.rejects(h.finish(job));const progress=await h.db.get('progress/student');const done=await h.finish(job);assert.equal(done.corrected,1);assert.deepEqual(await h.db.get('progress/student'),progress);assert.equal((await h.db.all('users/student/history'))[0].corrections.length,1);
});
test('a concurrent progress write aborts all score/evidence/history correction writes and retries safely',async()=>{
 const h=await setup(),s=await h.start();await h.assessment('submit',{sessionId:s.id,answers:s.questions.map(q=>q.correctIndex)});const job=await h.create(s.questions[0]),commit=h.db.commit.bind(h.db);let race=true;h.db.commit=async ws=>{if(race&&ws.some(w=>w.p==='progress/student')){race=false;const p=await h.db.get('progress/student');await commit([h.db.write('progress/student',{...p,completedModules:['saved-concurrently'],revision:p.revision+1},p)]);}return commit(ws);};await assert.rejects(h.finish(job),e=>e.status===409);assert.equal((await h.db.all('users/student/history'))[0].corrections,undefined);await h.finish(job);assert.deepEqual((await h.db.get('progress/student')).completedModules,['saved-concurrently']);
});
test('correction endpoints require server-verified administrator authorization',async()=>{
 const env={FIREBASE_PROJECT_ID:'p',FIREBASE_API_KEY:'k',FIREBASE_AUTH_DOMAIN:'a',FIREBASE_APP_ID:'i',FIREBASE_SERVICE_ACCOUNT_JSON:'x'};const request=new Request('https://test/api/admin/corrections/create',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});const response=await handleAPI(request,env,{db:new DB(),verify:async()=>({uid:'learner',admin:false})});assert.equal(response.status,403);
});
test('history and user pagination complete without missing older attempts',async()=>{
 const h=await setup(),q=(await h.db.all('questions'))[0];for(const uid of ['student','student-two']){await h.db.put('users/'+uid,{id:uid});for(let i=0;i<12;i++)await h.db.put(`users/${uid}/history/${String(i).padStart(3,'0')}`,{id:String(i).padStart(3,'0'),questionIds:[q.id],answers:[0],score:50});}
 const job=await h.create(q),done=await h.finish(job);assert.equal(done.scanned,24);assert.equal(done.manualReview,24);assert.equal((await h.db.all(`corrections/${job.id}/receipts`)).length,24);
});
test('successive corrections reconcile earlier versions from authoritative answers',async()=>{
 const h=await setup(),s=await h.start();await h.assessment('submit',{sessionId:s.id,answers:s.questions.map(q=>q.correctIndex)});await h.finish(await h.create(s.questions[0]));await h.finish(await h.create(s.questions[0]));const history=(await h.db.all('users/student/history'))[0],current=await h.db.get('questions/'+s.questions[0].id);assert.equal(history.corrections.length,2);const expected=s.questions.map(q=>q.id===current.id?{...q,correctIndex:q.options.indexOf(current.options[current.correctIndex])}:q);assert.equal(history.marks,scoreQuestions(expected,history.answers).marks);assert.equal((await h.db.get('users/student/reviews/html')).attempts,1);
});

test('approved repair removes the incorrect weakness while retaining original answers and graph evidence',async()=>{
 const h=await setup(),s=await h.start(),target=s.questions[0],q=await h.db.get('questions/'+target.id);
 const answers=s.questions.map(q=>q.correctIndex);answers[0]=target.options.indexOf(q.options[(q.correctIndex+1)%q.options.length]);
 const result=await h.assessment('submit',{sessionId:s.id,answers});
 const graph=await h.db.get(`users/student/graphVersions/${result.historyId}`);
 const before=await h.assessment('review',{competencyId:'html'});assert.ok(before.topics.some(t=>t.concept===target.concept));
 const job=await h.create(target);await assert.rejects(h.assessment('review',{competencyId:'html'}),e=>e.status===409);
 await h.finish(job);
 const after=await h.assessment('review',{competencyId:'html'});assert.equal(after.topics.length,0);assert.equal(after.attempts,1);
 const history=await h.db.get(`users/student/history/${result.historyId}`);
 assert.deepEqual(history.answers,answers);assert.deepEqual(history.questionSnapshot,s.questions);
 assert.equal(history.marks-result.marks,1.25);
 assert.deepEqual(await h.db.get(`users/student/graphVersions/${result.historyId}`),graph);
 assert.equal((await h.db.get('sessions/student')).result.marks,40);
 assert.equal((await h.correction('audit',{id:job.id})).items[0].outcome,'corrected');
});

test('corrections invalidate the saved journey and regeneration uses repaired mastery',async()=>{
 const h=await setup();
 for(const collection of ['competencies','careers','modules'])for(const r of SEED[collection])await h.db.put(collection+'/'+r.id,r);
 const env={FIREBASE_PROJECT_ID:'p',FIREBASE_API_KEY:'k',FIREBASE_AUTH_DOMAIN:'a',FIREBASE_APP_ID:'i',FIREBASE_SERVICE_ACCOUNT_JSON:'x'};
 const call=async(path,method='GET')=>{const response=await handleAPI(new Request('https://test/api/'+path,{method,...(method==='POST'?{headers:{'Content-Type':'application/json'},body:'{}'}:{})}),env,{db:h.db,verify:async()=>({uid:'student',email:'student@example.test',admin:false})});assert.equal(response.status,200);return response.json();};
 const s=await h.start();await h.assessment('submit',{sessionId:s.id,answers:s.questions.map(q=>q.correctIndex)});
 const saved=await call('journey/generate','POST');assert.ok((await call('bootstrap')).journey);
 const job=await h.create(s.questions[0]);const during=await call('bootstrap');assert.equal(during.correctionPending,true);assert.equal(during.journey,null);
 await h.finish(job);const after=await call('bootstrap');assert.equal(after.correctionPending,false);assert.equal(after.journey,null);
 const refreshed=await call('journey/generate','POST');assert.notEqual(refreshed.fingerprint,saved.fingerprint);assert.equal(refreshed.progressRevision,after.progress.revision);
 assert.equal(refreshed.correctionRevision,(await h.db.get('metadata/corrections')).revision);
 assert.equal((await call('bootstrap')).journey.fingerprint,refreshed.fingerprint);
});

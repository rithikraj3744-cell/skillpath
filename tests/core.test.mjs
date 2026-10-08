import test from 'node:test';
import assert from 'node:assert/strict';
import {AppError,topo,pathway,scoreQuestions,validateAI,validateRecord,validateCatalog} from '../server/engine.js';
import {configuration,verifyUser,toValue,fromValue} from '../server/firebase.js';
import {handleAPI} from '../server/api.js';
import {SEED} from '../server/seed.js';
const env={FIREBASE_PROJECT_ID:'test-project',FIREBASE_API_KEY:'public-key',FIREBASE_AUTH_DOMAIN:'test.firebaseapp.com',FIREBASE_APP_ID:'app-test',FIREBASE_SERVICE_ACCOUNT_JSON:'secret-value',ADMIN_UIDS:'admin'};
class MemoryDB{
 constructor(){this.docs=new Map();this.serial=0;}
 async get(p){return structuredClone(this.docs.get(p)||null);}
 async list(p,{limit=100}={}){const items=[...this.docs].filter(([k])=>k.startsWith(p+'/')&&k.split('/').length===p.split('/').length+1).sort(([a],[b])=>a.localeCompare(b)).slice(0,limit).map(([k,v])=>({...structuredClone(v),id:k.split('/').pop()}));return {items,nextPageToken:null};}
 async all(p){return (await this.list(p,{limit:10000})).items;}
 write(p,data,previous){return {p,data,previous};}
 remove(p,previous){return {p,previous,remove:true};}
 async commit(writes){for(const w of writes){const current=this.docs.get(w.p);if(w.previous!==undefined){if(w.previous===null&&current||w.previous!==null&&current?._updateTime!==w.previous._updateTime)throw new AppError(409,'Data changed in another session.');}}for(const w of writes){if(w.remove)this.docs.delete(w.p);else this.docs.set(w.p,{...structuredClone(w.data),_updateTime:'v'+(++this.serial)});}return {};}
 async put(p,d,prev){await this.commit([this.write(p,d,prev)]);return d;}
}
const verifier=async req=>{const uid=req.headers.get('authorization')?.slice(7);if(!uid)throw new AppError(401,'Sign in.');return {uid,email:uid+'@test.invalid',name:uid,admin:uid==='admin'};};
function client(db,uid='admin',overrides={}){return async(path,method='GET',body)=>{const req=new Request('https://test.local/api/'+path,{method,headers:{...(uid?{authorization:'Bearer '+uid}:{}),...(method!=='GET'?{'content-type':'application/json'}:{})},body:body!==undefined?JSON.stringify(body):undefined});const res=await handleAPI(req,{...env,...overrides},{db,verify:verifier});return {status:res.status,data:await res.json()};};}
async function seeded(){const db=new MemoryDB(),admin=client(db);let r;do{r=await admin('admin/seed','POST',{});assert.equal(r.status,200);}while(r.data.remaining>0);return {db,admin};}
async function enrolled(db,uid='student'){const call=client(db,uid);const r=await call('profile','PUT',{name:'Learner',careerId:'full-stack',weeklyStudyHours:7});assert.equal(r.status,200);return call;}
test('catalog is acyclic and required prerequisites precede dependents',()=>{validateCatalog(SEED);const nodes=pathway(SEED,'full-stack',{});assert.equal(nodes.length,13);assert.equal(nodes.find(n=>n.id==='rest').status,'locked');assert.equal(nodes.find(n=>n.id==='html').status,'available');assert.throws(()=>topo([{id:'a',prerequisites:['b']},{id:'b',prerequisites:['a']}]),/cycle/);});
test('scoring identifies weak concepts and mastery unlocks dependencies',()=>{const qs=SEED.questions.filter(q=>q.competencyId==='async');const result=scoreQuestions(qs,qs.map(q=>q.correctIndex));assert.equal(result.scores.async,100);assert.equal(pathway(SEED,'full-stack',{scores:{async:100}}).find(n=>n.id==='rest').status,'available');assert.throws(()=>scoreQuestions(qs,[]),/every/);const poor=scoreQuestions(qs,qs.map(q=>(q.correctIndex+1)%q.options.length));assert.equal(poor.scores.async,0);assert.equal(poor.weakConcepts.async.length,new Set(qs.map(q=>q.concept)).size);});
test('AI schema validation rejects unknown stages and enforces deterministic order',()=>{const nodes=pathway(SEED,'frontend',{});const stages=nodes.map(n=>({competencyId:n.id,reason:'Practice',objectives:['Learn'],estimatedHours:2})).reverse();const validated=validateAI({summary:'Plan',stages},nodes);assert.deepEqual(validated.stages.map(s=>s.competencyId),nodes.map(n=>n.id));stages[0].competencyId='unknown';assert.throws(()=>validateAI({summary:'Plan',stages},nodes),/unknown/);});
test('record validation rejects unsafe URLs, duplicate choices, and invalid IDs',()=>{assert.throws(()=>validateRecord('modules',{...SEED.modules[0],resources:[{label:'Bad',url:'javascript:alert(1)'}]},'test'),/HTTPS/);assert.throws(()=>validateRecord('questions',{...SEED.questions[0],options:['same','same']},'test'),/distinct/);assert.throws(()=>validateRecord('competencies',SEED.competencies[0],'constructor'),/ID/);});
test('Firestore typed encoding preserves nested application records',()=>{const sample={name:'Learner',scores:{html:90},active:true,progress:.5,empty:null,arr:[1,'two',{nested:[]} ]};assert.deepEqual(fromValue(toValue(sample)),sample);});
test('configuration endpoint does not expose service-account or Gemini secrets',async()=>{const db=new MemoryDB();const r=await client(db,'admin',{GEMINI_API_KEY:'super-secret',GEMINI_MODEL:'test-model'})('config');assert.equal(r.status,200);assert.equal(r.data.ready,true);assert.ok(!JSON.stringify(r.data).includes('secret'));assert.equal(configuration({}).ready,false);});
test('actual authentication verifier rejects missing and disabled users',async()=>{await assert.rejects(()=>verifyUser(new Request('https://x'),env),e=>e.status===401);const payload=Buffer.from(JSON.stringify({aud:'test-project',iss:'https://securetoken.google.com/test-project',sub:'student'})).toString('base64url');const req=new Request('https://x',{headers:{authorization:'Bearer header.'+payload+'.signature'}});await assert.rejects(()=>verifyUser(req,env,async()=>new Response(JSON.stringify({users:[{localId:'admin',disabled:true}]}))),e=>e.status===401);const u=await verifyUser(req,env,async()=>new Response(JSON.stringify({users:[{localId:'student'}]})));assert.equal(u.admin,false);});
test('student cannot inspect or mutate admin catalog',async()=>{const {db}=await seeded(),student=client(db,'student');assert.equal((await student('admin/data')).status,403);assert.equal((await student('admin/seed','POST',{})).status,403);assert.equal((await student('admin/competencies/html','DELETE',{})).status,403);assert.equal((await client(db,null)('bootstrap')).status,401);});
test('seed is idempotent and admin writes enforce stale-edit and reference checks',async()=>{const {db,admin}=await seeded();assert.equal((await admin('admin/seed','POST',{})).data.added,0);let html=await db.get('competencies/html');assert.equal((await admin('admin/competencies/html','DELETE',{expectedUpdateTime:html._updateTime})).status,400);assert.equal((await admin('admin/competencies/html','PUT',{record:{...html,name:'Updated HTML'},expectedUpdateTime:html._updateTime})).status,200);assert.equal((await admin('admin/competencies/html','PUT',{record:html,expectedUpdateTime:html._updateTime})).status,409);html=await db.get('competencies/html');assert.equal((await admin('admin/competencies/html','PUT',{record:{...html,prerequisites:['javascript']},expectedUpdateTime:html._updateTime})).status,400);});
test('admin can add/edit/delete records; learners see saved content without question answers',async()=>{const {db,admin}=await seeded();const r={id:'new-skill',name:'New Skill',description:'Learn something',category:'Other',difficulty:'Beginner',requiredLevel:90,prerequisites:[]};assert.equal((await admin('admin/competencies/new-skill','PUT',{record:r,expectedUpdateTime:null})).status,200);const student=await enrolled(db),state=(await student('bootstrap')).data;assert.ok(state.catalog.competencies.some(n=>n.id==='new-skill'));assert.equal(state.catalog.questions,undefined);const record=await db.get('competencies/new-skill');assert.equal((await admin('admin/competencies/new-skill','DELETE',{expectedUpdateTime:record._updateTime})).status,200);});
test('profile ownership cannot be overridden and private histories are scoped by UID',async()=>{const {db}=await seeded(),a=await enrolled(db,'alice'),b=await enrolled(db,'bob');await a('profile','PUT',{uid:'bob',name:'Alice Updated',weeklyStudyHours:9,careerId:'frontend',role:'admin'});assert.equal((await b('bootstrap')).data.profile.name,'Learner');assert.equal((await a('bootstrap')).data.user.admin,false);});
test('locked modules and targeted quizzes reject access',async()=>{const {db}=await seeded(),call=await enrolled(db);assert.equal((await call('modules/complete','POST',{moduleId:'rest-module'})).status,403);assert.equal((await call('assessments/start','POST',{competencyId:'rest'})).status,403);assert.equal((await call('modules/complete','POST',{moduleId:'html-module'})).status,200);});
test('assessment saves scores, history and graph snapshot atomically; replay cannot rescore',async()=>{const {db}=await seeded(),call=await enrolled(db);const start=await call('assessments/start','POST',{});assert.equal(start.status,200);assert.ok(start.data.questions.length>0);assert.equal(start.data.questions[0].correctIndex,undefined);assert.equal(start.data.questions[0].explanation,undefined);const session=await db.get('sessions/student');const answers=session.questions.map(q=>q.correctIndex);const submitted=await call('assessments/submit','POST',{sessionId:session.id,answers});assert.equal(submitted.status,200);assert.equal(submitted.data.overall,100);const replay=await call('assessments/submit','POST',{sessionId:session.id,answers:answers.map(()=>5)});assert.equal(replay.data.overall,100);const state=(await call('bootstrap')).data;assert.equal(state.history.length,1);assert.equal(state.nodes.filter(n=>n.status==='mastered').length,1);assert.equal((await db.all('users/student/graphVersions')).length,1);});
test('assessment snapshot survives admin changes and failed submissions leave progress unchanged',async()=>{const {db}=await seeded(),call=await enrolled(db);const start=await call('assessments/start','POST',{competencyId:'html'});const r=await call('assessments/submit','POST',{sessionId:start.data.id,answers:[99]});assert.equal(r.status,400);assert.equal(await db.get('progress/student'),null);assert.equal((await db.get('sessions/student')).status,'active');});
test('fallback roadmap persists and invalidates when the catalog changes',async()=>{const {db,admin}=await seeded(),call=await enrolled(db);const result=await call('journey/generate','POST',{});assert.equal(result.status,200);assert.equal(result.data.source,'rules');assert.equal((await call('journey/generate','POST',{})).data.cached,true);const record=await db.get('competencies/html');await admin('admin/competencies/html','PUT',{record:{...record,description:'Revised description'},expectedUpdateTime:record._updateTime});assert.equal((await call('bootstrap')).data.journey,null);});
test('AI daily quota blocks generation without losing saved scores',async()=>{const {db}=await seeded();await enrolled(db);await db.put('aiUsage/student_'+new Date().toISOString().slice(0,10),{count:5});const call=client(db,'student',{GEMINI_API_KEY:'test',GEMINI_MODEL:'test'});const r=await call('journey/generate','POST',{});assert.equal(r.status,429);assert.equal((await call('bootstrap')).status,200);});
test('cross-origin writes are rejected',async()=>{const req=new Request('https://test.local/api/admin/seed',{method:'POST',headers:{origin:'https://evil.test','content-type':'application/json'},body:'{}'});const r=await handleAPI(req,env,{db:new MemoryDB(),verify:verifier});assert.equal(r.status,403);});

test('Gemini response is validated, cached, and safely handles upstream failures',async()=>{
 const {db}=await seeded();await enrolled(db);const aiEnv={...env,GEMINI_API_KEY:'test-ai-key',GEMINI_MODEL:'test-model'};
 const req=()=>new Request('https://test.local/api/journey/generate',{method:'POST',headers:{authorization:'Bearer student','content-type':'application/json'},body:'{}'});
 let calls=0;const fetcher=async(url,options)=>{calls++;assert.ok(url.includes('test-model'));assert.equal(options.headers['x-goog-api-key'],'test-ai-key');const stages=pathway(SEED,'full-stack',{}).map(n=>({competencyId:n.id,reason:'Learn the prerequisite skill',objectives:['Practise the concept'],estimatedHours:2}));return new Response(JSON.stringify({candidates:[{content:{parts:[{text:JSON.stringify({summary:'A focused pathway',stages})}]}}]}));};
 let response=await handleAPI(req(),aiEnv,{db,verify:verifier,fetcher});assert.equal(response.status,200);assert.equal((await response.json()).source,'gemini');response=await handleAPI(req(),aiEnv,{db,verify:verifier,fetcher});assert.equal((await response.json()).cached,true);assert.equal(calls,1);
 db.docs.delete('journeys/student');response=await handleAPI(req(),aiEnv,{db,verify:verifier,fetcher:async()=>new Response('quota',{status:429})});assert.equal(response.status,429);assert.equal(await db.get('journeys/student'),null);
 response=await handleAPI(req(),aiEnv,{db,verify:verifier,fetcher:async()=>new Response(JSON.stringify({candidates:[{content:{parts:[{text:'not JSON'}]}}]}))});assert.equal(response.status,502);assert.equal(await db.get('journeys/student'),null);
});

test('admin invalid record IDs produce actionable validation instead of a missing route',async()=>{
 const {db,admin}=await seeded();
 for(const id of ['Python - Basics','python - basics','bad/id','constructor']){
  const response=await admin('admin/competencies/'+encodeURIComponent(id),'PUT',{record:{...SEED.competencies[0],id}});
  assert.equal(response.status,400);assert.match(response.data.error,/Record ID/);
 }
 assert.equal(await db.get('competencies/Python - Basics'),null);
 const response=await admin('admin/competencies/python-basics','PUT',{record:{...SEED.competencies[0],name:'Python – For Beginners'},expectedUpdateTime:null});
 assert.equal(response.status,200);assert.equal((await db.get('competencies/python-basics')).name,'Python – For Beginners');
});

test('ID suggestions normalize the exact reported inputs and enforce valid boundaries',async()=>{
 const {suggestRecordId,validRecordId}=await import('../public/js/record-id.js');
 for(const label of ['Python - Basics','python - basics','Python / Basics'])assert.equal(suggestRecordId(label),'python-basics');
 assert.equal(suggestRecordId('Café Basics'),'cafe-basics');
 assert.equal(validRecordId(suggestRecordId('constructor')),true);
 assert.equal(validRecordId('python - basics'),false);
 assert.equal(validRecordId('a'.repeat(81)),false);
 assert.equal(validRecordId('a'.repeat(80)),true);
});

test('shared AI quota stops a second learner without consuming their personal quota',async()=>{
 const {db}=await seeded();await enrolled(db,'second');
 const date=new Date().toISOString().slice(0,10);await db.put('aiUsage/global_'+date,{count:2});
 const call=client(db,'second',{GEMINI_API_KEY:'test',GEMINI_MODEL:'test',AI_GLOBAL_DAILY_LIMIT:'2'});
 const result=await call('journey/generate','POST',{});assert.equal(result.status,429);assert.match(result.data.error,/shared AI/);
 assert.equal(await db.get('aiUsage/second_'+date),null);assert.equal((await call('bootstrap')).status,200);
});

test('AI generation refuses a result after the learner changes career',async()=>{
 const {db}=await seeded();await enrolled(db);
 const request=new Request('https://test.local/api/journey/generate',{method:'POST',headers:{authorization:'Bearer student','content-type':'application/json'},body:'{}'});
 const response=await handleAPI(request,{...env,GEMINI_API_KEY:'test',GEMINI_MODEL:'test'},{db,verify:verifier,fetcher:async()=>{
  const profile=await db.get('users/student');await db.put('users/student',{...profile,careerId:'frontend'},profile);
  const stages=pathway(SEED,'full-stack',{}).map(n=>({competencyId:n.id,reason:'Learn',objectives:['Practice'],estimatedHours:2}));
  return new Response(JSON.stringify({candidates:[{content:{parts:[{text:JSON.stringify({summary:'Plan',stages})}]}}]}));
 }});
 assert.equal(response.status,409);assert.equal(await db.get('journeys/student'),null);
});

test('liveness reveals no credentials and non-object payloads receive a clear client error',async()=>{
 const db=new MemoryDB();const call=client(db);
 assert.deepEqual((await call('health')).data,{status:'ok',version:'1.5.0'});
 for(const input of [null,[],123])assert.equal((await call('profile','PUT',input)).status,400);
});

test('Google identity bootstraps a profile once without resetting saved learner goals',async()=>{
 const db=new MemoryDB();const request=()=>new Request('https://test.local/api/bootstrap');
 const user={uid:'google-user',email:'student@example.com',name:'Google Learner',admin:false};
 const call=()=>handleAPI(request(),env,{db,verify:async()=>user});
 const first=await (await call()).json();assert.equal(first.profile.name,'Google Learner');assert.equal(first.user.admin,false);
 const existing=await db.get('users/google-user');await db.put('users/google-user',{...existing,careerId:'frontend',weeklyStudyHours:12},existing);
 const next=await (await call()).json();assert.equal(next.profile.careerId,'frontend');assert.equal(next.profile.weeklyStudyHours,12);
});
test('new careers support a 40-question competency assessment, persisted mastery, and lesson access',async()=>{
 for(const careerId of ['data-analyst','applied-ai']){
  const {db}=await seeded();const call=client(db,'student');
  assert.equal((await call('profile','PUT',{name:'Learner',careerId,weeklyStudyHours:6})).status,200);
  const started=await call('assessments/start','POST',{});assert.equal(started.status,200);
  assert.ok(started.data.questions.every(q=>!('correctIndex' in q)&&!('explanation' in q)));
  const session=await db.get('sessions/student');
  for(const q of session.questions){const original=SEED.questions.find(item=>item.id===q.id);assert.equal(q.options[q.correctIndex],original.options[original.correctIndex]);}
  const submitted=await call('assessments/submit','POST',{sessionId:session.id,answers:session.questions.map(q=>q.correctIndex)});
  assert.equal(submitted.data.overall,100);const state=(await call('bootstrap')).data;
  assert.equal(state.nodes.filter(n=>n.status==='mastered').length,1);assert.equal(state.history.length,1);
  assert.equal((await call('modules/complete','POST',{moduleId:'python-module'})).status,200);
 }
});
test('completed pathways do not consume AI allowance or call the provider',async()=>{
 const {db}=await seeded();await enrolled(db);
 await db.put('progress/student',{scores:Object.fromEntries(pathway(SEED,'full-stack',{}).map(n=>[n.id,100])),weakConcepts:{},completedModules:[],revision:1});
 const request=new Request('https://test.local/api/journey/generate',{method:'POST',headers:{authorization:'Bearer student','content-type':'application/json'},body:'{}'});
 let calls=0;const response=await handleAPI(request,{...env,GEMINI_API_KEY:'test',GEMINI_MODEL:'test-model'},{db,verify:verifier,fetcher:async()=>{calls++;}});
 assert.equal(response.status,200);assert.deepEqual((await response.json()).stages,[]);assert.equal(calls,0);assert.equal((await db.all('aiUsage')).length,0);
});

test('all twenty careers can be selected and switching preserves progress but replaces the roadmap',async()=>{
 const {db}=await seeded(),call=await enrolled(db);await db.put('progress/student',{scores:{html:100,python:100},weakConcepts:{},completedModules:['html-module'],revision:1});
 for(const career of SEED.careers){
  assert.equal((await call('profile','PUT',{name:'Learner',careerId:career.id,weeklyStudyHours:7})).status,200);
  const state=(await call('bootstrap')).data;
  assert.equal(state.profile.careerId,career.id);
  assert.deepEqual(state.nodes.map(n=>n.id),pathway(SEED,career.id,state.progress).map(n=>n.id));
  assert.equal(state.progress.scores.html,100);assert.deepEqual(state.progress.completedModules,['html-module']);
  const generated=await call('journey/generate','POST',{});assert.equal(generated.status,200);
  assert.deepEqual(generated.data.stages.map(s=>s.competencyId),state.nodes.filter(n=>n.status!=='mastered').map(n=>n.id));
 }
});
test('an active assessment from a previous career cannot update the new pathway',async()=>{
 const {db}=await seeded(),call=await enrolled(db);const start=await call('assessments/start','POST',{});const old=await db.get('sessions/student');
 await call('profile','PUT',{name:'Learner',careerId:'data-engineer',weeklyStudyHours:7});
 const response=await call('assessments/submit','POST',{sessionId:start.data.id,answers:old.questions.map(q=>q.correctIndex)});
 assert.equal(response.status,409);assert.match(response.data.error,/career changed/);assert.equal(await db.get('progress/student'),null);
});
test('resource upgrade changes only old defaults, preserves learner data, and is idempotent',async()=>{
 const {LEGACY_LESSONS}=await import('../server/seed.js');const {db,admin}=await seeded();
 await db.put('modules/html-module',{...SEED.modules.find(m=>m.id==='html-module'),...LEGACY_LESSONS['html-module'],title:'My custom title'});
 await db.put('modules/css-module',{...SEED.modules.find(m=>m.id==='css-module'),resources:[{label:'My course',url:'https://example.com/course'}]});
 await db.put('progress/student',{scores:{html:100},completedModules:['html-module'],revision:4});
 const before=await db.get('progress/student');
 assert.equal((await admin('admin/seed','POST',{})).data.updated,0);
 const response=await admin('admin/seed','POST',{refreshResources:true});assert.equal(response.status,200);assert.equal(response.data.updated,1);assert.equal(response.data.preserved,1);
 const lesson=await db.get('modules/html-module');assert.equal(lesson.title,'My custom title');assert.deepEqual(lesson.resources,SEED.modules.find(m=>m.id==='html-module').resources);
 assert.equal((await db.get('modules/css-module')).resources[0].label,'My course');assert.deepEqual(await db.get('progress/student'),before);
 assert.equal((await admin('admin/seed','POST',{refreshResources:true})).data.updated,0);
});
test('custom lesson IDs do not block adding the career library or create duplicate lessons',async()=>{
 const {db,admin}=await seeded();const original=await db.get('modules/html-module');db.docs.delete('modules/html-module');await db.put('modules/custom-html',{...original,id:'custom-html'});
 const response=await admin('admin/seed','POST',{refreshResources:true});assert.equal(response.status,200);assert.ok(response.data.preserved>=1);assert.equal(await db.get('modules/html-module'),null);assert.ok(await db.get('modules/custom-html'));
});

test('assessment policy enforces exactly forty questions, private answer keys and a stable session',async()=>{
 const {db}=await seeded(),call=await enrolled(db);const first=await call('assessments/start','POST',{competencyId:'html'}),second=await call('assessments/start','POST',{competencyId:'html'});
 assert.equal(first.data.questions.length,40);assert.equal(new Set(first.data.questions.map(q=>q.id)).size,40);assert.equal(first.data.id,second.data.id);assert.equal(first.data.policy.passPercent,60);
 assert.ok(first.data.questions.every(q=>!('correctIndex'in q)&&!('explanation'in q)));
 db.docs.delete('questions/'+first.data.questions[0].id);db.docs.delete('sessions/student');const short=await call('assessments/start','POST',{competencyId:'html'});assert.equal(short.status,409);assert.match(short.data.error,/1 more/);
});
test('negative marking uses net marks, supports skips and evaluates the exact pass boundary',()=>{
 const questions=SEED.questions.filter(q=>q.competencyId==='html');
 const grade=(right,wrong)=>scoreQuestions(questions,questions.map((q,i)=>i<right?q.correctIndex:i<right+wrong?(q.correctIndex+1)%q.options.length:null));
 const pass=grade(24,0);assert.equal(pass.overall,60);assert.equal(pass.passed,true);assert.equal(pass.unanswered,16);
 const fail=grade(27,13);assert.equal(fail.marks,23.75);assert.equal(fail.overall,59.38);assert.equal(fail.passed,false);
 assert.equal(grade(28,12).overall,62.5);assert.equal(grade(28,12).passed,true);
 assert.equal(grade(0,40).marks,-10);assert.equal(grade(0,40).overall,0);assert.equal(grade(0,0).overall,0);
 assert.equal(pathway(SEED,'frontend',{scores:{html:60}}).find(n=>n.id==='css').status,'available');
 assert.equal(pathway(SEED,'frontend',{scores:{html:59.38}}).find(n=>n.id==='css').status,'locked');
});
test('old scoring sessions are replaced and cannot submit under the new policy',async()=>{
 const {db}=await seeded(),call=await enrolled(db);await call('assessments/start','POST',{competencyId:'html'});const old=await db.get('sessions/student');delete old.policy;await db.put('sessions/student',old);
 const reject=await call('assessments/submit','POST',{sessionId:old.id,answers:old.questions.map(q=>q.correctIndex)});assert.equal(reject.status,409);
 const next=await call('assessments/start','POST',{competencyId:'html'});assert.notEqual(next.data.id,old.id);
});
test('Excel import is admin-only, atomic per batch, idempotent and preserves existing questions',async()=>{
 const {db,admin}=await seeded(),student=client(db,'student');const sample={...SEED.questions[0],id:'import-test',prompt:'A unique teacher question?'};
 assert.equal((await student('admin/questions/import','POST',{records:[sample]})).status,403);
 assert.equal((await admin('admin/questions/import','POST',{records:[sample,{...sample,id:'bad',competencyId:'unknown'}]})).status,400);assert.equal(await db.get('questions/import-test'),null);
 const first=await admin('admin/questions/import','POST',{records:[sample]});assert.deepEqual(first.data,{imported:1,skipped:0});
 const duplicate=await admin('admin/questions/import','POST',{records:[{...sample,correctIndex:1}]});assert.deepEqual(duplicate.data,{imported:0,skipped:1});assert.equal((await db.get('questions/import-test')).correctIndex,sample.correctIndex);
 assert.deepEqual((await admin('admin/questions/import','POST',{records:[{...sample,id:'different-id'}]})).data,{imported:0,skipped:1});
 assert.equal((await admin('admin/questions/import','POST',{records:[{...sample,prompt:'Conflicting question with the same ID'}]})).status,409);
 assert.equal((await admin('admin/questions/import','POST',{records:Array(41).fill(sample)})).status,400);
});
test('large seed updates are bounded, resumable, complete and preserve custom questions',async()=>{
 const db=new MemoryDB(),admin=client(db);await db.put('questions/custom',{...SEED.questions[0],id:'custom',prompt:'Custom preserved question'});let calls=0,total=0,r;
 do{r=await admin('admin/seed','POST',{});assert.equal(r.status,200);assert.ok(r.data.processed<=350);total+=r.data.added;calls++;assert.ok(calls<10);}while(r.data.remaining);
 assert.ok(calls>1);assert.equal(total,1490);assert.equal((await db.all('questions')).length,1401);assert.equal((await db.get('questions/custom')).prompt,'Custom preserved question');
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {parseQuestionRows,identifyImportedQuestions,importBatches} from '../public/js/question-import.js';
import {handleRecovery} from '../server/recovery.js';
import {handleAPI} from '../server/api.js';
import {AppError} from '../server/engine.js';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
const competencies=[{id:'html',name:'HTML Foundations'},{id:'css',name:'CSS'}];
const headings=['Skill','Question text','Option A','Option B','Answer key','Rationale'];
test('Excel headings, title rows, competency names and three answer formats are detected',()=>{
 const parsed=parseQuestionRows([['Teacher question bank'],headings,['HTML Foundations','Q1','main','span','A','Landmark'],['html','Q2','yes','no',2,'Review'],['CSS','Q3','red','blue','blue','Color']],competencies);
 assert.equal(parsed.headerRow,2);assert.deepEqual(parsed.rows.map(r=>r.record.correctIndex),[0,1,1]);assert.ok(parsed.rows.every(r=>r.errors.length===0));assert.equal(parsed.rows[0].record.competencyId,'html');
});
test('ambiguous answers, duplicate questions, option gaps and missing fields stop import',()=>{
 const rows=parseQuestionRows([headings,['html','Q','2','4','2',''],['html','Q','same','same','A',''],['unknown','','one','two','C','']],competencies).rows;
 assert.ok(rows[0].errors.some(e=>e.includes('ambiguous')));assert.ok(rows[1].errors.some(e=>e.includes('Duplicate')));assert.ok(rows[1].errors.some(e=>e.includes('distinct')));assert.ok(rows[2].errors.length>=3);
 assert.throws(()=>parseQuestionRows([['Question','Unrecognized']],competencies),/header/);
 const gap=parseQuestionRows([['Question','Option A','Option B','Option C','Correct Answer'],['Q','one','','three','A']],competencies,'html');assert.ok(gap.rows[0].errors.some(e=>e.includes('consecutive')));
});
test('import IDs are stable and batching respects byte and record limits',async()=>{
 const rows=parseQuestionRows([headings,['html','Q1','one','two','A',''],['html','Q2','one','two','B','']],competencies).rows;
 const first=await identifyImportedQuestions(rows);assert.deepEqual(await identifyImportedQuestions(rows),first);assert.notEqual(first[0].id,first[1].id);
 const batches=importBatches(Array.from({length:100},(_,i)=>({...first[0],id:'item-'+i,explanation:'x'.repeat(3000)})));
 assert.equal(batches.flat().length,100);assert.ok(batches.every(b=>b.length<=40&&Buffer.byteLength(JSON.stringify({records:b}))<=60000));
});
test('the downloadable Excel example imports forty questions with matching answer keys',async()=>{
 const context=vm.createContext({Uint8Array,ArrayBuffer,TextDecoder,TextEncoder});vm.runInContext(await readFile(new URL('../public/vendor/xlsx.full.min.js',import.meta.url),'utf8'),context);
 const bytes=await readFile(new URL('../public/downloads/question-import-example.xlsx',import.meta.url));const workbook=context.XLSX.read(new Uint8Array(bytes),{type:'array'});
 assert.deepEqual(Array.from(workbook.SheetNames),['Questions','Guide']);const sheet=workbook.Sheets.Questions;
 assert.ok(Object.entries(sheet).filter(([key])=>!key.startsWith('!')).every(([,cell])=>cell.t!=='e'&&!cell.f));
 const parsed=parseQuestionRows(context.XLSX.utils.sheet_to_json(sheet,{header:1,defval:'',raw:true}),competencies);assert.equal(parsed.rows.length,40);assert.ok(parsed.rows.every(r=>!r.errors.length));
 const {SEED}=await import('../server/seed.js');for(const row of parsed.rows){const original=SEED.questions.find(q=>q.prompt===row.record.prompt&&q.competencyId==='html');assert.ok(original);assert.equal(row.record.options[row.record.correctIndex],original.options[original.correctIndex]);}
});
class RecoveryDB{
 constructor(){this.docs=new Map();this.revision=0;}
 async get(path){return structuredClone(this.docs.get(path)||null);}
 write(path,data,previous){return {path,data,previous};}
 async commit(writes){for(const {path,previous} of writes){const current=this.docs.get(path);if(previous===null&&current||previous&&previous._updateTime!==current?._updateTime)throw new AppError(409,'Concurrent change.');}for(const {path,data} of writes)this.docs.set(path,{...structuredClone(data),_updateTime:String(++this.revision)});}
 async put(path,data,previous){return this.commit([this.write(path,data,previous)]);}
}
const recoveryEnv={FIREBASE_PROJECT_ID:'test',FIREBASE_API_KEY:'public',FIREBASE_AUTH_DOMAIN:'test.firebaseapp.com',FIREBASE_APP_ID:'test',FIREBASE_SERVICE_ACCOUNT_JSON:'private',RECOVERY_SECRET:'s'.repeat(40),RESEND_API_KEY:'email-secret',RECOVERY_FROM_EMAIL:'SkillPath <recovery@example.com>'};
function fixture({eligible=true,mailFails=false}={}){
 const db=new RecoveryDB(),calls=[];let now=10000000,code;
 const deps={now:()=>now,serviceToken:async()=> 'private-oauth',fetcher:async(url,options)=>{
  const body=JSON.parse(options.body);calls.push({url,body});let data;
  if(url.endsWith('accounts:lookup'))data={users:eligible?[{localId:'learner',providerUserInfo:[{providerId:'password'}]}]:[]};
  else if(url==='https://api.resend.com/emails'){code=body.text.match(/code is (\d{6})/)[1];if(mailFails)return new Response('{}',{status:500});data={id:'email-id'};}
  else if(url.endsWith('accounts:sendOobCode')){assert.equal(body.returnOobLink,true);data={oobLink:'https://example.com/action?oobCode=private-oob'};}
  else if(url.includes('accounts:resetPassword')){assert.equal(body.oobCode,'private-oob');data={email:'learner@example.com'};}
  else throw new Error('Unexpected endpoint');return new Response(JSON.stringify(data));
 }};
 return {db,calls,deps,advance:ms=>{now+=ms;},get code(){return code;},call:(route,body)=>handleRecovery('recovery/'+route,body,recoveryEnv,db,deps)};
}
test('OTP recovery verifies before resetting, stores hashes, and consumes code and reset token once',async()=>{
 const f=fixture(),start=await f.call('start',{email:'learner@example.com'}),challengeId=start.challengeId;
 assert.match(f.code,/^\d{6}$/);assert.ok(!JSON.stringify(start).includes(f.code));const stored=await f.db.get('recoveryChallenges/'+challengeId);assert.notEqual(stored.codeHash,f.code);assert.equal(stored.attempts,0);
 await assert.rejects(f.call('reset',{challengeId,resetToken:'a'.repeat(64),password:'valid-password'}),/invalid|already/);assert.equal(f.calls.filter(c=>c.url.includes('resetPassword')).length,0);
 const verified=await f.call('verify',{challengeId,code:f.code});assert.match(verified.resetToken,/^[a-f0-9]{64}$/);
 await assert.rejects(f.call('verify',{challengeId,code:f.code}),/no longer/);
 assert.equal((await f.call('reset',{challengeId,resetToken:verified.resetToken,password:'valid-password'})).saved,true);
 await assert.rejects(f.call('reset',{challengeId,resetToken:verified.resetToken,password:'another-password'}),/expired|invalid/);
 assert.equal(f.calls.filter(c=>c.url.includes('resetPassword')).length,1);assert.ok(!JSON.stringify([...f.db.docs]).includes('valid-password'));
});
test('wrong OTP attempts are capped and expired codes fail',async()=>{
 const f=fixture(),{challengeId}=await f.call('start',{email:'learner@example.com'});
 for(let i=0;i<5;i++)await assert.rejects(f.call('verify',{challengeId,code:'wrong'}),/Incorrect/);
 await assert.rejects(f.call('verify',{challengeId,code:f.code}),/no longer/);
 f.advance(61000);const fresh=await f.call('start',{email:'learner@example.com'});f.advance(600001);await assert.rejects(f.call('verify',{challengeId:fresh.challengeId,code:f.code}),/expired/);
});
test('resend has a cooldown, invalidates older codes and has an hourly cap',async()=>{
 const f=fixture(),first=await f.call('start',{email:'learner@example.com'}),code=f.code;
 await assert.rejects(f.call('start',{email:'learner@example.com'}),e=>e.status===429);f.advance(61000);await f.call('start',{email:'learner@example.com'});
 await assert.rejects(f.call('verify',{challengeId:first.challengeId,code}),/newer code/);
 for(let i=0;i<3;i++){f.advance(61000);await f.call('start',{email:'learner@example.com'});}f.advance(61000);await assert.rejects(f.call('start',{email:'learner@example.com'}),e=>e.status===429);
});
test('unknown accounts get the same start response and never send email or reset a password',async()=>{
 const f=fixture({eligible:false}),known=fixture();const start=await f.call('start',{email:'missing@example.com'}),other=await known.call('start',{email:'learner@example.com'});assert.deepEqual({...start,challengeId:''},{...other,challengeId:''});assert.equal(f.calls.length,1);
 await assert.rejects(f.call('verify',{challengeId:start.challengeId,code:'000000'}),/Incorrect/);assert.equal(f.calls.length,1);
});
test('mail delivery failure cannot leave a usable code',async()=>{
 const f=fixture({mailFails:true});await assert.rejects(f.call('start',{email:'learner@example.com'}),e=>e.status===503);
 const [path,record]=[...f.db.docs].find(([p])=>p.startsWith('recoveryChallenges/'));assert.equal(record.status,'failed');assert.equal(record.codeHash,'');await assert.rejects(f.call('verify',{challengeId:path.split('/')[1],code:f.code}),/no longer/);
});
test('concurrent code verification grants only one reset authorization',async()=>{
 const f=fixture(),{challengeId}=await f.call('start',{email:'learner@example.com'});const results=await Promise.allSettled([f.call('verify',{challengeId,code:f.code}),f.call('verify',{challengeId,code:f.code})]);assert.equal(results.filter(r=>r.status==='fulfilled').length,1);
});
test('recovery endpoints work before sign-in but reject cross-origin writes and hide secrets',async()=>{
 const f=fixture();let verifications=0;const deps={...f.deps,db:f.db,verify:async()=>{verifications++;throw new Error('Must not authenticate recovery');}};
 const request=origin=>new Request('https://site.example/api/recovery/start',{method:'POST',headers:{'Content-Type':'application/json',origin},body:JSON.stringify({email:'learner@example.com'})});
 assert.equal((await handleAPI(request('https://evil.example'),recoveryEnv,deps)).status,403);
 const response=await handleAPI(request('https://site.example'),recoveryEnv,deps);assert.equal(response.status,200);assert.equal(verifications,0);
 const config=await (await handleAPI(new Request('https://site.example/api/config'),recoveryEnv,deps)).json();assert.equal(config.recoveryConfigured,true);assert.ok(!JSON.stringify(config).includes('email-secret'));assert.ok(!JSON.stringify(config).includes('s'.repeat(40)));
});

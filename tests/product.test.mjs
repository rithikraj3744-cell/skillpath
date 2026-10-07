import test from 'node:test';
import assert from 'node:assert/strict';
import {startGoogleSignIn} from '../public/js/google-auth.js';
import {authError} from '../public/js/auth.js';
import {requestAI} from '../server/ai.js';
import {SEED} from '../server/seed.js';
import {pathway,validateRecord,validateCatalog,deterministicRoadmap} from '../server/engine.js';
import {guidance,dashboard,journey,learning,profile,progress} from '../public/js/learner.js';

test('Google signup and returning login use the same authenticated provider flow',async()=>{
 for(const isNewUser of [true,false]){
  let calls=0;const auth={},user={uid:'google-learner'};
  const sdk={GoogleAuthProvider:class{setCustomParameters(p){this.params=p;}},
   signInWithPopup:async(a,p)=>{calls++;assert.equal(a,auth);assert.deepEqual(p.params,{prompt:'select_account'});return {user};},
   getAdditionalUserInfo:()=>({isNewUser})};
  assert.deepEqual(await startGoogleSignIn(sdk,auth),{user,isNewUser});assert.equal(calls,1);
 }
});
test('cancelled or blocked Google sign-in never reports a successful account',async()=>{
 for(const code of ['auth/popup-closed-by-user','auth/popup-blocked','auth/unauthorized-domain','auth/operation-not-allowed']){
  const error={code};const sdk={GoogleAuthProvider:class{setCustomParameters(){}},signInWithPopup:async()=>{throw error;}};
  await assert.rejects(startGoogleSignIn(sdk,{}),e=>e===error);
  assert.notEqual(authError(error),'Unable to sign in. Try again.');
 }
});
const aiEnv={GEMINI_API_KEY:' private-key ',GEMINI_MODEL:' models/test-model '};
const output=value=>new Response(JSON.stringify({candidates:[{content:{parts:[{text:JSON.stringify(value)}]}}]}));
test('AI retries one unavailable response and normalizes the configured model and key',async()=>{
 let calls=0,delays=0;
 const result=await requestAI(aiEnv,'Plan',{type:'object'},async(url,options)=>{
  calls++;assert.match(url,/models\/test-model:generateContent$/);assert.equal(options.headers['x-goog-api-key'],'private-key');
  return calls===1?new Response('busy',{status:503}):output({summary:'Ready'});
 },async()=>{delays++;});
 assert.deepEqual(result,{summary:'Ready'});assert.equal(calls,2);assert.equal(delays,1);
});
test('AI failures are bounded, actionable, and do not expose upstream secrets',async()=>{
 for(const status of [400,403,404,429,503]){
  let calls=0;await assert.rejects(requestAI(aiEnv,'Plan',{},async()=>{calls++;return new Response(JSON.stringify({error:{message:'API key private-key project secret-project failed'}}),{status});},async()=>{}),e=>{
   assert.ok(!e.message.includes('private-key'));assert.ok(!e.message.includes('secret-project'));assert.ok(!e.message.includes('Gemini'));return e.status===(status===429?429:status===503?503:502);
  });assert.equal(calls,status===503?2:1);
 }
});
test('AI rejects invalid models before contacting a provider',async()=>{
 let calls=0;await assert.rejects(requestAI({...aiEnv,GEMINI_MODEL:'https://wrong/model'},'Plan',{},async()=>{calls++;}),e=>e.status===503);assert.equal(calls,0);
});
test('AI handles truncated, malformed, and timed-out responses without saving a fake plan',async()=>{
 await assert.rejects(requestAI(aiEnv,'Plan',{},async()=>new Response(JSON.stringify({candidates:[{finishReason:'MAX_TOKENS'}]}))),/cut short/);
 await assert.rejects(requestAI(aiEnv,'Plan',{},async()=>new Response('not JSON')),/incomplete plan/);
 await assert.rejects(requestAI(aiEnv,'Plan',{},async()=>{const e=new Error();e.name='TimeoutError';throw e;}),e=>e.status===504);
});
test('AI does not treat private reasoning text as part of the output JSON',async()=>{
 const result=await requestAI(aiEnv,'Plan',{},async()=>new Response(JSON.stringify({candidates:[{content:{parts:[{thought:true,text:'Internal notes'},{text:'{"summary":"Plan"}'}]}}]})));
 assert.equal(result.summary,'Plan');
});
test('every learning record validates and every career has lessons and questions',()=>{
 validateCatalog(SEED);
 for(const type of ['competencies','careers','modules','questions']){
  assert.equal(new Set(SEED[type].map(x=>x.id)).size,SEED[type].length);
  for(const row of SEED[type])validateRecord(type,row,row.id);
 }
 for(const career of SEED.careers)for(const node of pathway(SEED,career.id,{})){
  assert.ok(SEED.modules.some(m=>m.competencyId===node.id));
  assert.ok(SEED.questions.filter(q=>q.competencyId===node.id).length>=2);
 }
});
const learner=()=>({user:{uid:'learner',email:'learner@test.invalid',admin:false},profile:{name:'Learner',careerId:'full-stack',weeklyStudyHours:7},catalog:SEED,progress:{scores:{html:100},weakConcepts:{},completedModules:[]},nodes:pathway(SEED,'full-stack',{scores:{html:100}}),history:[{score:80,createdAt:'2026-10-06T00:00:00Z',questionCount:5}],journey:null,stages:[],aiConfigured:true});
test('guidance responds to real assessment progress rather than repeating baseline onboarding',()=>{
 const d=learner();assert.match(guidance(d),/mastered 1 of 13/);assert.match(guidance(d),/CSS/);assert.doesNotMatch(guidance(d),/Take your baseline/);
 d.history=[];assert.match(guidance(d),/baseline assessment/);
 d.nodes=d.nodes.map(n=>({...n,status:'mastered',score:100}));assert.match(guidance(d),/Every competency/);
});
test('learner pages render updated content, safe text, and truthful milestones',()=>{
 const d=learner();d.stages=deterministicRoadmap(d.nodes,d.catalog.modules);d.profile.name='<script>alert(1)</script>';
 for(const html of [dashboard(d),journey(d),learning(d),profile(d),progress(d)]){
  assert.doesNotMatch(html,/<script>|demo\.html|Gemini/);assert.ok(html.length>100);
 }
 assert.match(dashboard(d),/YOUR NEXT STUDY SPRINT/);assert.match(dashboard(d),/First mastery/);
 assert.match(profile(d),/Data Analyst/);assert.match(profile(d),/Applied AI Developer/);
});

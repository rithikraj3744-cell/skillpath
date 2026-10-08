import test from 'node:test';
import assert from 'node:assert/strict';
import {assessmentRoute,assessmentDay,mergeAnswerEvidence} from '../server/assessments.js';
import {watchAssessmentFocus,enterAssessmentFullscreen} from '../public/js/assessment-focus.js';
import {AppError} from '../server/engine.js';
import {SEED} from '../server/seed.js';
class AssessmentDB{
 constructor(){this.docs=new Map();this.revision=0;}
 async get(p){return structuredClone(this.docs.get(p)||null);}
 write(p,data,previous){return {p,data,previous};}
 async commit(writes){for(const {p,previous} of writes){const current=this.docs.get(p);if(previous===null&&current||previous&&previous._updateTime!==current?._updateTime)throw new AppError(409,'Concurrent change.');}for(const {p,data} of writes)this.docs.set(p,{...structuredClone(data),_updateTime:String(++this.revision)});}
 async put(p,data,previous){return this.commit([this.write(p,data,previous)]);}
}
function harness(){const db=new AssessmentDB();let now=Date.parse('2026-10-08T10:00:00Z');const context={db,user:{uid:'learner'},cat:SEED,profile:{careerId:'full-stack'},env:{}};return {db,context,advance:ms=>{now+=ms;},call:(name,body={})=>assessmentRoute('assessments/'+name,body,{...context,now}),session:()=>db.get('sessions/learner')};}
test('daily reset follows midnight India time, independent of browser timezone',()=>{
 assert.equal(assessmentDay(Date.parse('2026-10-08T18:29:59Z')).day,'2026-10-08');assert.equal(assessmentDay(Date.parse('2026-10-08T18:30:00Z')).day,'2026-10-09');assert.equal(assessmentDay(Date.parse('2026-10-08T10:00:00Z')).resetAt,Date.parse('2026-10-08T18:30:00Z'));
});
test('three starts per competency are server-enforced and reset on the next day',async()=>{
 const h=harness();for(let i=1;i<=3;i++){const s=await h.call('start',{competencyId:'html'});assert.equal(s.attemptNumber,i);const resumed=await h.call('start',{competencyId:'html'});assert.equal(resumed.id,s.id);await h.call('end',{sessionId:s.id});}
 await assert.rejects(h.call('start',{competencyId:'html'}),e=>e.status===429);h.advance(86400000);assert.equal((await h.call('start',{competencyId:'html'})).attemptNumber,1);
});
test('the third departure closes once, locks the day and cannot award mastery even with correct answers',async()=>{
 const h=harness(),s=await h.call('start',{competencyId:'html'}),server=await h.session(),answers=server.questions.map(q=>q.correctIndex);
 for(const exitCount of [1,1,2]){const r=await h.call('checkpoint',{sessionId:s.id,answers,answerRevision:1,exitCount});assert.equal(r.status,'active');assert.equal(r.exitCount,exitCount);}
 const closed=await h.call('checkpoint',{sessionId:s.id,answers,answerRevision:1,exitCount:3});assert.equal(closed.status,'exit-limit');assert.equal(closed.result.passed,false);assert.equal(closed.result.masteryUpdated,false);
 assert.equal((await h.db.get('progress/learner')).scores.html,undefined);assert.equal((await h.call('status')).modules.html.locked,true);
 await h.call('checkpoint',{sessionId:s.id,exitCount:3});assert.equal((await h.db.get('users/learner/reviews/html')).attempts,1);
 await assert.rejects(h.call('start',{competencyId:'html'}),e=>e.status===429);
});
test('autosave rejects stale answer revisions and never decreases an exit count',async()=>{
 const h=harness(),s=await h.call('start',{competencyId:'html'}),answers=Array(40).fill(null);answers[0]=0;await h.call('checkpoint',{sessionId:s.id,answers,answerRevision:2,exitCount:2});
 await h.call('checkpoint',{sessionId:s.id,answers:Array(40).fill(1),answerRevision:1,exitCount:0});const stored=await h.session();assert.equal(stored.answers[0],0);assert.equal(stored.answers[1],null);assert.equal(stored.exitCount,2);
});
test('simultaneous starts consume only one quota slot and a competing competency cannot discard an active attempt',async()=>{
 const h=harness(),results=await Promise.allSettled([h.call('start',{competencyId:'html'}),h.call('start',{competencyId:'html'})]);assert.equal(results.filter(r=>r.status==='fulfilled').length,1);assert.equal((await h.call('status')).modules.html.starts,1);
 await h.db.put('progress/learner',{scores:{html:100},weakConcepts:{},completedModules:[],revision:0});await assert.rejects(h.call('start',{competencyId:'css'}),/active assessment/);
});
test('quota is scoped to learner and competency and terminal retries are idempotent',async()=>{
 const h=harness();await h.db.put('progress/learner',{scores:{html:100},weakConcepts:{},completedModules:[],revision:0});
 for(let i=0;i<3;i++){const s=await h.call('start',{competencyId:'html'});await h.call('end',{sessionId:s.id});await h.call('end',{sessionId:s.id});}
 assert.equal((await h.db.get('users/learner/reviews/html')).attempts,3);assert.equal((await h.call('start',{competencyId:'css'})).attemptNumber,1);
 h.context.user={uid:'another'};assert.equal((await h.call('start',{competencyId:'html'})).attemptNumber,1);
});
test('expiry preserves saved answers for revision but does not overwrite mastery',async()=>{
 const h=harness();await h.db.put('progress/learner',{scores:{html:80},weakConcepts:{},completedModules:[],revision:1});const s=await h.call('start',{competencyId:'html'}),server=await h.session(),answers=server.questions.map(q=>q.correctIndex);await h.call('checkpoint',{sessionId:s.id,answers,answerRevision:1});h.advance(3600001);
 const expired=await h.call('checkpoint',{sessionId:s.id});assert.equal(expired.status,'expired');assert.equal((await h.db.get('progress/learner')).scores.html,80);assert.equal((await h.db.get('users/learner/reviews/html')).attempts,1);
});
test('study evidence combines completed and interrupted attempts, separating unanswered items',async()=>{
 const h=harness();const first=await h.call('start',{competencyId:'html'}),questions=(await h.session()).questions;await h.call('end',{sessionId:first.id,answers:questions.map(q=>(q.correctIndex+1)%q.options.length)});
 const second=await h.call('start',{competencyId:'html'}),next=(await h.session()).questions;await h.call('submit',{sessionId:second.id,answers:next.map(q=>q.correctIndex)});
 const plan=await h.call('review',{competencyId:'html'});assert.equal(plan.attempts,2);assert.equal(plan.evidence.reduce((sum,c)=>sum+c.correct,0),40);assert.equal(plan.evidence.reduce((sum,c)=>sum+c.wrong,0),40);assert.ok(plan.topics.length>0);
 const blank=mergeAnswerEvidence(null,questions,Array(40).fill(null));assert.ok(blank.concepts.every(c=>c.wrong===0));
});
test('AI review uses cumulative evidence, caches unchanged results and falls back without losing progress',async()=>{
 const h=harness(),s=await h.call('start',{competencyId:'html'}),questions=(await h.session()).questions;await h.call('end',{sessionId:s.id,answers:questions.map(q=>(q.correctIndex+1)%q.options.length)});
 const fallback=await h.call('review',{competencyId:'html'});let calls=0;h.context.env={GEMINI_API_KEY:'key',GEMINI_MODEL:'model'};
 h.context.fetcher=async(url,init)=>{calls++;assert.match(init.body,/cumulative answer evidence/);return new Response(JSON.stringify({candidates:[{content:{parts:[{text:JSON.stringify({summary:'Focus on these concepts.',topics:fallback.topics})}]}}]}));};
 assert.equal((await h.call('review',{competencyId:'html'})).source,'ai');assert.equal((await h.call('review',{competencyId:'html'})).cached,true);assert.equal(calls,1);
 h.db.docs.delete('users/learner/reviewPlans/html');h.context.fetcher=async()=>new Response('{}',{status:403});const result=await h.call('review',{competencyId:'html'});assert.equal(result.source,'rules');assert.ok(result.aiNotice);assert.equal(result.attempts,1);
});
class FocusSurface extends EventTarget{constructor(){super();this.hidden=false;this.fullscreenElement={};this.timer=null;}setInterval(fn){this.timer=fn;return 1;}clearInterval(){this.timer=null;}}
test('visibility and fullscreen events from one departure count once, then re-arm on return',()=>{
 const doc=new FocusSurface(),win=new FocusSurface();let exits=0;const stop=watchAssessmentFocus({doc,win,onExit:()=>exits++,onPause:()=>{},onTick:()=>{},expiresAt:9999});
 doc.hidden=true;doc.dispatchEvent(new Event('visibilitychange'));doc.fullscreenElement=null;doc.dispatchEvent(new Event('fullscreenchange'));win.dispatchEvent(new Event('pagehide'));assert.equal(exits,1);
 doc.hidden=false;doc.dispatchEvent(new Event('visibilitychange'));assert.equal(exits,1);doc.fullscreenElement={};doc.dispatchEvent(new Event('fullscreenchange'));doc.fullscreenElement=null;doc.dispatchEvent(new Event('fullscreenchange'));assert.equal(exits,2);
 stop();doc.dispatchEvent(new Event('visibilitychange'));assert.equal(exits,2);assert.equal(win.timer,null);
});
test('fullscreen failure is actionable and monitor cleanup prevents a completion being counted as an exit',async()=>{
 await assert.rejects(enterAssessmentFullscreen({fullscreenEnabled:false,documentElement:{}}),/No new attempt/);
 await assert.rejects(enterAssessmentFullscreen({fullscreenEnabled:true,documentElement:{requestFullscreen:async()=>{throw new Error('denied');}}}),/not allowed/);
 const doc=new FocusSurface(),win=new FocusSurface();let exits=0;const stop=watchAssessmentFocus({doc,win,onExit:()=>exits++,onPause:()=>{},onTick:()=>{},expiresAt:9999});stop();doc.fullscreenElement=null;doc.dispatchEvent(new Event('fullscreenchange'));assert.equal(exits,0);
});

test('repeated tab switches count while fullscreen remains exited',()=>{
 const doc=new FocusSurface(),win=new FocusSurface();let exits=0,paused=false;
 const stop=watchAssessmentFocus({doc,win,onExit:()=>exits++,onPause:v=>paused=v,onTick:()=>{},expiresAt:9999});
 for(let i=1;i<=3;i++){
  win.dispatchEvent(new Event('blur'));doc.hidden=true;doc.dispatchEvent(new Event('visibilitychange'));
  doc.fullscreenElement=null;doc.dispatchEvent(new Event('fullscreenchange'));assert.equal(exits,i);
  doc.hidden=false;doc.dispatchEvent(new Event('visibilitychange'));win.dispatchEvent(new Event('focus'));assert.equal(paused,true);
 }
 stop();
});
test('switching windows without hiding the tab counts once per departure and cleans up',()=>{
 const doc=new FocusSurface(),win=new FocusSurface();let exits=0;
 const stop=watchAssessmentFocus({doc,win,onExit:()=>exits++,onPause:()=>{},onTick:()=>{},expiresAt:9999});
 win.dispatchEvent(new Event('blur'));win.dispatchEvent(new Event('blur'));win.timer();assert.equal(exits,1);
 win.dispatchEvent(new Event('focus'));win.dispatchEvent(new Event('blur'));assert.equal(exits,2);
 stop();win.dispatchEvent(new Event('focus'));win.dispatchEvent(new Event('blur'));assert.equal(exits,2);
});

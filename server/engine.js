import {validRecordId} from '../public/js/record-id.js';
import {ASSESSMENT_POLICY} from '../public/js/assessment-policy.js';
export class AppError extends Error { constructor(status,message){super(message);this.status=status;} }
export const must=(condition,message,status=400)=>{if(!condition)throw new AppError(status,message);};
export const clean=(s,max=200)=>typeof s==='string'?s.trim().slice(0,max):'';
export const validId=validRecordId;
export function topo(competencies){
 const map=new Map(competencies.map(c=>[c.id,c])),seen=new Set(),active=new Set(),out=[];
 function visit(id){must(map.has(id),`Missing prerequisite: ${id}`);must(!active.has(id),'Prerequisites cannot contain a cycle.');if(seen.has(id))return;active.add(id);for(const pre of map.get(id).prerequisites||[])visit(pre);active.delete(id);seen.add(id);out.push(map.get(id));}
 for(const c of competencies)visit(c.id);return out;
}
export function pathway(catalog,careerId,progress={}){
 const career=catalog.careers.find(c=>c.id===careerId);if(!career)return [];
 const ids=new Set(career.competencyIds);let changed=true;while(changed){changed=false;for(const c of catalog.competencies)if(ids.has(c.id))for(const p of c.prerequisites)if(!ids.has(p)){ids.add(p);changed=true;}}
 const ordered=[...ids].map(id=>{const c=catalog.competencies.find(c=>c.id===id);must(c,`Missing competency: ${id}`);return c;});
 return topo(ordered).map(c=>{const score=progress.scores?.[c.id]||0;const eligible=c.prerequisites.every(id=>(progress.scores?.[id]||0)>=ASSESSMENT_POLICY.passPercent);return {...c,requiredLevel:ASSESSMENT_POLICY.passPercent,score,gap:Math.max(ASSESSMENT_POLICY.passPercent-score,0),status:score>=ASSESSMENT_POLICY.passPercent?'mastered':!eligible?'locked':score>0&&score<40?'weak':score>0?'learning':'available'};});
}
export function deterministicRoadmap(nodes,modules){return nodes.filter(n=>n.status!=='mastered').map(n=>({competencyId:n.id,name:n.name,reason:n.status==='locked'?'Complete prerequisites first.':n.status==='weak'?'Strengthen this competency before progressing.':'Build this skill to reach your career goal.',objectives:modules.find(m=>m.competencyId===n.id)?.objectives||[n.description],estimatedHours:Math.max(1,Math.round((100-n.score)/25))}));}
export function scoreQuestions(questions,answers){
 must(questions.length>0&&Array.isArray(answers)&&answers.length===questions.length,'Include every question; use null for an unanswered question.');const by={},review=[];
 questions.forEach((q,i)=>{const skipped=answers[i]===null;must(skipped||Number.isInteger(answers[i])&&answers[i]>=0&&answers[i]<q.options.length,'Invalid answer.');const correct=!skipped&&answers[i]===q.correctIndex;const group=by[q.competencyId]||{correct:0,wrong:0,unanswered:0,total:0,weakConcepts:[]};group.total++;group[skipped?'unanswered':correct?'correct':'wrong']++;if(!correct&&q.concept&&!group.weakConcepts.includes(q.concept))group.weakConcepts.push(q.concept);by[q.competencyId]=group;review.push({prompt:q.prompt,selected:skipped?'Unanswered':q.options[answers[i]],correct:q.options[q.correctIndex],isCorrect:correct,unanswered:skipped,marks:skipped?0:correct?1:-0.25,explanation:q.explanation});});
 const summarize=v=>{const marks=v.correct-v.wrong*ASSESSMENT_POLICY.wrongPenalty,percent=Math.max(0,marks/v.total*100);return {correct:v.correct,wrong:v.wrong,unanswered:v.unanswered,total:v.total,marks,maxMarks:v.total,percent:Math.round(percent*100)/100,passed:marks*100>=v.total*ASSESSMENT_POLICY.passPercent};};
 const breakdown=Object.fromEntries(Object.entries(by).map(([id,v])=>[id,summarize(v)])),total=Object.values(by).reduce((a,v)=>({correct:a.correct+v.correct,wrong:a.wrong+v.wrong,unanswered:a.unanswered+v.unanswered,total:a.total+v.total}),{correct:0,wrong:0,unanswered:0,total:0}),summary=summarize(total);
 return {...summary,policy:ASSESSMENT_POLICY,breakdown,scores:Object.fromEntries(Object.entries(breakdown).map(([id,v])=>[id,v.percent])),weakConcepts:Object.fromEntries(Object.entries(by).map(([id,v])=>[id,v.weakConcepts])),overall:summary.percent,review};
}
const textField=(obj,k,max,required=true)=>{const v=clean(obj[k],max);must(!required||v,`${k} is required.`);return v;};
const strings=(v,max=30)=>{must(Array.isArray(v)&&v.length<=max&&v.every(x=>typeof x==='string'&&x.trim().length>0&&x.length<=200),'Invalid list.');return [...new Set(v.map(x=>x.trim()))];};
export function validateRecord(type,input,id){
 must(validId(id),'Use a lowercase ID containing letters, numbers, hyphens or underscores.');must(input&&typeof input==='object','Invalid record.');let d={id};
 if(type==='competencies'){d={...d,name:textField(input,'name',100),description:textField(input,'description',1000),category:textField(input,'category',80),difficulty:textField(input,'difficulty',30),requiredLevel:Number(input.requiredLevel),prerequisites:strings(input.prerequisites||[])};must(['Beginner','Intermediate','Advanced'].includes(d.difficulty),'Invalid difficulty.');must(Number.isInteger(d.requiredLevel)&&d.requiredLevel>=1&&d.requiredLevel<=100,'Required level must be 1–100.');must(d.prerequisites.every(validId),'Invalid prerequisite ID.');}
 else if(type==='careers'){d={...d,name:textField(input,'name',100),description:textField(input,'description',1000),competencyIds:strings(input.competencyIds||[],80)};must(d.competencyIds.length>0,'Choose at least one competency.');}
 else if(type==='modules'){d={...d,title:textField(input,'title',150),competencyId:textField(input,'competencyId',80),objectives:strings(input.objectives||[]),content:textField(input,'content',20000),practice:textField(input,'practice',4000),durationMinutes:Number(input.durationMinutes),resources:input.resources||[]};must(d.objectives.length>0,'Add at least one objective.');must(Number.isInteger(d.durationMinutes)&&d.durationMinutes>=1&&d.durationMinutes<=600,'Duration must be 1–600 minutes.');must(Array.isArray(d.resources)&&d.resources.length<=10,'At most 10 resources.');d.resources=d.resources.map(r=>{const url=clean(r.url,1000),label=clean(r.label,150);try{must(new URL(url).protocol==='https:','Resources require HTTPS URLs.');}catch{throw new AppError(400,'Resources require valid HTTPS URLs.');}must(label,'Resource label required.');return {label,url};});}
 else if(type==='questions'){d={...d,competencyId:textField(input,'competencyId',80),prompt:textField(input,'prompt',2000),options:strings(input.options||[],6),correctIndex:Number(input.correctIndex),explanation:textField(input,'explanation',3000),concept:textField(input,'concept',120),difficulty:textField(input,'difficulty',30)};must(d.options.length>=2&&d.options.length===input.options.length,'Use 2–6 distinct answer options.');must(Number.isInteger(d.correctIndex)&&d.correctIndex>=0&&d.correctIndex<d.options.length,'Select the correct answer.');must(['Beginner','Intermediate','Advanced'].includes(d.difficulty),'Invalid difficulty.');}
 else throw new AppError(404,'Unknown collection.');return d;
}
export function validateCatalog(catalog){
 topo(catalog.competencies);must(new Set(catalog.modules.map(m=>m.competencyId)).size===catalog.modules.length,'Each competency supports one lesson. Edit its existing lesson instead.');const ids=new Set(catalog.competencies.map(c=>c.id));
 for(const c of catalog.careers)must(c.competencyIds.every(id=>ids.has(id)),`Career ${c.name} references a missing competency.`);
 for(const c of [...catalog.modules,...(catalog.questions||[])])must(ids.has(c.competencyId),`Record ${c.id} references a missing competency.`);
}
export function validateAI(value,nodes){
 must(value&&typeof value.summary==='string'&&value.summary.length<=3000,'AI returned an invalid summary.',502);must(Array.isArray(value.stages),'AI returned invalid stages.',502);
 const expected=nodes.filter(n=>n.status!=='mastered');must(value.stages.length===expected.length,'AI omitted or added roadmap stages.',502);
 const map=new Map();for(const s of value.stages){must(typeof s.competencyId==='string'&&!map.has(s.competencyId),'AI returned duplicate or invalid stages.',502);must(typeof s.reason==='string'&&s.reason.length<=1500&&Array.isArray(s.objectives)&&s.objectives.length>=1&&s.objectives.length<=8&&s.objectives.every(x=>typeof x==='string'&&x.length<=500)&&Number.isFinite(s.estimatedHours)&&s.estimatedHours>=.5&&s.estimatedHours<=100,'AI returned invalid learning details.',502);map.set(s.competencyId,s);}
 return {summary:value.summary,stages:expected.map(n=>{const s=map.get(n.id);must(s,'AI returned an unknown competency.',502);return {competencyId:n.id,name:n.name,reason:s.reason,objectives:s.objectives,estimatedHours:s.estimatedHours};})};
}
export async function fingerprint(value){const hash=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(value)));return [...new Uint8Array(hash)].map(x=>x.toString(16).padStart(2,'0')).join('');}

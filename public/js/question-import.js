const headerKey=value=>String(value??'').toLowerCase().replace(/[^a-z0-9]/g,'');
const importText=value=>String(value??'').trim();
const aliases={competencyId:['competencyid','competency','skill','skillid','topic'],prompt:['question','questiontext','prompt'],answer:['correctanswer','correctoption','answer','answerkey','correct'],concept:['concept','concepttested'],explanation:['explanation','rationale','reason'],difficulty:['difficulty','level'],id:['id','questionid']};
for(let i=0;i<6;i++)aliases['option'+i]=['option'+String.fromCharCode(97+i),String.fromCharCode(97+i),'option'+(i+1),'answer'+(i+1)];
export function parseQuestionRows(rows,competencies,defaultCompetency=''){
 if(rows.length>5001)throw new Error('Use no more than 5,000 rows per worksheet.');
 let columns={},header=-1;
 for(let r=0;r<Math.min(rows.length,20);r++){const keys=(rows[r]||[]).map(headerKey),candidate={};for(const [name,variants] of Object.entries(aliases)){const found=keys.map((v,i)=>variants.includes(v)?i:-1).filter(i=>i>=0);if(found.length>1)throw new Error(`Repeated ${name} heading in row ${r+1}. Use one column per field.`);if(found.length)candidate[name]=found[0];}if(['prompt','answer','option0','option1'].every(k=>k in candidate)){columns=candidate;header=r;break;}}
 if(header<0)throw new Error('Could not detect the header. Include Question, Option A, Option B, and Correct Answer.');
 const seen=new Set(),parsed=[];
 for(let r=header+1;r<rows.length;r++){
  const source=rows[r]||[];if(source.every(v=>importText(v)===''))continue;
  const value=k=>importText(source[columns[k]]),errors=[];
  const competencyValue=value('competencyId')||defaultCompetency,matches=competencies.filter(c=>[c.id,c.name].some(v=>headerKey(v)===headerKey(competencyValue)));
  if(matches.length!==1)errors.push('Choose a known, unambiguous competency ID or name.');
  const options=[];let gap=false;for(let i=0;i<6;i++){const option=value('option'+i);if(!option){gap=true;continue;}if(gap)errors.push('Options must be consecutive, starting with A.');options.push(option);}
  if(options.length<2||options.length>6||new Set(options.map(v=>v.toLowerCase())).size!==options.length)errors.push('Use 2–6 distinct options.');
  if(options.some(o=>o.length>200))errors.push('Each option must be 200 characters or fewer.');
  const answer=value('answer'),candidates=new Set();
  if(/^[a-f]$/i.test(answer))candidates.add(answer.toUpperCase().charCodeAt(0)-65);
  if(/^[1-6]$/.test(answer))candidates.add(Number(answer)-1);
  options.forEach((option,i)=>{if(option.toLowerCase()===answer.toLowerCase())candidates.add(i);});
  const indexes=[...candidates].filter(i=>i>=0&&i<options.length);if(indexes.length!==1||candidates.size>1)errors.push('Correct Answer is missing, ambiguous, or does not match an option. Use A–F, 1–6, or exact answer text.');
  const prompt=value('prompt');if(!prompt||prompt.length>2000)errors.push('Question is required and must be 2,000 characters or fewer.');
  const difficulty=value('difficulty')||'Beginner',normalizedDifficulty=['Beginner','Intermediate','Advanced'].find(v=>v.toLowerCase()===difficulty.toLowerCase());if(!normalizedDifficulty)errors.push('Difficulty must be Beginner, Intermediate, or Advanced.');
  const concept=value('concept')||matches[0]?.name||'Foundations',explanation=value('explanation')||`Correct answer: ${options[indexes[0]]||answer}`;
  if(concept.length>120||explanation.length>3000)errors.push('Concept limit: 120 characters. Explanation limit: 3,000 characters.');
  const id=value('id');if(id&&!/^[a-z0-9][a-z0-9_-]{0,79}$/.test(id))errors.push('Question ID must use lowercase letters, numbers, hyphens or underscores (80 characters maximum).');
  const signature=(matches[0]?.id||competencyValue)+'|'+prompt.toLowerCase().replace(/\s+/g,' ');if(seen.has(signature))errors.push('Duplicate question in this worksheet.');seen.add(signature);
  parsed.push({row:r+1,errors,record:{id,competencyId:matches[0]?.id||competencyValue,prompt,options,correctIndex:indexes[0]??-1,concept,explanation,difficulty:normalizedDifficulty||difficulty}});
 }
 if(!parsed.length)throw new Error('This worksheet has no question rows.');return {headerRow:header+1,rows:parsed};
}
export async function identifyImportedQuestions(rows){return Promise.all(rows.map(async({record})=>{if(record.id)return record;const text=record.competencyId+'|'+record.prompt.trim().toLowerCase().replace(/\s+/g,' '),hash=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));return {...record,id:'import-'+[...new Uint8Array(hash)].map(x=>x.toString(16).padStart(2,'0')).join('')};}));}
export function importBatches(records){const batches=[];let batch=[];for(const record of records){const next=[...batch,record];if(next.length>40||new TextEncoder().encode(JSON.stringify({records:next})).length>60000){batches.push(batch);batch=[];}batch.push(record);}if(batch.length)batches.push(batch);return batches;}

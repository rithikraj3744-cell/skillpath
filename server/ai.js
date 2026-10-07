import {AppError} from './engine.js';

export function aiModel(env) {
 return String(env.GEMINI_MODEL||'').trim().replace(/^models\//,'');
}

// Do not return upstream messages: they can contain project IDs or credentials.
function aiServiceError(status, payload) {
 const reason=String(payload?.error?.message||'').toLowerCase();
 if(status===429)return new AppError(429,'The AI service quota is currently exhausted. Your progress is saved. Try again later or ask your administrator to check the service allowance.');
 if(status===401||status===403||status===400&&/api.?key|credential/.test(reason))return new AppError(502,'The AI service rejected its credentials or permissions. Ask your administrator to check the AI API key and project access.');
 if(status===404)return new AppError(502,'The configured AI model is unavailable for this project. Ask your administrator to check the model setting.');
 if(status===400)return new AppError(502,'The AI service rejected the request configuration. Ask your administrator to check model support and service settings.');
 if(status>=500)return new AppError(503,'The AI service is temporarily unavailable. Your scores are saved and your skill-based roadmap is still available. Please retry shortly.');
 return new AppError(502,'The AI service could not complete this request. Your saved progress is safe.');
}

export async function requestAI(env,prompt,schema,fetcher=fetch,wait=ms=>new Promise(resolve=>setTimeout(resolve,ms))) {
 const model=aiModel(env),key=String(env.GEMINI_API_KEY||'').trim();
 if(!/^[a-zA-Z0-9._-]{1,100}$/.test(model)||!key)throw new AppError(503,'AI configuration is incomplete. Ask your administrator to check the API key and model.');
 const signal=AbortSignal.timeout(30000);
 for(let attempt=0;attempt<2;attempt++) {
  let response,payload;
  try {
   response=await fetcher(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,{
    method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':key},
    body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{responseMimeType:'application/json',responseJsonSchema:schema,maxOutputTokens:8192}}),signal
   });
   payload=await response.json().catch(()=>null);
  } catch(error) {
   if(signal.aborted||['AbortError','TimeoutError'].includes(error.name))throw new AppError(504,'AI generation timed out. Your scores are saved. Please retry shortly.');
   if(attempt===0){await wait(600);continue;}
   throw new AppError(503,'The AI service could not be reached. Your saved progress is safe. Please retry shortly.');
  }
  if(!response.ok) {
   if(attempt===0&&[500,502,503,504].includes(response.status)){await wait(600);continue;}
   throw aiServiceError(response.status,payload);
  }
  const candidate=payload?.candidates?.[0];
  if(candidate?.finishReason==='MAX_TOKENS')throw new AppError(502,'The AI plan was cut short. Your existing roadmap is still available. Please try again.');
  const output=candidate?.content?.parts?.filter(p=>!p.thought).map(p=>p.text||'').join('');
  try{return JSON.parse(output);}catch{throw new AppError(502,'The AI service returned an incomplete plan. Your current roadmap is safe. Please try again.');}
 }
}

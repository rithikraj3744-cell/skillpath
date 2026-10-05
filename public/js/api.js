import {getToken} from './auth.js';
export async function api(path,{method='GET',body}={}){
 const token=await getToken();let response;
 try{response=await fetch('/api/'+path,{method,headers:{...(token?{Authorization:'Bearer '+token}:{}),...(body!==undefined?{'Content-Type':'application/json'}:{})},body:body!==undefined?JSON.stringify(body):undefined,signal:AbortSignal.timeout(55000)});}catch(e){throw new Error(e.name==='TimeoutError'?'The request timed out. Your saved progress is safe; try again.':'Cannot reach the server. Check your connection.');}
 const data=await response.json().catch(()=>({error:'Server returned an unreadable response.'}));if(!response.ok)throw new Error(data.error||'Request failed.');return data;
}

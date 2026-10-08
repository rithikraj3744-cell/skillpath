import {getToken} from './auth.js';
export async function api(path,{method='GET',body}={}){
 const token=await getToken();let response;
 if(!navigator.onLine)throw new Error('You are offline. Reconnect before saving.');
 try{response=await fetch('/api/'+path,{method,headers:{...(token?{Authorization:'Bearer '+token}:{}),...(body!==undefined?{'Content-Type':'application/json'}:{})},body:body!==undefined?JSON.stringify(body):undefined,signal:AbortSignal.timeout(55000)});}catch(e){throw new Error(e.name==='TimeoutError'?'The request timed out. Check your progress, then retry if needed.':'Cannot reach the server. Check your connection.');}
 const data=await response.json().catch(()=>({error:'Server returned an unreadable response.'}));if(!response.ok){const error=new Error(data.error||'Request failed.');error.status=response.status;throw error;}return data;
}

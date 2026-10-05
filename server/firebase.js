import {AppError,must} from './engine.js';
const encoder=new TextEncoder();let accessCache={};
const b64url=bytes=>btoa(String.fromCharCode(...bytes)).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
const encoded=value=>b64url(encoder.encode(JSON.stringify(value)));
export function configuration(env){
 const keys=['FIREBASE_PROJECT_ID','FIREBASE_API_KEY','FIREBASE_AUTH_DOMAIN','FIREBASE_APP_ID','FIREBASE_SERVICE_ACCOUNT_JSON'];const missing=keys.filter(k=>!env[k]);
 return {ready:missing.length===0,missing,adminConfigured:!!env.ADMIN_UIDS,aiConfigured:!!(env.GEMINI_API_KEY&&env.GEMINI_MODEL),firebase:{projectId:env.FIREBASE_PROJECT_ID||'',apiKey:env.FIREBASE_API_KEY||'',authDomain:env.FIREBASE_AUTH_DOMAIN||'',appId:env.FIREBASE_APP_ID||''}};
}
export async function verifyUser(request,env,fetcher=fetch){
 const header=request.headers.get('authorization')||'';must(header.startsWith('Bearer ')&&header.length<10000,'Sign in to continue.',401);
 let claims;try{const part=header.slice(7).split('.')[1];claims=JSON.parse(atob(part.replace(/-/g,'+').replace(/_/g,'/')));}catch{throw new AppError(401,'Invalid authentication token.');}must(claims.aud===env.FIREBASE_PROJECT_ID&&claims.iss==='https://securetoken.google.com/'+env.FIREBASE_PROJECT_ID,'Token belongs to a different Firebase project.',401);
 let response;try{response=await fetcher(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(env.FIREBASE_API_KEY)}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({idToken:header.slice(7)}),signal:AbortSignal.timeout(12000)});}catch{throw new AppError(503,'Authentication service is unavailable. Retry shortly.');}
 if(!response.ok)throw new AppError(response.status===400||response.status===401?401:503,'Your session could not be verified. Please sign in again.');
 const data=await response.json();const user=data.users?.[0];must(user?.localId&&!user.disabled&&claims.sub===user.localId,'Account unavailable.',401);return {uid:user.localId,email:user.email||'',name:user.displayName||'',admin:(env.ADMIN_UIDS||'').split(',').map(x=>x.trim()).includes(user.localId)};
}
async function serviceToken(env){
 if(accessCache.key===env.FIREBASE_SERVICE_ACCOUNT_JSON&&accessCache.until>Date.now()+60000)return accessCache.token;
 let sa;try{sa=JSON.parse(env.FIREBASE_SERVICE_ACCOUNT_JSON);}catch{throw new AppError(503,'The Firebase service-account configuration is invalid.');}
 must(sa.project_id===env.FIREBASE_PROJECT_ID&&sa.client_email&&sa.private_key,'Firebase service account must match the configured project.',503);
 const now=Math.floor(Date.now()/1000);const unsigned=encoded({alg:'RS256',typ:'JWT'})+'.'+encoded({iss:sa.client_email,scope:'https://www.googleapis.com/auth/datastore',aud:'https://oauth2.googleapis.com/token',iat:now,exp:now+3600});
 let key;try{const pem=sa.private_key.replace(/-----[^-]+-----|\s/g,'');key=await crypto.subtle.importKey('pkcs8',Uint8Array.from(atob(pem),c=>c.charCodeAt(0)),{name:'RSASSA-PKCS1-v1_5',hash:'SHA-256'},false,['sign']);}catch{throw new AppError(503,'Invalid Firebase service-account private key.');}
 const sig=await crypto.subtle.sign('RSASSA-PKCS1-v1_5',key,encoder.encode(unsigned));const assertion=unsigned+'.'+b64url(new Uint8Array(sig));
 const r=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion}),signal:AbortSignal.timeout(12000)});if(!r.ok)throw new AppError(503,'Firebase server credentials were rejected. Check service-account access.');const d=await r.json();accessCache={key:env.FIREBASE_SERVICE_ACCOUNT_JSON,token:d.access_token,until:Date.now()+d.expires_in*1000};return accessCache.token;
}
export function toValue(v){if(v===null)return {nullValue:null};if(typeof v==='string')return {stringValue:v};if(typeof v==='boolean')return {booleanValue:v};if(typeof v==='number')return Number.isInteger(v)?{integerValue:String(v)}:{doubleValue:v};if(Array.isArray(v))return {arrayValue:{values:v.map(toValue)}};return {mapValue:{fields:Object.fromEntries(Object.entries(v).filter(([,x])=>x!==undefined).map(([k,x])=>[k,toValue(x)]))}};}
export function fromValue(v){if('stringValue'in v)return v.stringValue;if('integerValue'in v)return Number(v.integerValue);if('doubleValue'in v)return v.doubleValue;if('booleanValue'in v)return v.booleanValue;if('nullValue'in v)return null;if('arrayValue'in v)return (v.arrayValue.values||[]).map(fromValue);if('mapValue'in v)return Object.fromEntries(Object.entries(v.mapValue.fields||{}).map(([k,x])=>[k,fromValue(x)]));if('timestampValue'in v)return v.timestampValue;return null;}
export class Firestore{
 constructor(env){this.env=env;this.root=`projects/${env.FIREBASE_PROJECT_ID}/databases/(default)/documents`;this.url=`https://firestore.googleapis.com/v1/${this.root}`;}
 async call(suffix,init={}){const token=await serviceToken(this.env);const r=await fetch(this.url+suffix,{...init,headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},signal:AbortSignal.timeout(15000)});if(r.status===404)return null;if(!r.ok){if(r.status===409||r.status===412)throw new AppError(409,'Data changed in another session. Refresh and try again.');throw new AppError(r.status===429?429:503,r.status===429?'Database quota reached. Retry later.':'Database operation failed. Check Firestore setup and service-account permissions.');}return r.status===204?{}:r.json();}
 decode(d){return d?{...fromValue({mapValue:{fields:d.fields||{}}}),_updateTime:d.updateTime}:null;}
 async get(path){return this.decode(await this.call('/'+path));}
 async list(path,{limit=100,pageToken=''}={}){const q=new URLSearchParams({pageSize:String(limit)});if(pageToken)q.set('pageToken',pageToken);const data=await this.call('/'+path+'?'+q);return {items:(data?.documents||[]).map(d=>({...this.decode(d),id:d.name.split('/').pop()})),nextPageToken:data?.nextPageToken||null};}
 async all(path,max=500){let items=[],nextPageToken='';do{const d=await this.list(path,{limit:100,pageToken:nextPageToken});items.push(...d.items);nextPageToken=d.nextPageToken;if(items.length>=max&&nextPageToken)throw new AppError(409,'Catalog limit reached. Remove unused records before continuing.');}while(nextPageToken);return items;}
 write(path,data,previous){const {_updateTime,...fields}=data;const write={update:{name:this.root+'/'+path,fields:toValue(fields).mapValue.fields}};if(previous!==undefined)write.currentDocument=previous?{updateTime:previous._updateTime}:{exists:false};return write;}
 remove(path,previous){return {delete:this.root+'/'+path,currentDocument:{updateTime:previous._updateTime}};}
 async commit(writes){must(writes.length<=500,'Too many writes.');return this.call(':commit',{method:'POST',body:JSON.stringify({writes})});}
 async put(path,data,previous){await this.commit([this.write(path,data,previous)]);return data;}
}

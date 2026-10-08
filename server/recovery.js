import {AppError,must,clean} from './engine.js';
import {configuration,serviceToken} from './firebase.js';

const recoveryMessage='If an eligible email/password account exists, a verification code will arrive shortly. Check your spam folder. For a Google-only account, use Continue with Google.';
const recoveryBytes=length=>crypto.getRandomValues(new Uint8Array(length));
const recoveryHex=bytes=>[...bytes].map(x=>x.toString(16).padStart(2,'0')).join('');
async function recoveryHash(secret,value){const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);return recoveryHex(new Uint8Array(await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(value))));}
function recoveryEqual(a,b){if(typeof a!=='string'||typeof b!=='string'||a.length!==b.length)return false;let difference=0;for(let i=0;i<a.length;i++)difference|=a.charCodeAt(i)^b.charCodeAt(i);return difference===0;}
function recoveryCode(){let value;do{value=crypto.getRandomValues(new Uint32Array(1))[0];}while(value>=4294000000);return String(value%1000000).padStart(6,'0');}
async function recoveryPost(url,body,headers,fetcher){let response;try{response=await fetcher(url,{method:'POST',headers:{'Content-Type':'application/json',...headers},body:JSON.stringify(body),signal:AbortSignal.timeout(12000)});}catch{throw new AppError(503,'Recovery service is temporarily unavailable. Please try again.');}const result=await response.json().catch(()=>({}));if(!response.ok)throw new AppError(503,'Recovery could not be completed. Check the password requirements or request a new code.');return result;}
export async function handleRecovery(path,body,env,db,deps={}){
 must(configuration(env).recoveryConfigured,'Email code recovery is not configured. Use the password reset email link.',503);
 const fetcher=deps.fetcher||fetch,clock=deps.now||Date.now,now=clock(),secret=env.RECOVERY_SECRET;
 const authHeaders=async()=>({Authorization:'Bearer '+await (deps.serviceToken||serviceToken)(env,'https://www.googleapis.com/auth/identitytoolkit')});
 if(path==='recovery/start'){
  const email=clean(body.email,255).toLowerCase();must(typeof body.email==='string'&&body.email.length<=255&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),'Enter a valid email address.');
  const emailHash=await recoveryHash(secret,'email|'+email),ratePath='recoveryLimits/'+emailHash,globalPath='recoveryLimits/global_'+Math.floor(now/86400000);
  const [rate,globalRate]=await Promise.all([db.get(ratePath),db.get(globalPath)]);const count=rate?.windowEnds>now?rate.count:0;
  must(!rate||now-rate.lastSent>=60000,'Wait at least 60 seconds before requesting another code.',429);must(count<5&&(globalRate?.count||0)<100,'Recovery request limit reached. Please try later or use the reset email link.',429);
  const challengeId=crypto.randomUUID(),recordPath='recoveryChallenges/'+challengeId;
  // Reserve the shared quota before calling either external service.
  await db.commit([db.write(ratePath,{count:count+1,lastSent:now,windowEnds:count?rate.windowEnds:now+3600000,activeChallenge:challengeId},rate),db.write(globalPath,{count:(globalRate?.count||0)+1},globalRate)]);
  const account=await recoveryPost(`https://identitytoolkit.googleapis.com/v1/projects/${encodeURIComponent(env.FIREBASE_PROJECT_ID)}/accounts:lookup`,{email:[email]},await authHeaders(),fetcher);
  const user=account.users?.[0],eligible=!!(user&&!user.disabled&&user.providerUserInfo?.some(p=>p.providerId==='password'));
  const code=recoveryCode(),record={email,emailHash,eligible,status:'pending',attempts:0,expiresAt:now+600000,codeHash:await recoveryHash(secret,challengeId+'|'+code)};
  await db.put(recordPath,record,null);
  if(eligible){try{await recoveryPost('https://api.resend.com/emails',{from:env.RECOVERY_FROM_EMAIL,to:[email],subject:'Your SkillPath password recovery code',text:`Your SkillPath verification code is ${code}. It expires in 10 minutes and can be used once. If you did not request this, ignore this email. Never share this code.`},{Authorization:'Bearer '+env.RESEND_API_KEY,'Idempotency-Key':challengeId},fetcher);}catch(error){const current=await db.get(recordPath);await db.put(recordPath,{...record,status:'failed',codeHash:''},current);throw error;}}
  return {challengeId,expiresIn:600,resendAfter:60,message:recoveryMessage};
 }
 must(['recovery/verify','recovery/reset'].includes(path),'API route not found.',404);
 must(typeof body.challengeId==='string'&&/^[a-f0-9-]{36}$/.test(body.challengeId),'Invalid or expired recovery request.',400);
 const recordPath='recoveryChallenges/'+body.challengeId,record=await db.get(recordPath);
 must(record&&record.expiresAt>now,'This recovery request expired. Request a new code.',400);
 const rate=await db.get('recoveryLimits/'+record.emailHash);must(rate?.activeChallenge===body.challengeId,'A newer code was requested. Use the latest code.',400);
 if(path==='recovery/verify'){
  must(record.status==='pending'&&record.attempts<5,'This code is no longer available. Request a new one.',400);
  const code=typeof body.code==='string'?body.code.trim():'';
  const valid=/^\d{6}$/.test(code)&&record.eligible&&recoveryEqual(record.codeHash,await recoveryHash(secret,body.challengeId+'|'+code));
  if(!valid){await db.put(recordPath,{...record,attempts:record.attempts+1,status:record.attempts+1>=5?'locked':'pending'},record);throw new AppError(400,'Incorrect or expired code. You have up to 5 attempts per code.');}
  const resetToken=recoveryHex(recoveryBytes(32));await db.put(recordPath,{...record,status:'verified',codeHash:'',tokenHash:await recoveryHash(secret,body.challengeId+'|'+resetToken),expiresAt:now+300000},record);
  return {resetToken,expiresIn:300};
 }
 must(record.status==='verified'&&typeof body.resetToken==='string'&&/^[a-f0-9]{64}$/.test(body.resetToken)&&recoveryEqual(record.tokenHash,await recoveryHash(secret,body.challengeId+'|'+body.resetToken)),'Recovery authorization is invalid or already used. Request a new code.',400);
 must(typeof body.password==='string'&&body.password.length>=8&&body.password.length<=128,'Use a password between 8 and 128 characters.');
 // CAS reserves this authorization once, even for concurrent requests.
 await db.put(recordPath,{...record,status:'resetting',tokenHash:''},record);
 try{
  const link=await recoveryPost('https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode',{requestType:'PASSWORD_RESET',email:record.email,targetProjectId:env.FIREBASE_PROJECT_ID,returnOobLink:true},await authHeaders(),fetcher);
  let oobCode;try{oobCode=new URL(link.oobLink).searchParams.get('oobCode');}catch{}must(oobCode,'Could not authorize password recovery. Request a new code.',503);
  await recoveryPost(`https://identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=${encodeURIComponent(env.FIREBASE_API_KEY)}`,{oobCode,newPassword:body.password},{},fetcher);
  const current=await db.get(recordPath);await db.put(recordPath,{status:'used',expiresAt:now,emailHash:record.emailHash},current);
  return {saved:true,message:'Password changed. Sign in with your new password.'};
 }catch{const current=await db.get(recordPath);await db.put(recordPath,{status:'failed',expiresAt:now,emailHash:record.emailHash},current);throw new AppError(503,'Could not confirm the password change. Try signing in, or request a new code and check your Firebase password requirements.');}
}

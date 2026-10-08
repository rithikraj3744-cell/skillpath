export async function enterAssessmentFullscreen(doc=document){
 if(!doc.fullscreenEnabled||!doc.documentElement.requestFullscreen)throw new Error('This browser cannot run a fullscreen assessment. Open SkillPath in a browser with fullscreen support. No new attempt has been used.');
 try{await doc.documentElement.requestFullscreen();}catch{throw new Error('Fullscreen was not allowed. Select Start or Resume and allow fullscreen. No new attempt has been used.');}
}
// Coalesce blur, visibility and fullscreen events for one departure. Re-arm
// when the learner returns to the tab, even if fullscreen still needs resuming.
export function watchAssessmentFocus({doc=document,win=window,onExit,onPause,onTick,expiresAt,now=Date.now}){
 let blurred=doc.hasFocus?!doc.hasFocus():false,away=doc.hidden||blurred,fullscreen=!!doc.fullscreenElement,ended=false;
 const pause=()=>onPause(doc.hidden||blurred||!doc.fullscreenElement);
 const depart=()=>{if(!away){away=true;onExit();}};
 const check=()=>{
  if(ended)return;
  const full=!!doc.fullscreenElement;
  if(doc.hidden||blurred)depart();
  else if(fullscreen&&!full)depart();
  else away=false;
  fullscreen=full;pause();
 };
 const blur=()=>{blurred=true;check();};
 const focus=()=>{blurred=false;check();};
 const visible=()=>{if(!doc.hidden)blurred=doc.hasFocus?!doc.hasFocus():false;check();};
 const pagehide=()=>{if(ended)return;depart();onPause(true);};
 doc.addEventListener('visibilitychange',visible);doc.addEventListener('fullscreenchange',check);
 win.addEventListener('blur',blur);win.addEventListener('focus',focus);win.addEventListener('pagehide',pagehide);
 const timer=win.setInterval(()=>{if(!ended){check();onTick(Math.max(0,expiresAt-now()));}},1000);pause();
 return ()=>{ended=true;doc.removeEventListener('visibilitychange',visible);doc.removeEventListener('fullscreenchange',check);win.removeEventListener('blur',blur);win.removeEventListener('focus',focus);win.removeEventListener('pagehide',pagehide);win.clearInterval(timer);};
}

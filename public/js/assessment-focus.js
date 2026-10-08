export async function enterAssessmentFullscreen(doc=document){
 if(!doc.fullscreenEnabled||!doc.documentElement.requestFullscreen)throw new Error('This browser cannot run a fullscreen assessment. Open SkillPath in a browser with fullscreen support. No new attempt has been used.');
 try{await doc.documentElement.requestFullscreen();}catch{throw new Error('Fullscreen was not allowed. Select Start or Resume and allow fullscreen. No new attempt has been used.');}
}
// One departure may emit both visibilitychange and fullscreenchange. Count it once,
// and re-arm only after the learner returns to a visible fullscreen document.
export function watchAssessmentFocus({doc=document,win=window,onExit,onPause,onTick,expiresAt,now=Date.now}){
 let away=doc.hidden||!doc.fullscreenElement,ended=false;
 const check=()=>{if(ended)return;const out=doc.hidden||!doc.fullscreenElement;if(out&&!away){away=true;onExit();}else if(!out)away=false;onPause(out);};
 const pagehide=()=>{if(!ended&&!away){away=true;onExit();}onPause(true);};
 doc.addEventListener('visibilitychange',check);doc.addEventListener('fullscreenchange',check);win.addEventListener('pagehide',pagehide);
 const timer=win.setInterval(()=>{if(!ended)onTick(Math.max(0,expiresAt-now()));},1000);onPause(away);
 return ()=>{ended=true;doc.removeEventListener('visibilitychange',check);doc.removeEventListener('fullscreenchange',check);win.removeEventListener('pagehide',pagehide);win.clearInterval(timer);};
}

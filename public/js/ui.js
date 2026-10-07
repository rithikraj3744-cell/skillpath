export const $=s=>document.querySelector(s);
export const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const paths={dashboard:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',journey:'<circle cx="6" cy="5" r="2"/><circle cx="18" cy="19" r="2"/><path d="M6 7v5a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V8M14 8h8"/>',graph:'<circle cx="12" cy="5" r="3"/><circle cx="5" cy="18" r="3"/><circle cx="19" cy="18" r="3"/><path d="m10 8-4 7m8-7 4 7M8 18h8"/>',assessment:'<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2h6v2M9 13l2 2 4-5"/>',learning:'<path d="M12 6c-3-2-6-2-10-1v15c4-1 7-1 10 1 3-2 6-2 10-1V5c-4-1-7-1-10 1v15"/>',progress:'<path d="M4 3v17h17M8 16v-4m5 4V8m5 8V4"/>',profile:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',cap:'<path d="m2 9 10-5 10 5-10 5-10-5Zm4 2v6c4 3 8 3 12 0v-6M22 9v8"/>',admin:'<path d="m12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6l9-4Z"/><path d="m8 12 3 3 5-6"/>',setup:'<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3"/><circle cx="15" cy="17" r="3"/>'};
export const icon=id=>`<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[id]||paths.learning}</svg>`;
export const logo=`<a class="logo" href="#dashboard"><span class="brand-mark">${icon('cap')}</span>SkillPath</a>`;
export const bar=n=>`<div class="bar"><i style="width:${Math.max(0,Math.min(100,Number(n)||0))}%"></i></div>`;
export const heading=(title,sub,action='')=>`<div class="heading"><div><h1>${title}</h1><p>${sub}</p></div>${action}</div>`;
export const btn=(text,route)=>`<a class="primary" href="#${route}">${text}</a>`;
export const empty=(title,sub,action='')=>`<div class="card empty"><h2>${title}</h2><p>${sub}</p><div class="empty-action">${action}</div></div>`;
export const status=s=>`<span class="status status-${esc(s)}">${esc(s[0].toUpperCase()+s.slice(1))}</span>`;
export function toast(message){$('#toast').textContent=message;$('#toast').style.display='block';clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>$('#toast').style.display='none',4500);}
let navigationCleanup=()=>{};
export function resetShell(){navigationCleanup();navigationCleanup=()=>{};}
export function shell(data,page,body){
 resetShell();
 const nav=[['dashboard','Dashboard'],['journey','My Journey'],['graph','Knowledge Graph'],['assessment','Assessments'],['learning','Learning Modules'],['progress','Progress'],['profile','Profile']];if(data?.user?.admin)nav.push(['admin','Admin Studio']);
 $('#app').innerHTML=`<div class="shell"><aside class="sidebar" id="app-navigation" aria-label="Navigation"><button class="nav-close" aria-label="Close navigation">✕</button>${logo}<div class="nav-label">WORKSPACE</div><nav class="nav">${nav.map(([id,name])=>`<a href="#${id}" class="${page===id?'active':''}" ${page===id?'aria-current="page"':''}><span class="icon">${icon(id)}</span>${name}</a>`).join('')}</nav><div class="sidebar-bottom"><a class="link" href="#help">Help & data use</a>${data.user.admin?'<br><a class="link" href="#setup">Setup & connection status</a>':''}<hr><button class="logout" id="logout">↪ &nbsp; Sign out</button></div></aside><div class="nav-backdrop" aria-hidden="true"></div><section class="workspace"><header class="topbar"><button class="mobile-toggle" aria-label="Toggle navigation" aria-controls="app-navigation" aria-expanded="false">☰</button><form id="search-form"><input class="search" name="query" placeholder="Search competencies…" aria-label="Search competencies"></form><div class="top-right"><span class="live-label">Workspace synced</span><a class="user" href="#profile" aria-label="Open your profile"><div class="avatar">${esc((data.profile.name||'L')[0])}</div><div><strong>${esc(data.profile.name)}</strong><small>${data.user.admin?'Administrator':'Student'}</small></div></a></div></header><main id="main-content" tabindex="-1" class="page-${esc(page)}">${body}</main></section></div>`;
 const sidebar=$('.sidebar'),toggle=$('.mobile-toggle'),workspace=$('.workspace');
 const mobile=window.matchMedia('(max-width: 64rem)');
 const setNavigation=(open,restoreFocus=true)=>{
  open=open&&mobile.matches;
  sidebar.classList.toggle('open',open);
  toggle.setAttribute('aria-expanded',String(open));
  workspace.inert=open;
  if(open){sidebar.setAttribute('role','dialog');sidebar.setAttribute('aria-modal','true');$('.nav-close').focus();}
  else{sidebar.removeAttribute('role');sidebar.removeAttribute('aria-modal');if(restoreFocus&&mobile.matches&&toggle.isConnected)toggle.focus();}
 };
 toggle.onclick=()=>setNavigation(!sidebar.classList.contains('open'));
 $('.nav-close').onclick=()=>setNavigation(false);
 $('.nav-backdrop').onclick=()=>setNavigation(false);
 sidebar.addEventListener('click',e=>{if(e.target.closest('a, #logout'))setNavigation(false,false);});
 const onKey=e=>{
  if(!sidebar.classList.contains('open'))return;
  if(e.key==='Escape'){e.preventDefault();setNavigation(false);}
  if(e.key==='Tab'){
   const items=[...sidebar.querySelectorAll('a[href],button:not(:disabled)')].filter(el=>el.getClientRects().length);
   const first=items[0],last=items.at(-1);
   if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
   else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  }
 };
 const onResize=()=>setNavigation(false,false);
 document.addEventListener('keydown',onKey);
 mobile.addEventListener('change',onResize);
 navigationCleanup=()=>{setNavigation(false,false);document.removeEventListener('keydown',onKey);mobile.removeEventListener('change',onResize);};
 $('#search-form').onsubmit=e=>{e.preventDefault();const q=new FormData(e.target).get('query').trim().toLowerCase();if(!q){toast('Enter a competency name to search.');return;}const node=data.nodes.find(n=>n.name.toLowerCase().includes(q));if(node)location.hash='graph/'+node.id;else toast('No matching competency in your selected career.');};
}
export function showDialog(title,content){$('#dialog-title').textContent=title;$('#dialog-content').innerHTML=content;$('#dialog').oncancel=null;$('#dialog-close').onclick=()=>$('#dialog').close();$('#dialog').showModal();$('#dialog').scrollTop=0;}
export function installDialog(){if($('#dialog'))return;document.body.insertAdjacentHTML('beforeend','<dialog id="dialog" aria-labelledby="dialog-title"><div class="dialog-head"><h2 id="dialog-title"></h2><button id="dialog-close" aria-label="Close dialog">✕</button></div><div id="dialog-content"></div></dialog>');$('#dialog-close').onclick=()=>$('#dialog').close();}
export async function busy(button,fn){const label=button.innerHTML;button.disabled=true;button.setAttribute('aria-busy','true');button.textContent='Working…';const oldError=$('#dialog[open] #form-error')||$('#form-error');if(oldError)oldError.textContent='';try{return await fn();}catch(e){toast(e.message);const error=$('#dialog[open] #form-error')||$('#form-error');if(error)error.textContent=e.message;}finally{button.disabled=false;button.removeAttribute('aria-busy');button.innerHTML=label;}}

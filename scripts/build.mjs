import {readFile,writeFile,mkdir,rm,readdir,copyFile} from 'node:fs/promises';
import {resolve,relative,extname} from 'node:path';
const root=resolve(import.meta.dirname,'..');
let source=(await readFile(resolve(root,'public/js/record-id.js'),'utf8')).replace(/\bexport /g,'')+'\n';
source+=(await readFile(resolve(root,'public/js/assessment-policy.js'),'utf8')).replace(/\bexport /g,'')+'\n';
for(const file of ['engine.js','firebase.js','curriculum.js','career-content.js','learning-resources.js','question-topics.js','seed.js','ai.js','recovery.js','assessments.js','api.js']){
 const code=await readFile(resolve(root,'server',file),'utf8');
 source+=`\n// ${file}\n`+code.replace(/^import .*;\n/gm,'').replace(/\bexport (?=(async )?(function|class|const|let)\b)/g,'');
}
const files={};const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.txt':'text/plain; charset=utf-8','.md':'text/plain; charset=utf-8','.zip':'application/zip','.webp':'image/webp','.xlsx':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','.svg':'image/svg+xml','.webmanifest':'application/manifest+json'};
async function walk(dir){for(const entry of await readdir(dir,{withFileTypes:true})){const path=resolve(dir,entry.name);if(entry.isDirectory())await walk(path);else {const content=await readFile(path);files['/'+relative(resolve(root,'public'),path)]={content:content.toString('base64'),type:types[extname(path)]||'application/octet-stream'};}}}
await walk(resolve(root,'public'));
source+=`\nconst ASSETS=${JSON.stringify(files)};\nexport default {async fetch(request,env){const url=new URL(request.url);if(url.pathname.startsWith('/api/'))return handleAPI(request,env);if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405});const item=ASSETS[url.pathname==='/'?'/index.html':url.pathname];if(!item)return new Response('Not found',{status:404});return new Response(request.method==='HEAD'?null:Uint8Array.from(atob(item.content),c=>c.charCodeAt(0)),{headers:{'Content-Type':item.type,'Cache-Control':'no-cache','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin'}});}};\n`;
await rm(resolve(root,'dist'),{recursive:true,force:true});await mkdir(resolve(root,'dist/server'),{recursive:true});await mkdir(resolve(root,'dist/.openai'),{recursive:true});await writeFile(resolve(root,'dist/server/index.js'),source);await copyFile(resolve(root,'.openai/hosting.json'),resolve(root,'dist/.openai/hosting.json'));
console.log(`Built Worker with ${Object.keys(files).length} assets (${Math.round(source.length/1024)} KiB).`);

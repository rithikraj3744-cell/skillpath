import {access} from 'node:fs/promises';
const required=['public/index.html','public/style.css','public/responsive.css','public/js/app.js','public/js/admin.js','public/js/record-id.js','public/js/help.js','api/index.js','server/api.js','server/firebase.js','server/engine.js','server/seed.js'];
for(const path of required){
 try{await access(new URL('../'+path,import.meta.url));}
 catch{throw new Error(`Missing required project file: ${path}. Upload the complete api, server, public and scripts folders with their directory structure intact.`);}
}
console.log('Required frontend and backend files are present. Vercel compiles api/index.js.');

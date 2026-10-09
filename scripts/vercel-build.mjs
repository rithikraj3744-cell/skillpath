import {access,rm} from 'node:fs/promises';
const required=['public/js/landing.js','public/landing.css','public/assets/skillpath-hero.webp','server/assessments.js','public/js/assessment-focus.js','public/js/assessment-ui.js','public/js/assessment-policy.js','public/js/import-ui.js','public/js/question-import.js','public/js/recovery-ui.js','public/vendor/xlsx.full.min.js','public/assets/learning-journey.webp','public/downloads/question-import-example.xlsx','server/recovery.js','server/question-topics.js','public/index.html','public/style.css','public/responsive.css','public/js/app.js','public/js/google-auth.js','public/google.svg','public/js/admin.js','public/js/record-id.js','public/js/help.js','api/index.js','server/api.js','server/ai.js','server/firebase.js','server/engine.js','server/seed.js','server/curriculum.js','server/career-content.js','server/learning-resources.js'];
for(const path of required){
 try{await access(new URL('../'+path,import.meta.url));}
 catch{throw new Error(`Missing required project file: ${path}. Upload the complete api, server, public and scripts folders with their directory structure intact.`);}
}
console.log('Required frontend and backend files are present. Vercel compiles api/index.js.');

// Remove retired public assets even when an upload overlays an older checkout.
for(const name of ['demo.html','demo.css','demo.js'])await rm(new URL('../public/'+name,import.meta.url),{force:true});

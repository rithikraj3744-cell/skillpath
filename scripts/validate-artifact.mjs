import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const source=await readFile(new URL('../dist/server/index.js',import.meta.url),'utf8');
const {default:worker}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
assert.equal(typeof worker.fetch,'function');
const home=await worker.fetch(new Request('https://example.test/'),{});assert.equal(home.status,200);assert.match(await home.text(),/js\/app.js/);
for(const path of ['/js/app.js','/js/admin.js','/style.css','/demo.html']){const r=await worker.fetch(new Request('https://example.test'+path),{});assert.equal(r.status,200,path);}
const config=await worker.fetch(new Request('https://example.test/api/config'),{});assert.equal((await config.json()).ready,false);
const missing=await worker.fetch(new Request('https://example.test/api/bootstrap'),{});assert.equal(missing.status,503);
const hidden=await worker.fetch(new Request('https://example.test/server/firebase.js'),{});assert.equal(hidden.status,404);
console.log('Worker ESM, assets, setup mode, and server-source isolation verified.');

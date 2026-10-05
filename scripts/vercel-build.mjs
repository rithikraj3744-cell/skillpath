import {access} from 'node:fs/promises';
await access(new URL('../public/index.html',import.meta.url));
console.log('Static frontend ready in public/; Vercel compiles api/index.js.');

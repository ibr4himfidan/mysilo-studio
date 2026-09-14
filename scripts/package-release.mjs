import { cp, mkdir } from 'node:fs/promises';
const output = '.next/standalone';
await mkdir(output+'/.next', {recursive:true});
await cp('public', output+'/public', {recursive:true});
await cp('.next/static', output+'/.next/static', {recursive:true});
await mkdir(output+'/scripts', {recursive:true});
await cp('scripts/database.mjs', output+'/scripts/database.mjs');
await cp('drizzle', output+'/drizzle', {recursive:true});
// Next 16.3's trace omits a metadata helper used by the standalone router.
// Ship its complete runtime so the release does not rely on parent node_modules.
await cp('node_modules/next/dist', output+'/node_modules/next/dist', {recursive:true});
console.log('Production release ready: '+output);

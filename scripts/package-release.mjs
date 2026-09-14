import { cp, mkdir } from 'node:fs/promises';
const output = '.next/standalone';
await mkdir(output+'/.next', {recursive:true});
await cp('public', output+'/public', {recursive:true});
await cp('.next/static', output+'/.next/static', {recursive:true});
await mkdir(output+'/scripts', {recursive:true});
await cp('scripts/database.mjs', output+'/scripts/database.mjs');
await cp('drizzle', output+'/drizzle', {recursive:true});
console.log('Production release ready: '+output);

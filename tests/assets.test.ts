import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {assets,sources} from '../lib/catalog';
import {researchSections} from '../lib/research';
test('all 8 local model assets are valid GLB containers with expected geometry',async()=>{for(const asset of assets){const bytes=await readFile(`public/assets/models/${asset.id}.glb`);assert.equal(bytes.toString('ascii',0,4),'glTF');assert.equal(bytes.readUInt32LE(4),2);assert.equal(bytes.readUInt32LE(8),bytes.length);const length=bytes.readUInt32LE(12);assert.equal(bytes.toString('ascii',16,20),'JSON');const json=JSON.parse(bytes.toString('utf8',20,20+length));assert.ok(json.meshes.length>0);assert.ok(json.nodes.some((n:{extras?:{units:string}})=>n.extras?.units==='meter'));assert.ok(!json.images?.some((i:{uri?:string})=>i.uri?.startsWith('http')))}});
test('research and asset citations resolve to primary-source inventory',()=>{for(const section of researchSections)for(const p of section.paragraphs)for(const m of p.matchAll(/\[(\d+)\]/g))assert.ok(sources.some(s=>s.id===Number(m[1])));for(const a of assets)assert.ok(sources.some(s=>s.id===a.source));assert.equal(assets.length,8);assert.equal(new Set(sources.map(s=>s.id)).size,sources.length)});

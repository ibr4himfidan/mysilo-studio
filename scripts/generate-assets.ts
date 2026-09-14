import {mkdir,writeFile} from 'node:fs/promises';
import {GLTFExporter} from 'three/addons/exporters/GLTFExporter.js';
import {Box3,Vector3} from 'three';
import {createAsset} from '../lib/asset-model';
import {disposeModel} from '../lib/models';
import {assets,sources} from '../lib/catalog';
// Texture-free GLB export uses only FileReader.readAsArrayBuffer in Node.
class NodeFileReader{result:ArrayBuffer|null=null;onloadend:(()=>void)|null=null;onerror:((e:unknown)=>void)|null=null;readAsArrayBuffer(blob:Blob){blob.arrayBuffer().then(result=>{this.result=result;this.onloadend?.()}).catch(e=>this.onerror?.(e))}}
Object.defineProperty(globalThis,'FileReader',{value:NodeFileReader,configurable:true});
await mkdir('public/assets/models',{recursive:true});
const manifest=[];
for(const asset of assets){const model=createAsset(asset.id);model.userData={...model.userData,units:'meter',origin:'Silo Studio original parametric geometry',validation:'Conceptual only. Not manufacturer CAD.'};const data=await new GLTFExporter().parseAsync(model,{binary:true});if(!(data instanceof ArrayBuffer))throw new Error('Invalid GLB');await writeFile(`public/assets/models/${asset.id}.glb`,Buffer.from(data));const bounds=new Box3().setFromObject(model),size=bounds.getSize(new Vector3());manifest.push({...asset,path:`/assets/models/${asset.id}.glb`,bytes:data.byteLength,units:'meter',upAxis:'Y',actualBoundingBox:[size.x,size.y,size.z],ownership:'Original geometry generated for this project. No third-party mesh or texture.',manufacturerCAD:false,reference:sources.find(s=>s.id===asset.source)?.url});disposeModel(model)}
await writeFile('public/assets/manifest.json',JSON.stringify({version:1,generatedAt:new Date().toISOString(),assets:manifest},null,2));
console.log(`Generated ${manifest.length} GLB assets (${manifest.reduce((s,a)=>s+a.bytes,0)} bytes)`);

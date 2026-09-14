import * as T from 'three';
import {compactStatic} from './render-batching';
import type {EquipmentJob,Item} from './editor';
import type {BuildStage} from './installation';
import {equipmentPhases} from './equipment-timeline';
export type AssemblyUnit={root:T.Group;stage:BuildStage;target:T.Vector3;size:T.Vector3;flat:boolean;index:number};
// Slice tall casings and columns into transportable sections. Vertex normals are
// interpolated at the cuts; neighbouring sections meet on the same plane.
function slice(source:T.BufferGeometry,low:number,high:number){const raw=source.index?source.toNonIndexed():source.clone(),pos=raw.getAttribute('position'),norm=raw.getAttribute('normal'),vertices:number[]=[],normals:number[]=[];
 type V={p:T.Vector3;n:T.Vector3};
 const clip=(poly:V[],limit:number,above:boolean)=>{const out:V[]=[];for(let n=0;n<poly.length;n++){const a=poly[n],b=poly[(n+1)%poly.length],insideA=above?a.p.y>=limit:a.p.y<=limit,insideB=above?b.p.y>=limit:b.p.y<=limit;if(insideA)out.push(a);if(insideA!==insideB){const t=(limit-a.p.y)/(b.p.y-a.p.y);out.push({p:a.p.clone().lerp(b.p,t),n:a.n.clone().lerp(b.n,t).normalize()})}}return out};
 for(let k=0;k<pos.count;k+=3){let poly:V[]=Array.from({length:3},(_,n)=>({p:new T.Vector3().fromBufferAttribute(pos,k+n),n:norm?new T.Vector3().fromBufferAttribute(norm,k+n):new T.Vector3(0,1,0)}));poly=clip(clip(poly,low,true),high,false);for(let n=1;n<poly.length-1;n++)for(const v of [poly[0],poly[n],poly[n+1]]){vertices.push(...v.p.toArray());normals.push(...v.n.toArray())}}
 raw.dispose();const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(vertices,3));geometry.setAttribute('normal',new T.Float32BufferAttribute(normals,3));return geometry;
}
function classify(mesh:T.Mesh,i:Item,job:EquipmentJob,center:T.Vector3,size:T.Vector3):BuildStage{
 if(mesh.userData.assembly)return mesh.userData.assembly;
 if(job.mode==='access'){let node:T.Object3D|null=mesh;while(node){if(/guardrail|closure|gate|ladder/i.test(node.name))return'walkwayFixing';if(/structure/i.test(node.name))return'frameAssembly';node=node.parent}return'moduleLifting'}
 if(i.kind==='conveyor')return'moduleLifting';
 if(i.kind==='tower')return'moduleLifting';
 if(i.kind==='building')return'panelAssembly';
 if(i.kind==='intake')return center.y-i.y>i.height*.88?'panelAssembly':size.y>1?'moduleLifting':'foundation';
 const material=(Array.isArray(mesh.material)?mesh.material[0]:mesh.material) as T.MeshStandardMaterial,red=material.color&&material.color.r>material.color.g*1.7;
 if(red&&size.y<2.5)return'driveAssembly';
 const geo=mesh.geometry as T.CylinderGeometry;const slender=Math.min(size.x,size.z)<.28||geo.type==='CylinderGeometry'&&geo.parameters.radiusTop<.2;
 if(slender)return'frameAssembly';
 if(center.y-i.y<.55&&size.y<1)return'baseAnchoring';
 return'moduleLifting';
}
export function equipmentParts(source:T.Group,i:Item,job:EquipmentJob):AssemblyUnit[]{
 source.updateMatrixWorld(true);const phases=equipmentPhases(job).map(p=>p.stage),buckets=new Map<string,{stage:BuildStage;root:T.Group}>();
 source.traverse(o=>{if(!(o instanceof T.Mesh)||o.name==='selection')return;const baked=o.geometry.clone().applyMatrix4(o.matrixWorld),bounds=new T.Box3().setFromBufferAttribute(baked.getAttribute('position')),size=bounds.getSize(new T.Vector3());
  const split=job.mode==='install'&&['elevator','tower','dryer'].includes(i.kind)&&size.y>4,count=split?Math.ceil(size.y/3):1;
  for(let n=0;n<count;n++){const geometry=count>1?slice(baked,bounds.min.y+n*size.y/count,bounds.min.y+(n+1)*size.y/count):baked.clone();if(!geometry.getAttribute('position').count){geometry.dispose();continue}const box=new T.Box3().setFromBufferAttribute(geometry.getAttribute('position')),center=box.getCenter(new T.Vector3()),partSize=box.getSize(new T.Vector3());let stage=classify(o,i,job,center,partSize);if(!phases.includes(stage))stage=phases.includes('moduleLifting')?'moduleLifting':'frameAssembly';
   const level=Math.floor((center.y-i.y)/3),key=i.kind==='conveyor'?stage:`${stage}:${o.userData.assemblyGroup||level}`;let bucket=buckets.get(key);if(!bucket){bucket={stage,root:new T.Group()};buckets.set(key,bucket)}
   const part=new T.Mesh(geometry,o.material);part.castShadow=true;part.receiveShadow=true;bucket.root.add(part);
  }baked.dispose();
 });
 return [...buckets.values()].sort((a,b)=>phases.indexOf(a.stage)-phases.indexOf(b.stage)||new T.Box3().setFromObject(a.root).min.y-new T.Box3().setFromObject(b.root).min.y).map(({root,stage},index)=>{const bounds=new T.Box3().setFromObject(root),target=bounds.getCenter(new T.Vector3()),size=bounds.getSize(new T.Vector3());root.children.forEach(o=>(o as T.Mesh).geometry.translate(-target.x,-target.y,-target.z));
  const parts=[...root.children];root.clear();for(let n=0;n<parts.length;n+=32){const step=new T.Group();step.name='Assembly section';step.add(...parts.slice(n,n+32));compactStatic(step);root.add(step)}
  root.name='Installation module '+index;root.position.copy(target);return{root,stage,target,size,flat:i.kind!=='conveyor'&&size.y>3&&size.y>size.x*.7,index}});
}

import * as T from 'three';
import {manualItem} from './manual-models';
import {walkwayLaydown,type BuildStage} from './installation';
import {walkwayPose} from './walkway-animation';
import type {Item,Project} from './editor';
const mat=(color:number)=>new T.MeshStandardMaterial({color,metalness:.45,roughness:.55});
function box(g:T.Object3D,w:number,h:number,d:number,x:number,y:number,z:number,color:number){const m=new T.Mesh(new T.BoxGeometry(w,h,d),mat(color));m.position.set(x,y,z);m.castShadow=true;g.add(m);return m}
function link(g:T.Object3D,a:T.Vector3,b:T.Vector3,r:number,color:number){const mesh=new T.Mesh(new T.CylinderGeometry(r,r,1,8),mat(color));g.add(mesh);const update=(from:T.Vector3,to:T.Vector3)=>{mesh.position.copy(from).add(to).multiplyScalar(.5);mesh.scale.y=Math.max(.001,from.distanceTo(to));mesh.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),to.clone().sub(from).normalize())};update(a,b);return{mesh,update}}
export function walkwayRig(p:Project,i:Item){
 const root=new T.Group();root.name='Catwalk erection '+i.id;const bay=walkwayLaydown(p,i),deck=manualItem(i,false,p.items);deck.position.set(0,0,0);deck.rotation.y=0;root.add(deck);
 const parts=[...deck.children].sort((a,b)=>a.position.x-b.position.x);
 const stands=new T.Group();stands.name='Ground assembly trestles';root.add(stands);
 const base=bay||{x:i.x,z:i.z,rotation:i.rotation,crane:{x:i.x,z:i.z+6}};
 stands.position.set(base.x,0,base.z);stands.rotation.y=base.rotation*Math.PI/180;
 for(const x of [-i.width*.33,0,i.width*.33]){box(stands,.3,.15,i.depth+1,x,.74,0,0xc00031);for(const z of [-i.depth/2,i.depth/2])box(stands,.2,.65,.2,x,.35,z,0x4b5c65)}
 const crane=new T.Group();crane.name='Mobile crane';crane.position.set(base.crane.x,0,base.crane.z);root.add(crane);
 box(crane,5.8,.7,2.6,0,1,0,0xd1a13d);box(crane,1.5,1.5,2.3,2,2,0,0xc00031);box(crane,1.55,.85,2.32,2,2.25,0,0x7396a5);box(crane,1.5,1.2,2.5,-1.8,2,0,0xc00031);
 for(const x of [-1.9,0,1.9])for(const z of [-1.5,1.5]){const wheel=new T.Mesh(new T.CylinderGeometry(.55,.55,.4,16),mat(0x303c42));wheel.rotation.x=Math.PI/2;wheel.position.set(x,.6,z);crane.add(wheel)}
 for(const x of [-2,2]){box(crane,.22,.22,6,x,.65,0,0x4b5c65);for(const z of [-3,3]){box(crane,.18,.55,.18,x,.35,z,0xc7d0d0);box(crane,.8,.12,.8,x,.08,z,0x394b54)}}
 const pivot=new T.Vector3(0,2.5,0),boom=Array.from({length:3},(_,n)=>link(crane,pivot,new T.Vector3(0,5,0),.33-n*.07,n===0?0xc00031:0xd2aa48));
 const hook=new T.Group();hook.name='Crane hook and spreader';root.add(hook);box(hook,Math.min(i.width*.65,12),.18,.3,0,0,0,0xc00031);box(hook,.35,.5,.35,0,.4,0,0x3b4c55);
 const cable=link(root,new T.Vector3(),new T.Vector3(0,1,0),.035,0x394952),slings=Array.from({length:4},()=>link(root,new T.Vector3(),new T.Vector3(0,1,0),.025,0x6c7a80));
 return{root,base,update:(stage:BuildStage,progress:number)=>{
  root.visible=['walkwayAssembly','walkwayRigging','walkwayLifting','walkwayFixing'].includes(stage);if(!root.visible)return;
  const pose=walkwayPose(p,i,stage,progress,bay);deck.position.set(pose.x,pose.y,pose.z);deck.rotation.y=pose.rotation*Math.PI/180;
  parts.forEach((part,n)=>part.visible=stage!=='walkwayAssembly'||n<Math.ceil(progress*parts.length));
  stands.visible=stage==='walkwayAssembly'||stage==='walkwayRigging'||stage==='walkwayLifting'&&progress<.12;
  const rigged=stage!=='walkwayAssembly'&&(stage!=='walkwayRigging'||progress>.35);hook.visible=rigged;cable.mesh.visible=rigged;slings.forEach(s=>s.mesh.visible=rigged);
  const spreadY=pose.y+i.height+2.1,hookAt=new T.Vector3(pose.x,spreadY,pose.z);hook.position.copy(hookAt);hook.rotation.y=pose.rotation*Math.PI/180;
  const tip=hookAt.clone().add(new T.Vector3(0,5,0));cable.update(tip,hookAt.clone().add(new T.Vector3(0,.65,0)));
  const localTip=tip.clone().sub(crane.position);boom.forEach((section,n)=>section.update(pivot.clone().lerp(localTip,n/3),pivot.clone().lerp(localTip,(n+1)/3)));
  for(let n=0;n<4;n++){const x=(n%2?1:-1)*Math.min(i.width*.3,5.7),z=(n<2?1:-1)*i.depth*.4,a=pose.rotation*Math.PI/180;
   const end=new T.Vector3(pose.x+x*Math.cos(a)+z*Math.sin(a),pose.y+.3,pose.z-x*Math.sin(a)+z*Math.cos(a));
   const start=new T.Vector3(pose.x+x*Math.cos(a),spreadY,pose.z-x*Math.sin(a));slings[n].update(start,end);
  }
 }};
}

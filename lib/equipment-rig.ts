import * as T from 'three';
import {manualItem,accessModels} from './manual-models';
import {itemFootprint,itemTop,type EquipmentJob,type Item,type Project} from './editor';
import type {BuildStage} from './installation';
import {equipmentLaydown} from './equipment-installation';
import {equipmentPhases} from './equipment-timeline';
import {equipmentParts,type AssemblyUnit} from './equipment-parts';
import {equipmentBase} from './equipment-base';
import {liftingCrane} from './lifting-crane';
import {worker,excavator,concreteMixer} from './site-actors';
const ease=(value:number)=>{const t=T.MathUtils.clamp(value,0,1);return t*t*(3-2*t)};
export function modulePose(unit:AssemblyUnit,bay:{x:number;z:number;rotation?:number},progress:number,clearance:number){
 const angle=unit.flat?Math.PI/2:0,yaw=(bay.rotation||0)*Math.PI/180,startY=.85+(unit.flat?unit.size.x:unit.size.y)/2,high=Math.max(clearance+unit.size.length()/2,unit.target.y+unit.size.y/2+3);
 if(progress<.35){const q=ease(progress/.35);return{position:new T.Vector3(bay.x,T.MathUtils.lerp(startY,high,q),bay.z),angle:angle*(1-q),yaw:yaw*(1-q)}}
 if(progress<.78){const q=ease((progress-.35)/.43);return{position:new T.Vector3(T.MathUtils.lerp(bay.x,unit.target.x,q),high,T.MathUtils.lerp(bay.z,unit.target.z,q)),angle:0,yaw:0}}
 return{position:new T.Vector3(unit.target.x,T.MathUtils.lerp(high,unit.target.y,ease((progress-.78)/.22)),unit.target.z),angle:0,yaw:0};
}
function prop(g:T.Object3D,w:number,h:number,d:number,x:number,y:number,z:number,color:number){const mesh=new T.Mesh(new T.BoxGeometry(w,h,d),new T.MeshStandardMaterial({color,roughness:.8}));mesh.position.set(x,y,z);mesh.castShadow=true;g.add(mesh);return mesh}
export function equipmentRig(p:Project,i:Item,job:EquipmentJob){
 const root=new T.Group();root.name='Equipment construction '+i.id;
 const source=new T.Group(),accessProject={...p,items:p.items.map(other=>other.id===i.id?other:{...other,access:undefined})};if(job.mode==='install')source.add(manualItem(i,false,p.items));if(i.access){const access=accessModels(accessProject);access.children.forEach((child,index)=>child.traverse(o=>{if(o instanceof T.Mesh)o.userData.assemblyGroup=`access-${index}`}));source.add(access)}
 const units=equipmentParts(source,i,job);source.traverse(o=>{if(o instanceof T.Mesh)o.geometry.dispose()});source.clear();root.add(...units.map(u=>u.root));
 const bay=equipmentLaydown(p,i)||{x:i.x+i.width/2+7,z:i.z,rotation:0,crane:{x:i.x+i.width/2+7,z:i.z+5}};
 const phaseNames=equipmentPhases(job).map(p=>p.stage),crane=liftingCrane(bay.crane.x,bay.crane.z),crew=Array.from({length:3},worker),digger=excavator(),mixer=concreteMixer(),base=equipmentBase(i);
 root.add(crane.root,...crew.map(w=>w.root),digger.root,mixer.root);if(job.mode==='install')root.add(base);
 const preparation=new T.Group();preparation.name='Equipment ground preparation';preparation.position.set(i.x,0,i.z);preparation.rotation.y=i.rotation*Math.PI/180;root.add(preparation);const footprint=itemFootprint(i);
 for(const x of [-1,1])for(const z of [-1,1]){prop(preparation,.07,.55,.07,x*(footprint.width/2+.3),.25,z*(footprint.depth/2+.3),0xc99a35)}
 const pallet=new T.Group();pallet.name='Assembly bay and delivery pallets';pallet.position.set(bay.x,0,bay.z);pallet.rotation.y=bay.rotation*Math.PI/180;root.add(pallet);
 for(let n=-2;n<=2;n++)prop(pallet,Math.min(7,Math.max(i.width,i.height)),.16,.18,0,.25,n*.35,0x96764d);
 for(const x of [-1.6,1.6])prop(pallet,.3,.2,2,x,.1,0,0x786046);
 const crates=new T.Group();crates.name='Delivered equipment components';pallet.add(crates);for(let n=0;n<3;n++)prop(crates,1.1,.6,.8,(n-1)*1.4,.62,0,n===1?0xc00031:0xa7b7bf);
 const soil=new T.Group();soil.name='Intake excavation';soil.position.set(i.x,0,i.z);soil.rotation.y=i.rotation*Math.PI/180;root.add(soil);
 const cover=prop(soil,i.width,.035,i.depth,0,-.07,0,0xe0e4e5);const pit=prop(soil,i.width,.08,i.depth,0,.02-i.height,0,0x71583e);
 const lamp=new T.Mesh(new T.SphereGeometry(.16,12,8),new T.MeshBasicMaterial({color:0x2daf80}));lamp.name='Equipment commissioning indicator';lamp.position.set(i.x+i.width/2+.25,i.y+1.3,i.z);root.add(lamp);
 const clearance=Math.max(5,...p.items.map(itemTop))+3,assemblyDepth=Math.max(i.depth,...units.map(u=>u.size.z)),bayAngle=bay.rotation*Math.PI/180;
 return{root,units,bay,update:(stage:BuildStage,progress:number,time:number)=>{
  root.visible=stage!=='complete';if(!root.visible)return;
  const phaseIndex=phaseNames.indexOf(stage),isBase=['foundation','baseAnchoring'].includes(stage);let active:AssemblyUnit|undefined,local=0;
  preparation.visible=stage==='queued'||stage==='sitePreparation';pallet.visible=!['queued','commissioning'].includes(stage);crates.visible=stage==='sitePreparation';
  base.visible=job.mode==='install'&&!['queued','sitePreparation','excavating'].includes(stage);base.scale.y=isBase?Math.max(.01,progress):1;
  soil.visible=job.mode==='install'&&i.kind==='intake'&&i.y===0;cover.visible=['queued','sitePreparation','excavating'].includes(stage);cover.scale.x=stage==='excavating'?Math.max(.001,1-progress):1;cover.position.x=stage==='excavating'?i.width*progress/2:0;pit.visible=!['queued','sitePreparation'].includes(stage);
  const current=units.filter(u=>u.stage===stage),at=Math.min(current.length-.00001,Math.max(0,progress*current.length));
  for(const unit of units){const earlier=phaseNames.indexOf(unit.stage)<phaseIndex,index=current.indexOf(unit),done=earlier||index>=0&&index<Math.floor(at);unit.root.rotation.set(0,0,0);unit.root.position.copy(unit.target);unit.root.children.forEach(o=>o.visible=true);
   unit.root.visible=done;
   if(index>=0&&index===Math.floor(at)&&!isBase){active=unit;local=at-index;unit.root.visible=true;
    const preassembled=i.kind==='conveyor'||i.kind==='tower'&&index===0&&stage==='moduleLifting',assemblyEnd=preassembled?0:.22;
    const pose=modulePose(unit,bay,Math.max(0,(local-assemblyEnd)/(.85-assemblyEnd)),clearance);unit.root.position.copy(pose.position);unit.root.rotation.set(0,pose.yaw,pose.angle,'YXZ');
    if(local<assemblyEnd)unit.root.children.forEach((o,n)=>o.visible=n<Math.ceil(local/assemblyEnd*unit.root.children.length));
   }else if(index>=0&&isBase){unit.root.visible=index<=Math.floor(at)}
   if((i.kind==='conveyor'||i.kind==='tower'&&unit===units.find(u=>u.stage==='moduleLifting'))&&stage==='frameAssembly'){unit.root.visible=true;const pose=modulePose(unit,bay,0,clearance);unit.root.position.copy(pose.position);unit.root.rotation.set(0,pose.yaw,pose.angle,'YXZ');unit.root.children.forEach((o,n)=>o.visible=n<Math.ceil(progress*unit.root.children.length))}
  }
  crane.root.visible=!!active&&(local>=.22||stage==='moduleLifting'&&(i.kind==='conveyor'||i.kind==='tower'&&active===current[0]));
  if(active&&crane.root.visible){active.root.updateMatrixWorld(true);const y=active.size.y/2,x=Math.min(active.size.x*.35,4);const points:[T.Vector3,T.Vector3]=[new T.Vector3(-x,y,0),new T.Vector3(x,y,0)];points.forEach(pt=>pt.applyMatrix4(active!.root.matrixWorld));crane.update(points)}
  digger.root.visible=stage==='excavating';digger.root.position.set(i.x,0,i.z+i.depth/2+1.6);digger.update(time);
  mixer.root.visible=stage==='foundation';mixer.root.position.set(i.x,0,i.z+i.depth/2+1.6);mixer.update(time,progress>.15&&progress<.85);
  crew.forEach((w,n)=>{w.root.visible=stage!=='queued';if(crane.root.visible){w.root.position.set(bay.crane.x+(n-1)*1.1,0,bay.crane.z+4);w.root.rotation.y=Math.PI}
   else if(isBase||stage==='commissioning'){w.root.position.set(i.x+(n-1)*1.2,0,i.z+i.depth/2+1.1);w.root.rotation.y=Math.PI}
   else {const x=(n-1)*1.5,z=assemblyDepth/2+.8;w.root.position.set(bay.x+x*Math.cos(bayAngle)+z*Math.sin(bayAngle),0,bay.z-x*Math.sin(bayAngle)+z*Math.cos(bayAngle));w.root.rotation.y=bayAngle+Math.PI}w.update(crane.root.visible?0:time+n)});
  lamp.visible=stage==='commissioning';lamp.scale.setScalar(.85+Math.sin(time*5)*.15);
 }};
}

import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {createItem,createProject,parseProject,EQUIPMENT_KINDS,type Setup} from '../lib/editor';
import {instantiateEquipment,instantiateAccess,replayEquipment,equipmentLaydown} from '../lib/equipment-installation';
import {equipmentPhases,equipmentDuration} from '../lib/equipment-timeline';
import {advanceConstruction,baseBuildSeconds,buildBusy,constructionStage,totalBuildSeconds,instantiateBatch,instantiateWalkways} from '../lib/installation';
import {equipmentRig,modulePose} from '../lib/equipment-rig';
import {constructionVisuals} from '../lib/construction-models';
import {manualItem,environment} from '../lib/manual-models';
import {siteGridPoints} from '../lib/site-grid';
import {disposeModel} from '../lib/models';

const setup:Setup={name:'Equipment installation test',grain:'wheat',density:769,target:0,width:120,depth:100,preferredSilo:'flat',facility:'inland',language:'tr',currency:'USD'};
const visible=(o:T.Object3D):boolean=>o.visible&&(!o.parent||visible(o.parent));
function shown(root:T.Object3D,name:string){const matches:T.Object3D[]=[];root.traverse(o=>{if(o.name!==name||!visible(o))return;let parent=o.parent;while(parent){if(parent.name===name)return;parent=parent.parent}matches.push(o)});return matches}
function boundsMatch(actual:T.Box3,expected:T.Box3){assert.ok(actual.min.distanceTo(expected.min)<.0001,`${actual.min.toArray()} != ${expected.min.toArray()}`);assert.ok(actual.max.distanceTo(expected.max)<.0001,`${actual.max.toArray()} != ${expected.max.toArray()}`)}

for(const kind of EQUIPMENT_KINDS){
 test(`${kind}: placement starts a persisted, ordered installation instead of a finished item`,()=>{
  const original=createProject(setup),item=createItem(kind,6,-4),p=instantiateEquipment(original,item),c=p.construction!,job=c.equipmentJobs![0];
  assert.equal(original.items.length,0);assert.deepEqual(p.items,[item]);assert.deepEqual(job,{id:item.id,kind,mode:'install'});
  assert.equal(buildBusy(p),true);assert.equal(constructionStage(c,item.id).stage,'queued');
  let at=baseBuildSeconds(c);
  for(const phase of equipmentPhases(job)){const state=constructionStage(c,item.id,at+phase.seconds/2);assert.equal(state.stage,phase.stage);assert.equal(state.progress,.5);at+=phase.seconds}
  assert.equal(at,totalBuildSeconds(c));assert.equal(constructionStage(c,item.id,at).stage,'complete');
  const saved={...p,construction:{...advanceConstruction({...c,speed:4},2.5),paused:true}};
  assert.deepEqual(parseProject(JSON.parse(JSON.stringify(saved))),saved);
  assert.equal(advanceConstruction(saved.construction,100).elapsed,10);
  assert.equal(buildBusy({...p,construction:advanceConstruction(c,1000)}),false);
 });

 test(`${kind}: crane assembly lands every module on its exact final geometry`,()=>{
  const item={...createItem(kind,6,-4),rotation:37},p=instantiateEquipment(createProject(setup),item),job=p.construction!.equipmentJobs![0],rig=equipmentRig(p,item,job),finished=manualItem(item);
  assert.ok(rig.units.length>0);assert.ok(equipmentLaydown(p,item));let craneSeen=false;
  rig.update('queued',0,0);assert.ok(rig.units.every(u=>!u.root.visible));
  for(const phase of equipmentPhases(job))for(const progress of [0,.1,.35,.55,.8,.999]){
   rig.update(phase.stage,progress,progress*10);rig.root.updateMatrixWorld(true);
   craneSeen ||= shown(rig.root,'Equipment installation crane').length>0;
   rig.root.traverse(o=>{assert.ok(o.matrixWorld.elements.every(Number.isFinite));if(o instanceof T.Mesh){const a=o.geometry.getAttribute('position');for(let n=0;n<a.count;n++)assert.ok(Number.isFinite(a.getX(n)+a.getY(n)+a.getZ(n)))}});
  }
  assert.ok(craneSeen,'a crane must actually lift the equipment');
  rig.update('commissioning',.5,100);rig.root.updateMatrixWorld(true);
  const bounds=new T.Box3();for(const unit of rig.units){assert.ok(unit.root.visible);assert.ok(unit.root.children.every(o=>o.visible));assert.ok(unit.root.position.distanceTo(unit.target)<1e-8);assert.ok(unit.root.quaternion.angleTo(new T.Quaternion())<1e-8);bounds.union(new T.Box3().setFromObject(unit.root))}
  boundsMatch(bounds,new T.Box3().setFromObject(finished,true));
  rig.update('complete',1,101);assert.equal(shown(rig.root,'Equipment installation crane').length,0);
  // Reopening a paused project uses the saved phase directly, without a replay.
  const phases=equipmentPhases(job),phase=phases.find(p=>['moduleLifting','panelAssembly'].includes(p.stage))!,restored=equipmentRig(p,item,job);
  rig.update(phase.stage,.58,42);restored.update(phase.stage,.58,42);
  rig.units.forEach((u,n)=>{assert.equal(u.root.visible,restored.units[n].root.visible);assert.ok(u.root.position.distanceTo(restored.units[n].root.position)<1e-8)});
  disposeModel(rig.root);disposeModel(restored.root);disposeModel(finished);
 });
}

test('a moving module clears existing roofs before crossing the site and fits a rotated laydown orientation',()=>{
 const item=createItem('elevator'),p=instantiateEquipment(createProject(setup),item),rig=equipmentRig(p,item,p.construction!.equipmentJobs![0]);
 const unit={...rig.units[0],flat:true,size:new T.Vector3(2,12,3),target:new T.Vector3(4,18,9)},bay={x:-18,z:-22,rotation:90};
 const ground=modulePose(unit,bay,0,32);assert.equal(ground.yaw,Math.PI/2);assert.equal(ground.angle,Math.PI/2);assert.equal(ground.position.y,1.85);
 for(let q=.35;q<=.78;q+=.01){const pose=modulePose(unit,bay,q,32);assert.equal(pose.angle,0);assert.equal(pose.yaw,0);assert.ok(pose.position.y-unit.size.y/2>32)}
 const end=modulePose(unit,bay,1,32);assert.ok(end.position.distanceTo(unit.target)<1e-8);assert.equal(end.angle,0);assert.equal(end.yaw,0);disposeModel(rig.root);
});

test('the conveyor assembled on the ground stays assembled when its crane lift starts',()=>{
 const i=createItem('conveyor'),p=instantiateEquipment(createProject(setup),i),rig=equipmentRig(p,i,p.construction!.equipmentJobs![0]);
 rig.update('frameAssembly',1,8);const ground=rig.units[0].root.position.clone();assert.ok(rig.units[0].root.children.every(o=>o.visible));
 rig.update('moduleLifting',0,9);assert.ok(rig.units[0].root.children.every(o=>o.visible));assert.ok(rig.units[0].root.position.distanceTo(ground)<1e-8);assert.equal(shown(rig.root,'Equipment installation crane').length,1);disposeModel(rig.root);
});

test('busy, colliding and cramped installations fail without changing saved items',()=>{
 const p=instantiateEquipment(createProject(setup),createItem('building'));
 assert.throws(()=>instantiateEquipment(p,createItem('cleaner',35,0)),/buildingBusy/);
 const done={...p,construction:advanceConstruction(p.construction!,1000)};
 assert.throws(()=>instantiateEquipment(done,createItem('elevator')),/overlap/);
 assert.throws(()=>instantiateEquipment(createProject({...setup,width:20,depth:20}),createItem('elevator')),/assemblySpace/);
 assert.throws(()=>instantiateEquipment(done,done.items[0]),/invalid/);
 assert.throws(()=>instantiateEquipment(createProject(setup),createItem('flat')),/invalid/);
 assert.equal(done.items.length,1);
});

test('queued equipment is hidden, completed equipment appears once, and replay preserves layout',()=>{
 const i=createItem('elevator'),p=instantiateEquipment(createProject(setup),i),visuals=constructionVisuals(p,'');
 for(const time of [0,4,10,20]){visuals.update(time);assert.equal(shown(visuals.root,'elevator').length,0)}
 visuals.update(totalBuildSeconds(p.construction!));assert.equal(shown(visuals.root,'elevator').length,1);assert.equal(shown(visuals.root,'Equipment installation crane').length,0);
 const legacy={...p,construction:undefined};assert.equal(buildBusy(legacy),false);const replay=replayEquipment(legacy,i.id);assert.deepEqual(replay.items,legacy.items);assert.equal(replay.construction!.elapsed,0);assert.equal(buildBusy(replay),true);disposeModel(visuals.root);
});

test('elevator access is constructed separately while the existing elevator and closed walkways remain visible',()=>{
 let p=instantiateBatch(createProject({...setup,width:100,depth:100}),createItem('flat'),{count:9,columns:3});
 p=instantiateWalkways({...p,construction:advanceConstruction(p.construction!,10000)});p={...p,construction:advanceConstruction(p.construction!,10000),items:[...p.items,createItem('elevator',23,7)]};
 const elevator=p.items.at(-1)!,next=instantiateAccess(p,elevator.id),job=next.construction!.equipmentJobs![0];
 assert.equal(job.mode,'access');assert.equal(next.items.length,p.items.length);assert.equal(next.items.at(-1)!.access!.walkwayIds.length,2);assert.deepEqual([next.items.at(-1)!.x,next.items.at(-1)!.z,next.items.at(-1)!.height],[23,7,24]);
 assert.deepEqual(parseProject(JSON.parse(JSON.stringify(next))),next);
 const visuals=constructionVisuals(next,'');visuals.update(0);assert.equal(shown(visuals.root,'elevator').length,1);assert.equal(shown(visuals.root,'Elevator catwalk connections').length,0);assert.ok(shown(visuals.root,'Catwalk end closure').length>0);
 visuals.update(totalBuildSeconds(next.construction!));assert.equal(shown(visuals.root,'elevator').length,1);assert.equal(shown(visuals.root,'Elevator catwalk connections').length,1);assert.equal(shown(visuals.root,'Equipment installation crane').length,0);disposeModel(visuals.root);
});

test('equipment jobs validate item references and run sequentially when a saved timeline contains several',()=>{
 const a=createItem('elevator',-20,0),b=createItem('cleaner',20,0),p=instantiateEquipment(createProject(setup),a),first=p.construction!.equipmentJobs![0],second={id:b.id,kind:'cleaner' as const,mode:'install' as const},c={...p.construction!,equipmentJobs:[first,second]},both={...p,items:[a,b],construction:c};
 assert.deepEqual(parseProject(JSON.parse(JSON.stringify(both))),both);
 const secondStart=baseBuildSeconds(c)+equipmentDuration(first);assert.equal(constructionStage(c,b.id,secondStart-.1).stage,'queued');assert.equal(constructionStage(c,a.id,secondStart).stage,'complete');assert.equal(constructionStage(c,b.id,secondStart).stage,'sitePreparation');
 for(const jobs of [[{...first,id:'missing'}],[{...first,kind:'dryer'}],[{...first,mode:'access'}],[first,first],[null]])assert.throws(()=>parseProject({...p,construction:{...c,equipmentJobs:jobs}}));
 assert.throws(()=>parseProject({...p,construction:{...c,timeline:undefined}}));
});

test('an intake pit cuts the terrain and the grid at its rotated footprint',()=>{
 const i={...createItem('intake'),rotation:35},p=instantiateEquipment(createProject(setup),i),points=siteGridPoints(p),a=-i.rotation*Math.PI/180;
 for(let n=0;n<points.length;n+=2)for(let q=0;q<=1;q+=.025){const v=points[n].clone().lerp(points[n+1],q),x=v.x*Math.cos(a)+v.z*Math.sin(a),z=-v.x*Math.sin(a)+v.z*Math.cos(a);assert.ok(Math.abs(x)>=i.width/2-.01||Math.abs(z)>=i.depth/2-.01)}
 const ground=environment(p);ground.updateMatrixWorld(true);const ray=new T.Raycaster(new T.Vector3(i.x,1,i.z),new T.Vector3(0,-1,0),0,1.6);assert.equal(ray.intersectObject(ground,true).length,0);disposeModel(ground);
});

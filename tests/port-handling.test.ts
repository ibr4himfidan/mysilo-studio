import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {readFileSync,existsSync} from 'node:fs';
import {createProject,createItem,parseProject,itemIssue,itemFootprint,validItem,itemTop,type Item,type Setup} from '../lib/editor';
import {modelDefaults,handlingIds,HANDLING_MODELS} from '../lib/handling-catalog';
import {equipmentLaydown,instantiateEquipment} from '../lib/equipment-installation';
import {equipmentRig} from '../lib/equipment-rig';
import {manualItem,manualFacility} from '../lib/manual-models';
import {DEFAULT_PORT,DEFAULT_DESIGN,portFrame,fromCoast,toCoast,workingGround,shoreBounds} from '../lib/site-context';
import {roofSnowForce,missingDesignInputs,loaderTip,reachesVessel} from '../lib/design-review';
import {disposeModel} from '../lib/models';
import {createAsset} from '../lib/asset-model';
const setup:Setup={name:'Port model test',grain:'wheat',density:769,target:0,width:140,depth:120,preferredSilo:'flat',facility:'inland',language:'tr',currency:'USD'};

test('conveyors assemble at the clicked coordinates in each quadrant, including near ground level',()=>{
 for(const [x,z] of [[0,0],[-35,-25],[35,-25],[-35,25],[35,25]])for(const model of ['belt-k','belt-v','chain-c','mobile-belt'] as const){
  const p=createProject(setup),i={...createItem('conveyor',x,z),...modelDefaults(model)},next=instantiateEquipment(p,i),bay=equipmentLaydown(next,i)!;
  assert.ok(bay,model);assert.ok(Math.hypot(bay.x-x,bay.z-z)<1e-8,`${model} moved from ${x},${z} to ${bay.x},${bay.z}`);assert.equal(next.items[0].x,x);assert.equal(next.items[0].z,z);
  const rig=equipmentRig(next,i,next.construction!.equipmentJobs![0]);rig.update('frameAssembly',.9,6);assert.ok(rig.units.every(u=>Math.abs(u.root.position.x-x)<1e-8&&Math.abs(u.root.position.z-z)<1e-8));disposeModel(rig.root);
 }
});

test('all 16 manufacturer variants have local source images, persistent identities and distinct finite geometry',()=>{
 const manifest=JSON.parse(readFileSync('public/mysilo/handling/sources.json','utf8'));
 assert.equal(handlingIds.length,16);const counts=new Set<number>();
 for(const model of handlingIds){const spec=HANDLING_MODELS[model],i={...createItem(spec.kind),...modelDefaults(model)},p={...createProject(setup),items:[i]};assert.ok(validItem(i));assert.deepEqual(parseProject(JSON.parse(JSON.stringify(p))),p);
  const asset=manifest.find((m:{id:string})=>m.id===model);assert.ok(asset);assert.equal(asset.file,'handling/'+spec.image);assert.ok(existsSync('public/mysilo/'+asset.file));assert.equal(asset.source,spec.source);
  const g=manualItem(i);g.updateMatrixWorld(true);let vertices=0;g.traverse(o=>{assert.ok(o.matrixWorld.elements.every(Number.isFinite));if(o instanceof T.Mesh){const a=o.geometry.getAttribute('position');vertices+=a.count;for(let n=0;n<a.count;n++)assert.ok(Number.isFinite(a.getX(n)+a.getY(n)+a.getZ(n)))}});counts.add(vertices);
  const box=new T.Box3().setFromObject(g,true);assert.ok(box.max.y<=itemTop(i)+.001,`${model} height`);assert.ok(box.min.y>=-.001,`${model} below ground`);
  const rig=equipmentRig(p,i,{id:i.id,kind:i.kind,mode:'install'});rig.update('commissioning',.5,50);const finished=new T.Box3();rig.units.forEach(u=>finished.union(new T.Box3().setFromObject(u.root,true)));assert.ok(finished.min.distanceTo(box.min)<.001&&finished.max.distanceTo(box.max)<.001,`${model} assembly endpoint`);disposeModel(rig.root);disposeModel(g);
  const preview=createAsset('handling:'+model);assert.ok(new T.Box3().setFromObject(preview,true).min.y>=-.001);disposeModel(preview);
 }
 assert.ok(counts.size>=10,'the variants must not all reuse one undifferentiated geometry');
});

test('conveyor rise and model validation reject incompatible imports',()=>{
 const i={...createItem('conveyor'),...modelDefaults('chain-s')};assert.equal(itemTop(i),i.y+i.height+5);
 for(const input of [{...i,model:'invented'},{...i,model:'shiploader'},{...i,rise:-1},{...i,rise:Infinity},{...createItem('flat'),rise:2},{...createItem('flat'),model:'belt-k'}])assert.equal(validItem(input as Item),false);
});

for(const edge of ['south','north','east','west'] as const)test(`${edge}: quay bounds, vessel hatches and loader reach use the same coastal coordinates`,()=>{
 const p={...createProject({...setup,facility:'port'}),port:{...DEFAULT_PORT,edge}},f=portFrame(p),point=fromCoast(p,{x:10,z:f.depth/2+7}),local=toCoast(p,point);assert.ok(Math.abs(local.x-10)<1e-8&&Math.abs(local.z-f.depth/2-7)<1e-8);
 const i={...createItem('shiploader',point.x,point.z),...modelDefaults('shiploader'),rotation:f.angle*180/Math.PI-90};assert.equal(itemIssue(p,i),null);
 const inside=fromCoast(p,{x:10,z:0});assert.equal(itemIssue(p,{...i,...inside}),'quayOnly');
 const sea=fromCoast(p,{x:10,z:f.quayEnd+5});assert.equal(itemIssue(p,{...i,...sea}),'outside');assert.equal(itemIssue(p,{...createItem('flat'),...point}),'outside');
 const conveyor={...createItem('conveyor'),...modelDefaults('belt-v'),...point,rotation:f.angle*180/Math.PI};assert.equal(itemIssue(p,conveyor),null);
 const usable=f.shipLength-f.shipBeam*1.5,cell=usable/f.hatches,hatchX=-f.shipLength/2+f.shipBeam*.8+1.5*cell,target=fromCoast(p,{x:hatchX,z:f.shipZ}),base=fromCoast(p,{x:hatchX,z:f.depth/2+7}),loader={...i,...base,width:f.shipZ-f.depth/2-7};assert.equal(reachesVessel(p,loader),true);assert.ok(Math.hypot(loaderTip(loader).x-target.x,loaderTip(loader).z-target.z)<1e-8);assert.equal(reachesVessel(p,{...loader,rotation:loader.rotation+180}),false);
 const ground=workingGround(p),bounds=shoreBounds(p);assert.equal(ground.width*ground.depth,p.width*p.depth+f.width*f.quayDepth);assert.ok(target.x>=bounds.minX&&target.x<=bounds.maxX&&target.z>=bounds.minZ&&target.z<=bounds.maxZ);
 const next=instantiateEquipment(p,loader),rig=equipmentRig(next,loader,next.construction!.equipmentJobs![0]);rig.update('commissioning',.5,50);const geometry=new T.Box3();rig.units.forEach(u=>geometry.union(new T.Box3().setFromObject(u.root,true)));const finished=manualItem(loader),end=new T.Box3().setFromObject(finished,true);assert.ok(geometry.min.distanceTo(end.min)<.001&&geometry.max.distanceTo(end.max)<.001);disposeModel(rig.root);disposeModel(finished);
});

test('sea extends beyond the viewing area and completed port exports retain coastal settings',()=>{
 const p={...createProject({...setup,facility:'port'}),port:{...DEFAULT_PORT,edge:'east' as const,quayDepth:20,shipLength:180}},scene=manualFacility(p),sea=scene.getObjectByName('Continuous sea') as T.Mesh;
 assert.ok(sea);assert.ok((sea.geometry as T.PlaneGeometry).parameters.width>=100000);assert.ok(scene.getObjectByName('Bulk carrier with open hatches'));assert.ok(scene.getObjectByName('Usable quay'));assert.ok(new T.Box3().setFromObject(scene.getObjectByName('Coastal backland')!,true).max.y < -1.5,'backland must not fill foundation excavations');assert.deepEqual(scene.userData.project.port,p.port);disposeModel(scene);
});

test('invalid ship proportions are rejected and shortening a boom does not shrink its foundation footprint',()=>{
 const p=createProject({...setup,facility:'port'});assert.throws(()=>parseProject({...p,port:{...DEFAULT_PORT,shipLength:30,shipBeam:60}}));assert.throws(()=>parseProject({...p,port:{...DEFAULT_PORT,shipLength:30,shipBeam:8,hatches:10}}));
 for(const model of ['shiploader','mobile-telescopic'] as const){const i={...createItem('shiploader'),...modelDefaults(model)},base=itemFootprint(i),short=itemFootprint({...i,width:1});assert.equal(short.width,base.width);assert.equal(short.depth,base.depth)}
});

test('unknown climate inputs remain unknown and user-supplied roof snow uses projected area',()=>{
 const p=createProject(setup);assert.equal(roofSnowForce(p),null);assert.equal(missingDesignInputs(p).length,7);
 const next={...p,items:[{...createItem('flat'),width:10,depth:10},createItem('square')],design:{...DEFAULT_DESIGN,location:'Aksaray',standard:'Project-specific design basis',snowLoad:1.2,windSpeed:30,seismicPga:.2,soilBearing:150,corrosion:'C3' as const,throughput:600}};
 assert.ok(Math.abs(roofSnowForce(next)!-1.2*(Math.PI*25+64))<1e-8);assert.equal(missingDesignInputs(next).length,0);assert.deepEqual(parseProject(JSON.parse(JSON.stringify(next))),next);
 for(const field of ['snowLoad','windSpeed','seismicPga','soilBearing','throughput'])assert.throws(()=>parseProject({...next,design:{...next.design,[field]:-1}}));
 assert.throws(()=>parseProject({...next,port:{...DEFAULT_PORT,quayDepth:0}}));assert.equal(roofSnowForce({...next,design:{...next.design,snowLoad:0}}),0);
});

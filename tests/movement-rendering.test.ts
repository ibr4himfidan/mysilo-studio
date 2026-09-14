import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {createProject,createItem,KINDS,itemIssue,itemBottom,parseProject,type Setup} from '../lib/editor';
import {instantiateBatch,instantiateWalkways,totalBuildSeconds} from '../lib/installation';
import {connectElevator,accessIssue} from '../lib/access-network';
import {movementIds,movementPreview,moveItems} from '../lib/movement';
import {manualItem} from '../lib/manual-models';
import {compactStatic} from '../lib/render-batching';
import {constructionVisuals} from '../lib/construction-models';
import {disposeModel} from '../lib/models';
import {BuildStatus} from '../components/installation-controls';
const setup:Setup={name:'Movement test',grain:'wheat',density:769,target:0,width:140,depth:140,preferredSilo:'flat',facility:'inland',language:'tr',currency:'USD'};
function connected(){let p=instantiateBatch(createProject(setup),createItem('flat'),{count:9,columns:3});p=instantiateWalkways({...p,construction:undefined});p={...p,construction:undefined,items:[...p.items,createItem('elevator',23,7),createItem('cleaner',48,-40)]};return{...p,items:connectElevator(p,p.items.at(-2)!.id)}}

test('every object type can be moved after installation without rebuilding or changing dimensions',()=>{
 for(const kind of KINDS){const item=createItem(kind),p={...createProject(setup),items:[item]},items=moveItems(p,item.id,12,-7);assert.deepEqual(items[0],{...item,x:12,z:-7});assert.deepEqual(p.items,[item]);assert.equal(itemIssue({...p,items},items[0]),null);assert.deepEqual(parseProject(JSON.parse(JSON.stringify({...p,items}))).items,items)}
});
test('moving a silo, anchored walkway or connected elevator translates the same complete assembly',()=>{
 const p=connected(),original=JSON.stringify(p);for(const kind of ['flat','walkway','elevator']){const selected=p.items.find(i=>i.kind===kind)!,ids=movementIds(p,selected.id);assert.equal(ids.size,14);const items=moveItems(p,selected.id,selected.x+7,selected.z-5);for(const i of items){const before=p.items.find(v=>v.id===i.id)!;assert.deepEqual(i,ids.has(i.id)?{...before,x:before.x+7,z:before.z-5}:before)}assert.equal(accessIssue({...p,items}),null)}assert.equal(JSON.stringify(p),original);
});
test('the whole facility moves by one offset; rejected previews never mutate the project',()=>{
 const p=connected(),selected=p.items.at(-1)!,before=JSON.stringify(p),items=moveItems(p,selected.id,selected.x-4,selected.z+3,'facility');assert.equal(movementIds(p,selected.id,'facility').size,p.items.length);items.forEach((i,n)=>assert.deepEqual(i,{...p.items[n],x:p.items[n].x-4,z:p.items[n].z+3}));
 assert.equal(movementPreview(p,selected.id,200,0,'facility').issue,'outside');assert.throws(()=>moveItems(p,selected.id,200,0,'facility'),/outside/);assert.equal(JSON.stringify(p),before);
 const silo=p.items[0];assert.equal(movementPreview(p,selected.id,silo.x,silo.z).issue,'overlap');assert.equal(movementPreview(p,selected.id,NaN,0).issue,'invalid');assert.equal(movementPreview(p,'missing',0,0).issue,'invalid');
 const active=instantiateBatch(createProject(setup),createItem('flat'),{count:1,columns:1});assert.throws(()=>moveItems(active,active.items[0].id,3,0),/buildingBusy/);
});
test('silo status never shows a completed checkmark while queued, installing or paused',()=>{
 const p=instantiateBatch(createProject(setup),createItem('flat'),{count:2,columns:2});const html=(elapsed:number,paused=false)=>renderToStaticMarkup(createElement(BuildStatus,{project:{...p,construction:{...p.construction!,elapsed,paused}},id:p.items[0].id}));
 assert.match(html(0),/data-state="queued"/);assert.match(html(3),/data-state="working"/);assert.match(html(3,true),/data-state="queued"/);assert.doesNotMatch(html(3),/circle-check/);assert.match(html(totalBuildSeconds(p.construction!)),/data-state="done"/);
});
function statistics(root:T.Object3D){let meshes=0,triangles=0;root.traverseVisible(o=>{if(o instanceof T.Mesh){meshes++;triangles+=(o.geometry.index?.count||o.geometry.getAttribute('position').count)/3*(o instanceof T.InstancedMesh?o.count:1)}});return{meshes,triangles}}
test('static batching preserves world bounds, triangles, selection identity and existing instances',()=>{
 const i={...createItem('flat',13,-8),rotation:37},model=manualItem(i),before=new T.Box3().setFromObject(model,true),old=statistics(model);compactStatic(model);const after=new T.Box3().setFromObject(model,true),now=statistics(model);assert.ok(before.min.distanceTo(after.min)<.0001&&before.max.distanceTo(after.max)<.0001);assert.equal(now.triangles,old.triangles);assert.ok(now.meshes<old.meshes*.1);assert.equal(model.userData.id,i.id);let instances=0;model.traverse(o=>{if(o instanceof T.InstancedMesh)instances++});assert.ok(instances>0);disposeModel(model);
});
test('completed nine-silo scene stays below 500 visible meshes without dropping geometry',()=>{
 const p=instantiateBatch(createProject(setup),createItem('flat'),{count:9,columns:3}),v=constructionVisuals(p,'');v.update(totalBuildSeconds(p.construction!));assert.ok(statistics(v.root).meshes<500);assert.ok(statistics(v.root).triangles>130000);disposeModel(v.root);
});
test('Mysilo site models expose their defining details and the intake grate sits at ground level',()=>{
 for(const [kind,detail] of [['cleaner','Aspiration head and inlet'],['dryer','Triangular air duct'],['intake','Receiving grate'],['tower','Stair flight'],['building','Mysilo 7 receiving building']] as const){const i=createItem(kind),model=manualItem(i);assert.ok(model.getObjectByName(detail),kind);if(kind==='intake'){const b=new T.Box3().setFromObject(model,true);assert.ok(Math.abs(b.max.y-.12)<1e-6);assert.ok(Math.abs(b.min.y-itemBottom(i))<1e-6)}disposeModel(model)}
});

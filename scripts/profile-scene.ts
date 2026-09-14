import {performance} from 'node:perf_hooks';
import * as T from 'three';
import {createProject,createItem} from '../lib/editor';
import {instantiateBatch,totalBuildSeconds} from '../lib/installation';
import {constructionVisuals} from '../lib/construction-models';
import {disposeModel} from '../lib/models';
const p=instantiateBatch(createProject({name:'Performance fixture',facility:'inland',width:140,depth:140,language:'tr',currency:'USD',grain:'wheat',density:769,target:0,preferredSilo:'flat'}),createItem('flat'),{count:9,columns:3});
const start=performance.now(),scene=constructionVisuals(p,''),buildMs=performance.now()-start,total=totalBuildSeconds(p.construction!);const samples=[];
for(const fraction of [0,.45,.75,1]){const elapsed=total*fraction;scene.update(elapsed);let visibleMeshes=0,triangles=0;scene.root.traverseVisible(o=>{if(o instanceof T.Mesh){visibleMeshes++;triangles+=(o.geometry.index?.count||o.geometry.getAttribute('position').count)/3}});const at=performance.now();for(let n=0;n<300;n++){scene.update(elapsed+n*.001);scene.root.updateMatrixWorld(true)}samples.push({fraction,visibleMeshes,triangles,updateMs:(performance.now()-at)/300})}
console.log(JSON.stringify({fixture:'9 silos, 140m × 140m, CPU model/update; no GPU/FPS measurement',buildMs,samples},null,2));disposeModel(scene.root);

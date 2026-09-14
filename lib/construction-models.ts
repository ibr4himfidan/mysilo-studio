import {equipmentRig} from './equipment-rig';
import {compactStatic} from './render-batching';
import {equipmentBase} from './equipment-base';
import {elevatorAccessDecks} from './access-network';
import * as T from 'three';
import {manualItem,walkwaySupports,foundationPads,accessModels} from './manual-models';
import {constructionStage,type BuildStage} from './installation';
import {siteSettings,isSilo,type Item,type Project} from './editor';
import {roofDetails,roofPanelCount} from './roof-details';
import {foundationModel} from './foundation-models';
import {walkwayRig} from './walkway-rig';
import {excavator,concreteMixer,worker} from './site-actors';
const material=(color:number)=>new T.MeshStandardMaterial({color,roughness:.65,metalness:color===0xb7c4c9?.55:.1});
function box(g:T.Object3D,w:number,h:number,d:number,x:number,y:number,z:number,color=0x46545b){const m=new T.Mesh(new T.BoxGeometry(w,h,d),material(color));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;g.add(m);return m}
function cylinder(g:T.Object3D,r:number,h:number,x:number,y:number,z:number,color=0xb7c4c9){const m=new T.Mesh(new T.CylinderGeometry(r,r,h,48),material(color));m.position.set(x,y,z);m.castShadow=true;g.add(m);return m}
function foundationRig(i:Item,apron:number){
 const g=new T.Group(),r=i.width/2+apron,round=i.kind!=='square';g.position.set(i.x,0,i.z);g.name='Foundation excavation '+i.id;
 const pit=round?new T.Mesh(new T.CylinderGeometry(r,r,.65,48,1,true),new T.MeshStandardMaterial({color:0x806344,side:T.DoubleSide})):new T.Mesh(new T.BoxGeometry(i.width+2*apron,.65,i.depth+2*apron),material(0x806344));pit.position.y=-.35;g.add(pit);
 const floor=round?cylinder(g,r,.03,0,-.66,0,0x5d4935):box(g,i.width+2*apron,.03,i.depth+2*apron,0,-.66,0,0x5d4935);
 const cover=round?new T.Mesh(new T.CircleGeometry(r,64),material(0xe0e4e5)):new T.Mesh(new T.PlaneGeometry(i.width+2*apron,i.depth+2*apron),material(0xe0e4e5));cover.rotation.x=-Math.PI/2;cover.position.y=-.065;g.add(cover);
 const edge=round?new T.Mesh(new T.TorusGeometry(r,.035,5,64),material(0xc69e53)):new T.LineSegments(new T.EdgesGeometry(new T.BoxGeometry(i.width+2*apron,.02,i.depth+2*apron)),new T.LineBasicMaterial({color:0xc69e53}));if(round)edge.rotation.x=Math.PI/2;edge.position.y=-.035;g.add(edge);
 const pad=foundationModel(i,apron),slab=pad.root;g.add(slab);slab.visible=false;
 const rebar=new T.Group();for(let x=-r+.8;x<r;x+=.8){const length=round?2*Math.sqrt(Math.max(0,r*r-x*x)):i.depth;box(rebar,.035,.035,length,x,-.15,0,0x696a5e);box(rebar,length,.035,.035,0,-.12,x,0x696a5e)}compactStatic(rebar);g.add(rebar);rebar.visible=false;
 let last=-1;return{root:g,update:(stage:BuildStage,progress:number)=>{const dug=stage!=='queued',p=stage==='excavating'?progress:dug?1:0;cover.visible=p<1;const step=Math.floor(p*30);if(step!==last&&round){cover.geometry.dispose();cover.geometry=new T.CircleGeometry(r,64,Math.PI*2*p,Math.max(.001,Math.PI*2*(1-p)));last=step}else if(!round)cover.scale.set(1,Math.max(.001,1-p),1);pit.visible=dug;floor.visible=dug;edge.visible=stage==='queued';const poured=!['queued','excavating'].includes(stage);slab.visible=poured;slab.scale.y=stage==='foundation'?Math.max(.01,Math.min(1,(progress-.2)/.65)):1;slab.position.y=-.12*(1-slab.scale.y);pad.install(stage==='aeration'?progress:['queued','excavating','foundation'].includes(stage)?0:1);rebar.visible=stage==='foundation'&&progress<.65}};
}
function shellRig(i:Item){
 const root=new T.Group();root.position.set(i.x,0,i.z);const r=i.width/2,round=i.kind!=='square',temporary=i.kind==='temporary',rings=Math.max(2,Math.ceil(i.height/1.2)),ringH=i.height/rings,base=.4;
 const roof=new T.Group();root.add(roof);const roofH=temporary?r*.3:round?r*Math.tan(28*Math.PI/180):.2;const roofPanels:T.Mesh[]=[];
 for(let n=0;n<12;n++){const geo=round?new T.ConeGeometry(r+.12,roofH,5,1,false,n*Math.PI/6,Math.PI/6):new T.BoxGeometry(i.width/12,.2,i.depth);const panel=new T.Mesh(geo,material(0xb7c4c9));if(round)panel.position.y=roofH/2;else panel.position.x=-i.width/2+(n+.5)*i.width/12;panel.castShadow=true;roof.add(panel);roofPanels.push(panel)}
 const details=round&&!temporary?roofDetails(r,roofH):null;if(details){compactStatic(details.accessories);roof.add(details.root);}
 const wall=new T.Group();root.add(wall);const ringMeshes:T.Group[]=[];
 for(let row=0;row<rings;row++){const ring=new T.Group();const geom=round?new T.CylinderGeometry(r,r,ringH,48,1,true):new T.BoxGeometry(i.width,ringH,i.depth);const mesh=new T.Mesh(geom,new T.MeshStandardMaterial({color:0xb7c4c9,metalness:.5,roughness:.45,side:T.DoubleSide}));mesh.position.y=ringH/2;mesh.castShadow=true;ring.add(mesh);if(round)for(let k=0;k<5;k++){const corr=new T.Mesh(new T.TorusGeometry(r+.025,.025,3,48),material(0x768890));corr.rotation.x=Math.PI/2;corr.position.y=k*ringH/5;ring.add(corr)}if(round&&!temporary)for(let n=0;n<roofPanelCount(r);n++){const a=n*Math.PI*2/roofPanelCount(r),stiffener=box(ring,.12,ringH,.07,Math.sin(a)*(r+.045),ringH/2,Math.cos(a)*(r+.045),0x53636a);stiffener.rotation.y=a}compactStatic(ring);wall.add(ring);ringMeshes.push(ring)}
 const freshRing=new T.Group();freshRing.position.y=base;root.add(freshRing);const freshPanels:T.Mesh[]=[];
 for(let n=0;n<12;n++){const geo=round?new T.CylinderGeometry(r,r,ringH,5,1,true,n*Math.PI/6,Math.PI/6):new T.BoxGeometry(i.width/12,ringH,i.depth);const panel=new T.Mesh(geo,new T.MeshStandardMaterial({color:0xcdd7db,metalness:.55,roughness:.4,side:T.DoubleSide}));panel.position.y=ringH/2;if(!round)panel.position.x=-i.width/2+(n+.5)*i.width/12;freshRing.add(panel);freshPanels.push(panel)}
 const chains:T.Group[]=[];
 const jacks=new T.Group();root.add(jacks);const rods:T.Mesh[]=[];
 if(!temporary&&round)for(let n=0;n<6;n++){const a=n*Math.PI/3,x=Math.sin(a)*(r+.65),z=Math.cos(a)*(r+.65);box(jacks,.6,.16,.7,x,.1,z,0x485960);cylinder(jacks,.12,2.8,x,1.5,z,0xc00031);const rod=cylinder(jacks,.045,1,x,1,z,0x303c45);rods.push(rod);box(jacks,.45,.35,.38,x,2.7,z,0xc00031);const chain=new T.Group();chain.name='Chain hoist';chain.position.set(x,2.5,z);for(let link=0;link<15;link++){const mesh=new T.Mesh(new T.TorusGeometry(.06,.014,4,8),material(0x29373e));mesh.position.y=-link/15;if(link%2)mesh.rotation.y=Math.PI/2;chain.add(mesh)}jacks.add(chain);chains.push(chain)}
 return{root,update:(stage:BuildStage,progress:number)=>{root.visible=['roofAssembly','jackLifting','finishing'].includes(stage);if(!root.visible)return;
 const q=stage==='roofAssembly'?0:stage==='finishing'?1:progress,steps=q*(rings-1),built=1+Math.floor(steps),fraction=steps%1,lift=Math.min(1,fraction/.6)*ringH;
 const height=stage==='roofAssembly'?ringH:Math.min(i.height,built*ringH+lift);roof.position.y=base+height;roofPanels.forEach((panel,n)=>panel.visible=stage!=='roofAssembly'||n<Math.ceil(progress*12));
 if(details){details.seams.children.forEach((seam,n)=>seam.visible=stage!=='roofAssembly'||n<Math.ceil(progress*details.seams.children.length));details.accessories.visible=stage==='finishing'}
 freshRing.visible=stage==='jackLifting'&&built<rings;freshPanels.forEach((panel,n)=>panel.visible=fraction>.6&&n<Math.ceil((fraction-.6)/.4*12));
 ringMeshes.forEach((ring,n)=>{ring.visible=n<built;ring.position.y=base+height-(n+1)*ringH});
 jacks.visible=stage==='jackLifting';chains.forEach(chain=>chain.scale.y=1.6-lift*.8);rods.forEach(rod=>{rod.scale.y=.8+lift;rod.position.y=1.3-lift*.3});if(stage==='finishing'&&['economic','commercial','feed'].includes(i.kind)){root.position.y=progress*(r+2.1)}else root.position.y=0;
 }};
}
export function constructionVisuals(p:Project,selected:string){
 const root=new T.Group(),network=[...p.items,...elevatorAccessDecks(p.items)],c=p.construction,rigs=p.items.filter(i=>c?.siloIds.includes(i.id)).map(i=>{const foundation=foundationRig(i,siteSettings(p).foundationApron),shell=shellRig(i),finished=compactStatic(manualItem(i,i.id===selected,network));root.add(foundation.root,shell.root,finished);return{i,foundation,shell,finished,lastStage:'' as string,lastProgress:-1}});
 const accessGroups=p.items.filter(i=>i.access).map(i=>{const model=accessModels({...p,items:p.items.map(other=>other.id===i.id?other:{...other,access:undefined})});compactStatic(model);root.add(model);return{i,model}});
 const activeAccess=(c?.equipmentJobs||[]).filter(j=>p.items.find(i=>i.id===j.id)?.access).map(j=>j.id),waitingItems=p.items.map(i=>activeAccess.includes(i.id)?{...i,access:undefined}:i),waitingNetwork=[...waitingItems,...elevatorAccessDecks(waitingItems)];
 root.add(compactStatic(foundationPads(p,p.items.filter(i=>isSilo(i)&&!c?.siloIds.includes(i.id)))));
 const extra=p.items.filter(i=>!c?.siloIds.includes(i.id)).map(i=>{const model=new T.Group();model.add(compactStatic(manualItem(i,i.id===selected,network)));if(!isSilo(i)&&i.kind!=='walkway')model.add(equipmentBase(i));const job=c?.equipmentJobs?.find(j=>j.id===i.id),build=job?equipmentRig(p,i,job):null,waiting=i.kind==='walkway'&&activeAccess.length?compactStatic(manualItem(i,i.id===selected,waitingNetwork)):null,rig=c?.timeline===2&&c.walkwayIds.includes(i.id)?walkwayRig(p,i):null;root.add(model);if(waiting)root.add(waiting);if(rig)root.add(rig.root);if(build)root.add(build.root);return{i,model,rig,job,build,waiting}});
 const machine=excavator(),mixer=concreteMixer(),crew=Array.from({length:4},worker);
 const supports=p.items.filter(i=>i.kind==='walkway').map(i=>{const model=walkwaySupports({...p,items:p.items.filter(other=>other.kind!=='walkway'||other.id===i.id)});compactStatic(model);root.add(model);return{i,model}});
 root.add(machine.root,mixer.root,...crew.map(w=>w.root));
 return{root,update:(elapsed:number)=>{let excavation:Item|undefined,work:Item|undefined,digProgress=0,workStage:BuildStage='queued',workProgress=0,walkWork:typeof extra[number]|undefined,walkStage:BuildStage='queued';
  for(const rig of rigs){const state=constructionStage(c,rig.i.id,elapsed);const unchanged=rig.lastStage===state.stage&&rig.lastProgress===state.progress;if(!unchanged){rig.foundation.update(state.stage,state.progress);rig.shell.update(state.stage,state.progress);rig.lastStage=state.stage;rig.lastProgress=state.progress}rig.finished.visible=state.stage==='complete';if(state.stage==='excavating'&&state.progress<1){excavation=rig.i;digProgress=state.progress}if(['foundation','aeration','roofAssembly','jackLifting','finishing'].includes(state.stage)&&state.progress<1){work=rig.i;workStage=state.stage;workProgress=state.progress}}
  machine.root.visible=!!excavation;if(excavation){const index=rigs.findIndex(r=>r.i.id===excavation.id),prev=rigs[Math.max(0,index-1)].i,travel=Math.min(1,digProgress*6),r=excavation.depth/2+siteSettings(p).foundationApron+1.5;machine.root.position.set(T.MathUtils.lerp(prev.x,excavation.x,travel),0,T.MathUtils.lerp(prev.z+prev.depth/2+siteSettings(p).foundationApron+1.5,excavation.z+r,travel));machine.root.rotation.y=0;machine.update(elapsed)}
  mixer.root.visible=workStage==='foundation'&&!!work;if(work&&mixer.root.visible){mixer.root.position.set(work.x,0,work.z+work.depth/2+siteSettings(p).foundationApron+1.5);mixer.root.rotation.y=0;mixer.update(elapsed,workProgress>.2&&workProgress<.85)}
  for(const {i,model} of accessGroups)model.visible=constructionStage(c,i.id,elapsed).stage==='complete';
  const accessPending=activeAccess.some(id=>constructionStage(c,id,elapsed).stage!=='complete');
  for(const entry of extra){const {i,model,rig,job,build,waiting}=entry,state=constructionStage(c,i.id,elapsed);model.visible=state.stage==='complete'||job?.mode==='access';if(waiting){waiting.visible=accessPending&&state.stage==='complete';if(waiting.visible)model.visible=false}build?.update(state.stage,state.progress,elapsed);if(rig){rig.update(state.stage,state.progress);if(state.stage!=='complete'&&state.stage!=='queued'){walkWork=entry;walkStage=state.stage}}else if(c?.timeline!==2&&state.stage==='walkwayAssembly')model.visible=state.progress>.15}
  for(const {i,model} of supports){const state=constructionStage(c,i.id,elapsed);model.visible=['walkwayRigging','walkwayLifting','walkwayFixing','complete'].includes(state.stage)}
  crew.forEach((w,n)=>{w.root.visible=!!work||!!walkWork;if(work){const a=n*Math.PI/2+.5,r=work.width/2+(workStage==='aeration'?-1.5:1);w.root.position.set(work.x+Math.sin(a)*r,workStage==='aeration'?.4:0,work.z+Math.cos(a)*r);w.root.rotation.y=a+Math.PI;w.update(elapsed+n)}else if(walkWork?.rig){const {i,rig}=walkWork,base=rig.base,a=(walkStage==='walkwayFixing'?i.rotation:base.rotation)*Math.PI/180;
   if(walkStage==='walkwayFixing'){const x=(n-1.5)*Math.min(i.width/5,2);w.root.position.set(i.x+x*Math.cos(a),i.y+.25,i.z-x*Math.sin(a))}
   else if(walkStage==='walkwayAssembly'||walkStage==='walkwayRigging'){const x=(n-1.5)*Math.min(i.width/5,2),z=(n%2?1:-1)*(i.depth/2+.8);w.root.position.set(base.x+x*Math.cos(a)+z*Math.sin(a),0,base.z-x*Math.sin(a)+z*Math.cos(a))}
   else {w.root.position.set(base.crane.x+(n-1.5)*.7,0,base.crane.z+4)}
   w.root.rotation.y=a+(n%2?Math.PI:0);w.update(walkStage==='walkwayLifting'?0:elapsed+n);
  }});
 }};
}

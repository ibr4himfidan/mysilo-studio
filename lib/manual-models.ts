import {siteEquipmentModel} from './site-equipment-models';
import {conveyorModel,shipLoadingModel} from './handling-models';
import {portEnvironment} from './port-model';
import {equipmentBase} from './equipment-base';
import * as T from 'three';
import {elevatorAccessDecks} from './access-network';
import {elevatorAccessStructure} from './elevator-access-model';
import {walkwayBarriers} from './walkway-barriers';
import {foundationModel} from './foundation-models';
import {siloBranding} from './silo-branding';
import {createBin,createEquipment} from './models';
import {itemCapacity,itemTop,isSilo,siteSettings,corners,type Item,type Project} from './editor';
const steel=()=>new T.MeshStandardMaterial({color:0xaebbc0,metalness:.5,roughness:.45});
const charcoal=()=>new T.MeshStandardMaterial({color:0x3f4d53,metalness:.45,roughness:.6});
const red=()=>new T.MeshStandardMaterial({color:0xc00031,metalness:.2,roughness:.55});
function box(g:T.Group,w:number,h:number,d:number,x=0,y=0,z=0,mat:T.Material=steel()){const m=new T.Mesh(new T.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;g.add(m);return m}
function beam(g:T.Group,a:T.Vector3,b:T.Vector3,r=.07){const m=new T.Mesh(new T.CylinderGeometry(r,r,a.distanceTo(b),6),charcoal());m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),b.clone().sub(a).normalize());g.add(m)}
export function manualItem(i:Item,selected=false,network:Item[]=[]){let g=new T.Group();const w=i.width,d=i.depth,h=i.height;
 if(['flat','economic','commercial','industrial','feed'].includes(i.kind)){
  const hopper=['economic','commercial','feed'].includes(i.kind);g=createBin({id:i.id,type:hopper?'hopper':'flat',x:0,z:0,diameter:w,height:h,peak:0,volume:0,capacity:0},false,false);
  if(i.kind==='commercial')for(let j=0;j<6;j++){const a=j*Math.PI/3,b=(j+1)*Math.PI/3;beam(g,new T.Vector3(Math.sin(a)*w*.43,1,Math.cos(a)*w*.43),new T.Vector3(Math.sin(b)*w*.43,w/2+2,Math.cos(b)*w*.43),.09)}
 }else if(i.kind==='square'){
  const lift=Math.min(2,h*.2);box(g,w,h-lift,d,0,(h+lift)/2,0);for(const x of [-w/2,w/2])for(const z of [-d/2,d/2])box(g,.15,h,.15,x,h/2,z,charcoal());for(let y=lift;y<h;y+=1)box(g,w+.05,.045,d+.05,0,y,0,charcoal());box(g,w+.3,.2,d+.3,0,h,0,red());
  for(const x of [-w/4,w/4])for(const z of [-d/4,d/4]){const funnel=new T.Mesh(new T.CylinderGeometry(Math.min(w,d)/3,.15,lift,4),steel());funnel.rotation.y=Math.PI/4;funnel.position.set(x,lift/2,z);g.add(funnel)}
 }else if(i.kind==='temporary'){
  const wall=new T.Mesh(new T.CylinderGeometry(w/2,w/2,h,64,1,true),new T.MeshStandardMaterial({color:0xbcc5c7,side:T.DoubleSide,roughness:.8}));wall.position.y=h/2;g.add(wall);const cover=new T.Mesh(new T.ConeGeometry(w/2,w*.15,64),new T.MeshStandardMaterial({color:0xe0e1db,roughness:1}));cover.position.y=h+w*.075;g.add(cover);for(let j=0;j<24;j++){const a=j*Math.PI/12;box(g,.12,h,.12,Math.sin(a)*w/2,h/2,Math.cos(a)*w/2,charcoal())}
 }else if(i.kind==='conveyor'){
  const source=conveyorModel(i),bounds=new T.Box3().setFromObject(source,true),size=bounds.getSize(new T.Vector3()),center=bounds.getCenter(new T.Vector3());source.position.set(-center.x,-bounds.min.y,-center.z);g.add(source);g.scale.set(w/size.x,(h+(i.rise||0))/size.y,d/size.z);
 }else if(i.kind==='walkway'){
  const panels=Math.ceil(w/2);for(let n=0;n<panels;n++)box(g,w/panels,.18,d,-w/2+(n+.5)*w/panels,i.anchor?.axis==='z'?.1:.09,0);
  for(const segment of walkwayBarriers(i,network)){const alongX=segment.side==='front'||segment.side==='back',fixed=segment.side==='front'?d/2:segment.side==='back'?-d/2:segment.side==='right'?w/2:-w/2,length=segment.end-segment.start,mid=(segment.start+segment.end)/2;
   const guard=new T.Group();guard.name=alongX?'Catwalk side guardrail':'Catwalk end closure';guard.userData={side:segment.side,start:segment.start,end:segment.end};g.add(guard);
   for(const [y,thickness] of [[h,.07],[h*.52,.06],[.32,.15]])box(guard,alongX?length:.065,thickness,alongX?.065:length,alongX?mid:fixed,y,alongX?fixed:mid,charcoal());
   const posts=Math.max(1,Math.ceil(length/2));for(let n=0;n<=posts;n++){const at=segment.start+n*length/posts;box(guard,.07,h,.07,alongX?at:fixed,h/2,alongX?fixed:at,charcoal())}
  }
  for(let x=-w/2;x<w/2;x+=.4)box(g,.08,.05,d,x,.21,0,charcoal());
 }else if(['cleaner','dryer','intake','tower','building'].includes(i.kind)){
  const source=siteEquipmentModel(i),bounds=new T.Box3().setFromObject(source,true),size=bounds.getSize(new T.Vector3()),center=bounds.getCenter(new T.Vector3());source.position.set(-center.x,i.kind==='intake'?-bounds.max.y+size.y*.12/h:-bounds.min.y,-center.z);g.add(source);g.scale.set(w/size.x,h/size.y,d/size.z);
 }else if(i.kind==='shiploader'&&i.model){
  const source=shipLoadingModel(i),bounds=new T.Box3().setFromObject(source,true);source.position.y=-bounds.min.y;g.add(source);g.scale.y=h/(bounds.max.y-bounds.min.y);
 }else if(i.kind==='shiploader'){
  box(g,5,2,d,0,2,0,charcoal());for(const z of [-d*.4,d*.4])for(const x of [-2,2]){const wheel=new T.Mesh(new T.CylinderGeometry(1,1,.6,16),charcoal());wheel.rotation.x=Math.PI/2;wheel.position.set(x,1,z);g.add(wheel)}beam(g,new T.Vector3(-w/2,3,0),new T.Vector3(w/2,h,0),.4);box(g,2,h*.6,2,0,h*.3,0,red());for(const z of [-d/3,d/3]){beam(g,new T.Vector3(0,h*.7,z),new T.Vector3(w/2,h,0));beam(g,new T.Vector3(0,h*.7,z),new T.Vector3(-w/2,3,0))}
 }else{
  const type=i.kind as 'elevator'|'intake'|'dryer'|'cleaner';const source=createEquipment({id:i.id,name:type,type,x:0,z:0,width:Math.max(w,5),depth:Math.max(d,5),height:Math.max(h,8)});
  const bounds=new T.Box3().setFromObject(source),size=bounds.getSize(new T.Vector3()),center=bounds.getCenter(new T.Vector3());
  source.position.set(-center.x,-bounds.min.y,-center.z);g.add(source);g.scale.set(w/size.x,h/size.y,d/size.z);
 }
 if(i.kind==='square'||i.kind==='temporary')g.add(siloBranding(w,h,0,false,d));
 g.position.set(i.x,i.y,i.z);g.rotation.y=i.rotation*Math.PI/180;g.name=i.kind;g.userData={id:i.id,kind:i.kind};
 if(selected){const bounds=new T.Box3().setFromObject(g),outline=new T.Box3Helper(bounds,0xc00031);outline.name='selection';const holder=new T.Group();holder.add(g,outline);holder.userData={id:i.id};return holder}return g;
}
export function environment(p:Pick<Project,'width'|'depth'|'facility'|'site'> & Partial<Pick<Project,'items'|'construction'|'port'>>){const g=new T.Group();g.name=p.facility;const w=p.width,d=p.depth;
 const surface=new T.Shape();surface.moveTo(-w/2,-d/2);surface.lineTo(w/2,-d/2);surface.lineTo(w/2,d/2);surface.lineTo(-w/2,d/2);surface.closePath();
 for(const i of p.items||[]){if(i.kind==='intake'&&i.y===0){const hole=new T.Path(),pts=corners(i);hole.moveTo(pts[0].x,-pts[0].z);pts.slice(1).forEach(pt=>hole.lineTo(pt.x,-pt.z));hole.closePath();surface.holes.push(hole);continue}if(!p.construction?.siloIds.includes(i.id))continue;const r=i.width/2+siteSettings(p).foundationApron;if(Math.abs(i.x)+r>w/2||Math.abs(i.z)+r>d/2)continue;const hole=new T.Path();if(i.kind==='square'){const halfD=i.depth/2+siteSettings(p).foundationApron;hole.moveTo(i.x-r,-i.z-halfD);hole.lineTo(i.x-r,-i.z+halfD);hole.lineTo(i.x+r,-i.z+halfD);hole.lineTo(i.x+r,-i.z-halfD);hole.closePath()}else hole.absarc(i.x,-i.z,r,0,Math.PI*2,true);surface.holes.push(hole)}
 const terrain=new T.Mesh(new T.ExtrudeGeometry(surface,{depth:.6,bevelEnabled:false,curveSegments:32}),new T.MeshStandardMaterial({color:0xe0e4e5,roughness:1}));terrain.rotation.x=-Math.PI/2;terrain.position.y=-.7;terrain.receiveShadow=true;g.add(terrain);
 const margin=siteSettings(p).setback;
 if(margin>0){const road=new T.MeshStandardMaterial({color:0xc1c8c8,roughness:1});box(g,w,.015,margin,0,-.084,-d/2+margin/2,road);box(g,w,.015,margin,0,-.084,d/2-margin/2,road);box(g,margin,.015,Math.max(.1,d-2*margin),-w/2+margin/2,-.084,0,road);box(g,margin,.015,Math.max(.1,d-2*margin),w/2-margin/2,-.084,0,road);
 const points=[[-w/2+margin,-d/2+margin],[w/2-margin,-d/2+margin],[w/2-margin,d/2-margin],[-w/2+margin,d/2-margin],[-w/2+margin,-d/2+margin]].map(([x,z])=>new T.Vector3(x,.015,z));const line=new T.Line(new T.BufferGeometry().setFromPoints(points),new T.LineDashedMaterial({color:0xc6944b,dashSize:1,gapSize:.7}));line.computeLineDistances();g.add(line)}
 if(p.facility==='port'){g.add(portEnvironment(p));
 }else{
  box(g,w*2,.1,d*1.8,0,-.85,0,new T.MeshStandardMaterial({color:0xd4ded4,roughness:1}));box(g,w*1.7,.05,9,0,-.7,d/2+12,new T.MeshStandardMaterial({color:0x8e999d,roughness:1}));for(let x=-w*.75;x<w*.75;x+=8)box(g,3,.03,.12,x,-.65,d/2+12,new T.MeshStandardMaterial({color:0xe8ebea}));
 }
 return g;
}
export function manualFacility(p:Project){const group=environment({...p,construction:undefined});group.add(foundationPads(p));const network=[...p.items,...elevatorAccessDecks(p.items)];p.items.forEach(i=>{group.add(manualItem(i,false,network));if(!isSilo(i)&&i.kind!=='walkway')group.add(equipmentBase(i))});group.add(accessModels(p));group.add(walkwaySupports(p));group.userData={project:p,capacityTonnes:p.items.reduce((s,i)=>s+itemCapacity(i,p.density),0),units:'metres',pricing:'not configured',status:'conceptual geometry'};return group}

export function walkwaySupports(p:Project){const g=new T.Group();g.name='Roof centre catwalk supports';const seen=new Set<string>();for(const walk of p.items.filter(i=>i.kind==='walkway'&&i.anchor))for(const id of walk.anchor!.siloIds){if(seen.has(id))continue;seen.add(id);const silo=p.items.find(i=>i.id===id);if(!silo)continue;const peak=itemTop(silo),floor=walk.y;for(const z of [-.7,.7]){beam(g,new T.Vector3(silo.x-.6,peak-.3,silo.z+z),new T.Vector3(silo.x,floor,silo.z+z));beam(g,new T.Vector3(silo.x+.6,peak-.3,silo.z+z),new T.Vector3(silo.x,floor,silo.z+z))}box(g,1.6,.12,1.7,silo.x,floor-.08,silo.z)}return g}

export function foundationPads(p:Project,items=p.items.filter(isSilo)){const g=new T.Group();g.name='Foundation pads';for(const i of items){const pad=foundationModel(i,siteSettings(p).foundationApron);pad.root.position.set(i.x,0,i.z);pad.install(1);g.add(pad.root)}return g}

export function accessModels(p:Project){const root=new T.Group();root.name='Elevator catwalk connections';const decks=elevatorAccessDecks(p.items),network=[...p.items,...decks];for(const i of decks){const model=manualItem(i,false,network);const owner=p.items.find(e=>i.id.startsWith(`access:${e.id}:`));model.userData={id:owner?.id,kind:'elevator'};root.add(model)}for(const e of p.items.filter(i=>i.kind==='elevator'&&i.access)){const walk=p.items.find(i=>i.id===e.access!.walkwayIds[0]);if(walk)root.add(elevatorAccessStructure(e,walk.y))}return root}

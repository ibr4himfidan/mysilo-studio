import * as T from 'three';
import type {Item} from './editor';
import {handlingSpec} from './handling-catalog';
const steel=()=>new T.MeshStandardMaterial({color:0xb6c2c8,metalness:.65,roughness:.4});
const dark=()=>new T.MeshStandardMaterial({color:0x35424b,metalness:.35,roughness:.55});
const red=()=>new T.MeshStandardMaterial({color:0xc90028,metalness:.35,roughness:.45});
function mesh(g:T.Object3D,geo:T.BufferGeometry,mat:T.Material,x=0,y=0,z=0){const m=new T.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;g.add(m);return m}
function box(g:T.Object3D,w:number,h:number,d:number,x=0,y=0,z=0,mat:T.Material=steel()){return mesh(g,new T.BoxGeometry(w,h,d),mat,x,y,z)}
function bar(g:T.Object3D,a:T.Vector3,b:T.Vector3,r=.06,mat:T.Material=steel()){const m=mesh(g,new T.CylinderGeometry(r,r,a.distanceTo(b),10),mat);m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),b.clone().sub(a).normalize());return m}
function motor(g:T.Object3D,x:number,y:number,z:number,size=.3){const m=new T.Group();m.name='Gear motor and drive guard';m.userData.assembly='driveAssembly';g.add(m);box(m,size*1.4,size,size,x,y,z,red());const body=mesh(m,new T.CylinderGeometry(size*.5,size*.5,size*1.5,16),dark(),x,y+size*.85,z);body.rotation.x=Math.PI/2;for(let n=0;n<6;n++)box(m,size*1.06,.035,size*1.45,x,y+size*.4+n*size*.15,z);return m}
function flanges(g:T.Object3D,length:number,w:number,h:number){const count=Math.max(1,Math.ceil(length/2));for(let n=0;n<=count;n++){const x=-length/2+n*length/count;box(g,.04,h,w,x,h/2);for(const z of [-w*.44,w*.44])for(const y of [h*.2,h*.8])mesh(g,new T.SphereGeometry(.035,6,4),dark(),x+.025,y,z)}}
function truss(g:T.Object3D,a:T.Vector3,b:T.Vector3,w:number,h:number){const direction=b.clone().sub(a),count=Math.max(2,Math.ceil(direction.length()/1.7));for(const z of [-w/2,w/2]){for(const y of [-h/2,h/2])bar(g,a.clone().add(new T.Vector3(0,y,z)),b.clone().add(new T.Vector3(0,y,z)),.055);for(let n=0;n<count;n++){const start=a.clone().addScaledVector(direction,n/count),end=a.clone().addScaledVector(direction,(n+1)/count);bar(g,start.clone().add(new T.Vector3(0,-h/2,z)),end.clone().add(new T.Vector3(0,h/2,z)),.035);bar(g,start.clone().add(new T.Vector3(0,h/2,z)),end.clone().add(new T.Vector3(0,-h/2,z)),.035)}}}
function hood(g:T.Object3D,length:number,width:number,y:number){const shape=new T.Shape();shape.absarc(0,0,width/2,0,Math.PI,false);shape.lineTo(width/2,0);const geometry=new T.ExtrudeGeometry(shape,{depth:length,bevelEnabled:false,curveSegments:12});geometry.rotateY(Math.PI/2);geometry.translate(-length/2,y,0);mesh(g,geometry,steel());for(let n=0,count=Math.min(140,Math.ceil(length/.2));n<count;n++){const rib=mesh(g,new T.TorusGeometry(width/2+.014,.012,4,18,Math.PI),dark(),-length/2+(n+.5)*length/count,y,0);rib.rotation.y=Math.PI/2}}

// Dimensions are adjustable placement envelopes. The shapes follow the linked
// manufacturer's illustrations, rather than representing certified CAD parts.
export function conveyorModel(i:Item){const g=new T.Group(),spec=handlingSpec(i)!,family=spec.family,w=i.width,d=i.depth,h=i.height,rise=i.rise||0,core=new T.Group();g.add(core);g.name='Mysilo '+(i.model||'belt-k');
 const tube=family==='tube',screw=family==='screw',inclined=rise>0&&!['tube-l'].includes(i.model||'');
 if(tube){
  const r=Math.min(d*.23,h*.19),levels=i.model==='tube-l'?[r+.12,Math.max(h,rise)+r+.12]:[r+.1,h-r];
  for(const y of levels){bar(core,new T.Vector3(-w/2+.5,y,0),new T.Vector3(w/2-.5,y,0),r);for(let x=-w/2+1;x<w/2-1;x+=2){bar(core,new T.Vector3(x-.18,y,0),new T.Vector3(x+.18,y,0),r*1.12,red())}}
  for(const x of [-w/2+.35,w/2-.35]){if(i.model==='tube-l')bar(core,new T.Vector3(x,levels[0],0),new T.Vector3(x,levels[1],0),r,steel());for(const y of [levels[0],levels.at(-1)!])box(core,.7,h*.45,d*.85,x,y,0,red());motor(core,x,levels.at(-1)!+h*.35,0,h*.25)}
 }else if(screw){
  const r=Math.min(d*.42,h*.35);if(spec.enclosed)bar(core,new T.Vector3(-w/2+.35,h*.5,0),new T.Vector3(w/2-.35,h*.5,0),r);else{
   box(core,w-.6,.06,d*.8,0,.08,0);for(const z of [-d*.4,d*.4])box(core,w-.6,h*.65,.04,0,h*.36,z);
   bar(core,new T.Vector3(-w/2+.35,h*.4,0),new T.Vector3(w/2-.35,h*.4,0),r*.2,dark());
   const path:T.Vector3[]=[];for(let n=0;n<=Math.ceil(w*35);n++){const q=n/Math.ceil(w*35);path.push(new T.Vector3(-w/2+.35+q*(w-.7),h*.4+Math.sin(q*w*Math.PI*3)*r,Math.cos(q*w*Math.PI*3)*r))}mesh(core,new T.TubeGeometry(new T.CatmullRomCurve3(path),Math.ceil(w*22),.035,5,false),steel());
  }
  motor(core,w/2-.2,h*.5,0,h*.42);for(const x of [-w/2+.6,w/2-.6]){box(core,.65,.08,d,x,h*.86,0,red());box(core,.45,h*.3,d*.65,x,h*.72,0)}
 }else if(family==='chain'){
  const segments=i.model==='chain-s'&&rise>0?[[0,.4,0,0],[.4,1,0,rise]]:[[0,1,0,rise]];
  for(const [start,end,low,high] of segments){const length=Math.hypot((end-start)*w,high-low),part=new T.Group();part.position.set((start+end-1)*w/2,(low+high)/2,0);part.rotation.z=Math.atan2(high-low,(end-start)*w);core.add(part);box(part,length,h*.72,d*.82,0,h*.4,0);flanges(part,length,d*.9,h*.82);for(let x=-length/2+.3;x<length/2;x+=1.5)box(part,.42,.035,d*.5,x,h*.84,0)}
  for(const [x,y] of [[-w/2+.45,0],[w/2-.45,rise]]){box(core,.9,h,d,x,h/2+y,0);box(core,.65,.05,d*.65,x,h+y,0,red())}motor(core,w/2-.45,rise+h*.55,d*.5,h*.38);
 }else{
  const mobile=family==='mobile',length=Math.hypot(w,rise),line=new T.Group();line.rotation.z=Math.atan2(rise,w);line.position.y=rise/2+(mobile?.9:0);core.add(line);
  const beltWidth=mobile?Math.min(1.35,d*.55):d*.7,beamH=h*.38;
  for(const z of [-beltWidth*.6,beltWidth*.6])box(line,length,beamH,.07,0,beamH/2,z);
  box(line,length,.055,beltWidth,0,h*.36,0,dark());box(line,length,.04,beltWidth,0,.13,0,dark());
  for(let x=-length/2+.5;x<length/2;x+=1.1){for(const z of [-beltWidth*.25,beltWidth*.25]){const roll=mesh(line,new T.CylinderGeometry(.065,.065,beltWidth*.56,8),dark(),x,h*.3,z);roll.rotation.x=Math.PI/2;roll.rotation.z=z<0?-.2:.2}for(const z of [-beltWidth*.6,beltWidth*.6])box(line,.12,h*.42,.09,x,h*.3,z,red())}
  if(spec.enclosed||i.model==='belt-r'||i.model==='belt-u'){if(i.model==='belt-k'){box(line,length,h*.6,d*.88,0,h*.52,0);flanges(line,length,d*.96,h*.85)}else hood(line,length-1.3,d*.9,h*.38)}
  for(const x of [-length/2+.4,length/2-.4]){box(line,.8,h*.82,d*.95,x,h*.45,0);box(line,.6,.04,d*.7,x,h*.9,0,red())}motor(line,length/2-.5,h*.5,d*.49,h*.3);
  if(mobile){truss(core,new T.Vector3(-w/2,.6,0),new T.Vector3(w/2,rise+.6,0),beltWidth*1.2,.7);for(const z of [-d*.4,d*.4]){const wheel=mesh(core,new T.CylinderGeometry(.65,.65,.36,18),dark(),0,.7,z);wheel.rotation.x=Math.PI/2;bar(core,new T.Vector3(0,1,z),new T.Vector3(w*.18,rise*.7,0),.1);bar(core,new T.Vector3(-w*.15,.6,0),new T.Vector3(w*.2,rise*.73,0),.14,red())}}
  if(family==='trolley'){const x=w*.12,head=h*.85;truss(core,new T.Vector3(x-2,h*.3,0),new T.Vector3(x,head,0),d*.65,.35);box(core,1,.65,d*.8,x,head,0);bar(core,new T.Vector3(x,head,0),new T.Vector3(x,h*.3,d*.7),.2);for(const z of [-d*.45,d*.45])box(core,4,.08,.06,x,.05,z,red())}
 }
 if(inclined&&(screw||tube)){core.rotation.z=Math.atan2(rise,w);core.position.y=rise/2}
 if(['chain','tube','screw'].includes(family)&&(family!=='tube'||i.model!=='tube-l')){
  const y=rise;const inlet=mesh(g,new T.CylinderGeometry(d*.36,d*.22,h*.3,4),steel(),-w/2+.65,h*.88,0);inlet.rotation.y=Math.PI/4;
  box(g,.4,h*.24,d*.6,w/2-.55,y+h*.1,0);
 }
 return g;
}

export function shipLoadingModel(i:Item){const g=new T.Group(),w=i.width,d=i.depth,h=i.height,mobile=i.model==='mobile-telescopic';g.name=mobile?'Mysilo mobile telescopic loader':'Mysilo MYPORT loader';
 if(mobile){
  box(g,5,.55,d*.7,0,1.1,0);for(const x of [-1.5,1.5])for(const z of [-d*.4,d*.4]){const wheel=mesh(g,new T.CylinderGeometry(.8,.8,.5,18),dark(),x,.8,z);wheel.rotation.x=Math.PI/2}
  const a=new T.Vector3(-2,2,0),b=new T.Vector3(w,h,0);truss(g,a,b,1.5,1.1);bar(g,new T.Vector3(-2,2.4,0),new T.Vector3(w,h+.4,0),.32,dark());
  bar(g,new T.Vector3(0,1.6,0),new T.Vector3(w*.4,h*.52,0),.25,red());box(g,1,.65,1.8,w*.5,h*.56,0,red());motor(g,-1,2.8,1,.5);
 }else{
  const base=5.8;for(const x of [-base/2,base/2])for(const z of [-d*.42,d*.42]){box(g,.9,.5,.65,x,.3,z);bar(g,new T.Vector3(x,.5,z),new T.Vector3(x*.68,h,z*.65),.16);for(let y=1;y<h*.6;y+=h*.2)bar(g,new T.Vector3(x,y,z),new T.Vector3(-x,y+h*.2,z),.07)}
  for(const y of [h*.23,h*.46,h*.67,h]){box(g,base*.83,.16,d*.83,0,y,0);for(const z of [-d*.42,d*.42])bar(g,new T.Vector3(-base*.42,y+.85,z),new T.Vector3(base*.42,y+.85,z),.04)}
  for(const z of [-d*.21,d*.21]){const cyclone=mesh(g,new T.CylinderGeometry(.6,.6,h*.14,18),steel(),0,h*.55,z);mesh(g,new T.CylinderGeometry(.6,.13,h*.11,18),steel(),0,h*.425,z);bar(g,new T.Vector3(0,h*.7,z),new T.Vector3(-1,h*.74,z),.25);motor(g,0,h*.28,z,.5)}
  const boomY=h*.65;truss(g,new T.Vector3(0,boomY,0),new T.Vector3(w,boomY+1,0),1.4,1.1);box(g,w,.16,.9,w/2,boomY,0,dark());bar(g,new T.Vector3(0,h,0),new T.Vector3(w*.8,boomY+1,0),.035,dark());
  const chuteTop=boomY+.5,chuteBottom=Math.max(2,h*.24);for(let n=0;n<6;n++){const y=chuteBottom+(chuteTop-chuteBottom)*(n+.5)/6;mesh(g,new T.CylinderGeometry(.35+n*.028,.37+n*.028,(chuteTop-chuteBottom)/6+.06,16),steel(),w,y,0)}
  for(let n=0;n<40;n++){const y=h*n/40;box(g,.65,.04,.1,-base*.45,y,d*.44)}for(const x of [-base*.45-.32,-base*.45+.32])bar(g,new T.Vector3(x,0,d*.44),new T.Vector3(x,h,d*.44),.035);
 }
 return g;
}

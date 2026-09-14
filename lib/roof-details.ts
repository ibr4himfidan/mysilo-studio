import * as T from 'three';
const metal=()=>new T.MeshStandardMaterial({color:0xb9c7cd,metalness:.6,roughness:.4});
const frame=()=>new T.MeshStandardMaterial({color:0x7d929c,metalness:.55,roughness:.45});
function box(g:T.Object3D,w:number,h:number,d:number,x:number,y:number,z:number){const mesh=new T.Mesh(new T.BoxGeometry(w,h,d),metal());mesh.position.set(x,y,z);mesh.castShadow=true;g.add(mesh);return mesh}
function beam(g:T.Object3D,a:T.Vector3,b:T.Vector3,r=.035){const mesh=new T.Mesh(new T.CylinderGeometry(r,r,a.distanceTo(b),6),frame());mesh.position.copy(a).add(b).multiplyScalar(.5);mesh.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),b.clone().sub(a).normalize());mesh.castShadow=true;g.add(mesh);return mesh}
export const roofPanelCount=(r:number)=>Math.min(96,Math.max(24,Math.ceil(2*Math.PI*r/1.2/6)*6));
export const ROOF_LADDER_ANGLE=Math.atan2(.65,.78);
export function roofDetails(r:number,roofH:number){
 const root=new T.Group();root.name='Roof details';const seams=new T.Group();seams.name='Roof sheet seams';root.add(seams);
 const edge=r+.12,panels=roofPanelCount(r),topY=roofH+.055;
 for(let n=0;n<panels;n++){const angle=n*Math.PI*2/panels;const from=new T.Vector3(Math.sin(angle)*edge,.055,Math.cos(angle)*edge),to=new T.Vector3(Math.sin(angle)*.24,topY-roofH*.24/edge,Math.cos(angle)*.24);const rib=beam(seams,from,to,.045);rib.name='Roof seam';rib.userData={angle,eaveRadius:edge};}
 const accessories=new T.Group();accessories.name='Roof access and ventilation';root.add(accessories);
 const fascia=new T.Mesh(new T.CylinderGeometry(edge+.015,edge+.015,.16,96,1,true),metal());fascia.position.y=-.045;fascia.material.side=T.DoubleSide;fascia.name='Eave flashing';accessories.add(fascia);
 const railR=r+.15,ladderAngle=ROOF_LADDER_ANGLE,gap=Math.min(.3,.52/r),segments=Math.max(36,panels*2),isGate=(a:number)=>Math.abs(Math.atan2(Math.sin(a-ladderAngle),Math.cos(a-ladderAngle)))<gap;
 for(let n=0;n<segments;n++){const a=n*Math.PI*2/segments,b=(n+1)*Math.PI*2/segments;if(isGate((a+b)/2))continue;
  for(const y of [.57,1.1]){const rail=beam(accessories,new T.Vector3(Math.sin(a)*railR,y,Math.cos(a)*railR),new T.Vector3(Math.sin(b)*railR,y,Math.cos(b)*railR));rail.name='Eave guardrail'}
  if(n%2===0)beam(accessories,new T.Vector3(Math.sin(a)*railR,0,Math.cos(a)*railR),new T.Vector3(Math.sin(a)*railR,1.1,Math.cos(a)*railR));
 }
 const roofY=(radius:number)=>roofH*(1-radius/edge)+.13;
 const ladder=new T.Group();ladder.name='Roof ladder';ladder.rotation.y=ladderAngle;accessories.add(ladder);const outer=r+.28,inner=Math.min(.6,r*.35),width=Math.min(.8,r*.55);
 for(const x of [-width/2,width/2]){beam(ladder,new T.Vector3(x,roofY(outer),outer),new T.Vector3(x,roofY(inner),inner),.045);beam(ladder,new T.Vector3(x,roofY(outer)+1,outer),new T.Vector3(x,roofY(inner)+1,inner),.035)}
 const steps=Math.max(3,Math.ceil((outer-inner)/.3));for(let n=0;n<=steps;n++){const z=inner+(outer-inner)*n/steps;box(ladder,width,.055,.12,0,roofY(z),z);if(n%4===0)for(const x of [-width/2,width/2])beam(ladder,new T.Vector3(x,roofY(z),z),new T.Vector3(x,roofY(z)+1,z),.03)}
 box(ladder,width+.2,.08,.55,0,.08,r+.12);
 const cap=new T.Mesh(new T.CylinderGeometry(.28,.38,.23,24),metal());cap.position.y=roofH+.06;cap.name='Roof fill collar';accessories.add(cap);
 const ventCount=Math.max(6,Math.floor(panels/2)),ventR=r*.88;
 for(let n=0;n<ventCount;n++){const a=(n+.5)*Math.PI*2/ventCount;if(Math.abs(Math.atan2(Math.sin(a-ladderAngle),Math.cos(a-ladderAngle)))<.25)continue;
  const vent=new T.Group();vent.name='Eave air vent';vent.rotation.y=a;vent.position.set(Math.sin(a)*ventR,roofY(ventR),Math.cos(a)*ventR);const w=Math.min(.48,r*.2);
  box(vent,w,.26,.42,0,.1,0);const cover=box(vent,w+.12,.08,.65,0,.3,.06);cover.rotation.x=-.16;
  const opening=new T.Mesh(new T.PlaneGeometry(w*.82,.18),new T.MeshStandardMaterial({color:0x354850,side:T.DoubleSide}));opening.position.set(0,.12,.216);vent.add(opening);for(let k=-1;k<=1;k++)box(vent,w*.9,.015,.025,0,.12+k*.06,.23);accessories.add(vent);
 }
 const fanAngle=ladderAngle+Math.PI*.62,fanRadius=r*.63,fan=new T.Group();fan.name='Roof exhaust fan';fan.position.set(Math.sin(fanAngle)*fanRadius,roofY(fanRadius),Math.cos(fanAngle)*fanRadius);fan.rotation.y=fanAngle;
 box(fan,.8,.13,.9,0,.03,0);const housing=new T.Mesh(new T.CylinderGeometry(.32,.38,.65,20),metal());housing.position.y=.38;fan.add(housing);const hood=new T.Mesh(new T.ConeGeometry(.58,.3,24),metal());hood.position.y=.85;fan.add(hood);for(let n=0;n<8;n++){const a=n*Math.PI/4;beam(fan,new T.Vector3(Math.sin(a)*.3,.5,Math.cos(a)*.3),new T.Vector3(Math.sin(a)*.42,.73,Math.cos(a)*.42),.018)}accessories.add(fan);
 return{root,seams,accessories};
}

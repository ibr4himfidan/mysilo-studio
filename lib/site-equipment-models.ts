import * as T from 'three';
import type {Item} from './editor';
import {SITE_EQUIPMENT} from './site-equipment-catalog';
const metal=()=>new T.MeshStandardMaterial({color:0xb7c4cc,metalness:.6,roughness:.45});
const frame=()=>new T.MeshStandardMaterial({color:0x566974,metalness:.6,roughness:.48});
const red=()=>new T.MeshStandardMaterial({color:0xc00031,roughness:.5,metalness:.3});
function mesh(g:T.Object3D,geometry:T.BufferGeometry,material:T.Material,x=0,y=0,z=0,name=''){const m=new T.Mesh(geometry,material);m.position.set(x,y,z);m.name=name;m.castShadow=true;m.receiveShadow=true;g.add(m);return m}
function box(g:T.Object3D,w:number,h:number,d:number,x:number,y:number,z:number,mat:T.Material=metal(),name=''){return mesh(g,new T.BoxGeometry(w,h,d),mat,x,y,z,name)}
function bar(g:T.Object3D,a:T.Vector3,b:T.Vector3,r=.035,mat:T.Material=frame()){const m=mesh(g,new T.CylinderGeometry(r,r,a.distanceTo(b),6),mat);m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),b.clone().sub(a).normalize());return m}
function phase(root:T.Object3D,stage:string){root.traverse(o=>{if(o instanceof T.Mesh)o.userData.assembly=stage});return root}
function trapezoid(g:T.Object3D,w:number,d:number,topW:number,topD:number,h:number,y:number,x=0,z=0){const shape=new T.CylinderGeometry(1,1,h,4,1,true);const a=shape.getAttribute('position');for(let n=0;n<a.count;n++){const top=a.getY(n)>0,angle=Math.atan2(a.getX(n),a.getZ(n))+Math.PI/4;a.setXYZ(n,Math.sin(angle)*(top?topW:w)/Math.SQRT2,a.getY(n),Math.cos(angle)*(top?topD:d)/Math.SQRT2)}shape.computeVertexNormals();const m=mesh(g,shape,metal(),x,y,z,'Folded sheet hopper');m.material.side=T.DoubleSide;return m}
function platform(g:T.Object3D,w:number,d:number,x:number,y:number,z:number,openSide=false){const p=new T.Group();p.name='Service platform and guardrails';p.position.set(x,y,z);g.add(p);for(let a=-w/2+.06;a<w/2;a+=.17)box(p,.055,.06,d,a,0,0,frame());for(const side of [-1,1]){
 for(const h of [.5,1]){bar(p,new T.Vector3(-w/2,h,side*d/2),new T.Vector3(w/2,h,side*d/2));if(!openSide||side===1)bar(p,new T.Vector3(side*w/2,h,-d/2),new T.Vector3(side*w/2,h,d/2))}
 for(const x of [-w/2,0,w/2])bar(p,new T.Vector3(x,0,side*d/2),new T.Vector3(x,1,side*d/2));
 }return p}
function stairs(g:T.Object3D,a:T.Vector3,b:T.Vector3,width:number){const p=new T.Group();p.name='Stair flight';g.add(p);const steps=Math.max(3,Math.ceil((b.y-a.y)/.24));for(let n=0;n<=steps;n++){const v=a.clone().lerp(b,n/steps);box(p,width,.07,Math.abs(b.z-a.z)/steps+.05,v.x,v.y,v.z,metal(),'Stair tread')}
 for(const side of [-1,1]){const offset=new T.Vector3(side*width/2,0,0);bar(p,a.clone().add(offset),b.clone().add(offset),.055);bar(p,a.clone().add(offset).add(new T.Vector3(0,1,0)),b.clone().add(offset).add(new T.Vector3(0,1,0)));for(let n=0;n<=4;n++){const v=a.clone().lerp(b,n/4).add(offset);bar(p,v,v.clone().add(new T.Vector3(0,1,0)))}}return p}

function cleaner(){const g=new T.Group();g.name='Mysilo S screen cleaner';
 for(const x of [-2.7,2.7])for(const z of [-.9,.9])box(g,.1,2.8,.1,x,1.4,z,frame());
 box(g,5.4,2.1,1.8,0,1.7,0);box(g,5.6,.15,2,0,2.82,0);trapezoid(g,4.6,1.2,5.3,1.8,.5,.46);
 for(const side of [-1,1]){const z=side*.93;for(const y of [.6,1.2,2.35])box(g,5.4,.035,.025,0,y,z,frame());
  for(let n=0;n<4;n++){const x=-2.05+n*1.35;box(g,1.12,.37,.035,x,2.02,z,frame(),'Inspection window');box(g,1.01,.25,.04,x,2.02,z+side*.018,metal());box(g,.22,.055,.09,x,1.42,z,frame());box(g,.11,.16,.055,x,2.6,z,red());for(const dx of [-.56,.56])box(g,.025,1.6,.03,x+dx,1.6,z,frame())}
 }
 const head=new T.Group();head.name='Aspiration head and inlet';g.add(head);box(head,1.3,1.5,1.82,1.9,3.2,0);trapezoid(head,1.3,1.82,.55,.6,.8,4.32,1.9);const inlet=mesh(head,new T.CylinderGeometry(.32,.32,.18,20),metal(),1.9,4.8,0,'Inlet flange');
 for(const side of [-1,1]){box(head,.88,.4,.035,1.9,3.7,side*.94,frame());box(head,.7,.27,.04,1.9,3.7,side*.96);for(const x of [1.35,2.45])box(head,.15,.12,.07,x,4,side*.96,red())}
 box(g,.4,.4,.6,2.35,2.55,1.17,frame(),'Vibration drive');box(g,.22,.42,.65,2.59,2.55,1.17,red());return g;
}
function dryer(){const g=new T.Group();g.name='Mysilo E mixed-flow dryer';const levels=7;
 for(const x of [-2.3,0,2.3])for(const z of [-1.15,1.15])box(g,.12,1.5,.12,x,.75,z,red());
 box(g,4.6,9.5,2.3,0,6.15,0);for(let n=0;n<=levels;n++){const y=1.4+n*9.5/levels;for(const z of [-1.19,1.19])box(g,4.75,.095,.09,0,y,z,frame())}
 for(const x of [-2.36,0,2.36])for(const z of [-1.2,1.2])box(g,.08,9.6,.08,x,6.15,z,frame());
 // Alternating triangular air-duct ends, matching the E-series sheet panels.
 const ductShape=new T.Shape();ductShape.moveTo(-.14,-.12);ductShape.lineTo(.14,-.12);ductShape.lineTo(0,.12);ductShape.closePath();
 for(const side of [-1,1])for(let row=0;row<19;row++)for(let col=0;col<10;col++){const m=mesh(g,new T.ExtrudeGeometry(ductShape,{depth:.11,bevelEnabled:false}),frame(),-2.05+col*.45+(row%2)*.1,1.75+row*.46,side*1.17,'Triangular air duct');if(side===-1)m.rotation.y=Math.PI}
 trapezoid(g,4.6,2.3,.75,.65,1.1,11.4);box(g,.75,.12,.65,0,12.02,0);
 for(const y of [2.5,6.9]){const fan=new T.Group();fan.name='Centrifugal fan and burner';g.add(fan);box(fan,1.5,1.5,1,0,y+1,1.7);const housing=mesh(fan,new T.CylinderGeometry(.92,.92,.65,24),metal(),0,y+1,2.65,'Fan scroll housing');housing.rotation.x=Math.PI/2;const opening=mesh(fan,new T.CylinderGeometry(.53,.53,.13,24),frame(),0,y+1,3.05,'Fan inlet');opening.rotation.x=Math.PI/2;for(let n=0;n<5;n++){const blade=box(fan,.75,.1,.15,0,y+1,3.14,metal());blade.rotation.z=n*Math.PI/5}box(fan,.6,.6,.8,.95,y+.5,2.4,red(),'Burner');platform(g,3.4,2.25,0,y-.1,2.2,true);phase(fan,'driveAssembly')}
 const ladder=new T.Group();ladder.name='Caged access ladder';g.add(ladder);for(const x of [2.05,2.6])bar(ladder,new T.Vector3(x,.3,1.4),new T.Vector3(x,11.9,1.4));for(let y=.4;y<12;y+=.3)box(ladder,.58,.045,.07,2.32,y,1.4,frame());for(let y=2;y<12;y+=1.2){const hoop=mesh(ladder,new T.TorusGeometry(.42,.025,5,16,Math.PI*1.6),frame(),2.32,y,1.4);hoop.rotation.x=Math.PI/2}platform(g,4.7,2.4,0,10.96,0);return g;
}
function intake(){const g=new T.Group();g.name='Mysilo S receiving hopper';
 const shell=trapezoid(g,.6,.6,4,4,2.45,1.35);shell.userData.assembly='moduleLifting';
 for(const side of [-1,1]){box(g,4,.65,.065,0,2.8,side*2).userData.assembly='moduleLifting';box(g,.065,.65,4,side*2,2.8,0).userData.assembly='moduleLifting';for(let n=-1.5;n<=1.5;n+=.75){bar(g,new T.Vector3(n,2.46,side*2),new T.Vector3(n*.15,.15,side*.3),.025);bar(g,new T.Vector3(side*2,2.46,n),new T.Vector3(side*.3,.15,n*.15),.025)}}
 box(g,.65,.15,.65,0,.075,0,frame()).userData.assembly='moduleLifting';
 const grate=new T.Group();grate.name='Receiving grate';g.add(grate);for(let x=-2.03;x<=2.04;x+=.12)box(grate,.04,.12,4.13,x,3.2,0,frame());for(let z=-2.06;z<=2.07;z+=.5)box(grate,4.14,.18,.065,0,3.14,z,frame());phase(grate,'panelAssembly');return g;
}
function tower(){const g=new T.Group();g.name='Mysilo elevator support tower';const w=3.2,d=3.2,h=14;
 for(const x of [-w/2,w/2])for(const z of [-d/2,d/2]){box(g,.14,h,.14,x,h/2,z,frame());box(g,.48,.08,.48,x,.04,z)}
 for(let y=0;y<h;y+=3.5){for(const z of [-d/2,d/2]){box(g,w,.09,.09,0,y,z,frame());for(const side of [-1,1])bar(g,new T.Vector3(side*w/2,y,z),new T.Vector3(-side*w/2,Math.min(h,y+3.5),z))}for(const x of [-w/2,w/2])for(const side of [-1,1])bar(g,new T.Vector3(x,y,side*d/2),new T.Vector3(x,Math.min(h,y+3.5),-side*d/2));
  const level=Math.min(h-.9,y+3.5),left=(y/3.5)%2===0,stairX=-w/2-.65;platform(g,1.2,d+.45,stairX,level,0);stairs(g,new T.Vector3(stairX,y,left?-d/2:d/2),new T.Vector3(stairX,level,left?d/2:-d/2),.85);
 }
 platform(g,w,d,0,h-.9,0);box(g,w+.7,.1,d+.7,0,h+.3,0);for(let x=-w/2-.3;x<w/2+.3;x+=.12)box(g,.025,.05,d+.7,x,h+.37,0,frame());return g;
}
function building(){const g=new T.Group();g.name='Mysilo 7 receiving building';
 // Tall elevator enclosure with a lower drive-through receiving hall.
 const modules=[{x:-3.2,w:2.5,h:8,d:3.6},{x:1.1,w:6,h:4.5,d:3.6}];
 for(const m of modules){for(const x of [m.x-m.w/2,m.x+m.w/2])for(const z of [-m.d/2,m.d/2])box(g,.14,m.h,.14,x,m.h/2,z,frame()).userData.assembly='frameAssembly';
  for(const side of [-1,1])for(let n=0;n<Math.ceil(m.w/.35);n++){const x=m.x-m.w/2+(n+.5)*m.w/Math.ceil(m.w/.35),sheet=box(g,m.w/Math.ceil(m.w/.35)-.025,m.h-1.15,.075,x,(m.h+1.15)/2,side*m.d/2);sheet.userData.assembly='panelAssembly'}
  for(const end of [-1,1]){const x=m.x+end*m.w/2;for(let z=-m.d/2+.1;z<m.d/2;z+=.25){const panel=box(g,.08,m.h-1.15,.22,x,(m.h+1.15)/2,z);panel.userData.assembly='panelAssembly'}}
  for(let x=m.x-m.w/2;x<m.x+m.w/2;x+=.22)box(g,.19,.12,m.d+.2,x,m.h,0,frame()).userData.assembly='panelAssembly';
 }
 return g;
}
export function siteEquipmentModel(i:Item){const makers={cleaner,dryer,intake,tower,building};const kind=i.kind as keyof typeof makers;if(!makers[kind])throw new Error('Unknown site equipment');const g=makers[kind]();g.userData.manufacturerReference=SITE_EQUIPMENT[kind].source;return g}

import * as THREE from 'three';
import {roofDetails,roofPanelCount,ROOF_LADDER_ANGLE} from './roof-details';
import {siloBranding} from './silo-branding';
import type {Bin,Equipment,Inputs,Layout} from './planner';
const metal=new THREE.MeshStandardMaterial({color:0xb5c1c5,metalness:.65,roughness:.4});
const dark=new THREE.MeshStandardMaterial({color:0x53636a,metalness:.6,roughness:.5});
const orange=new THREE.MeshStandardMaterial({color:0xc00031,roughness:.65});
const concrete=new THREE.MeshStandardMaterial({color:0xc6cccd,roughness:1});
const sharedMaterials=new Set<THREE.Material>([metal,dark,orange,concrete]);
export function disposeModel(root:THREE.Object3D){const geometries=new Set<THREE.BufferGeometry>(),materials=new Set<THREE.Material>();root.traverse(obj=>{const m=obj as THREE.Mesh;if(m.geometry)geometries.add(m.geometry);if(m.material)(Array.isArray(m.material)?m.material:[m.material]).forEach(mat=>materials.add(mat));});geometries.forEach(g=>g.dispose());materials.forEach(m=>{if(!sharedMaterials.has(m))m.dispose()});}
function box(g:THREE.Group,w:number,h:number,d:number,x:number,y:number,z:number,mat=metal){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;g.add(m);return m;}
function beam(g:THREE.Group,a:THREE.Vector3,b:THREE.Vector3,r=.09,mat=dark){if(a.distanceTo(b)<.001)return;const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,a.distanceTo(b),6),mat);m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),b.clone().sub(a).normalize());g.add(m);return m;}
export function createBin(b:Bin,selected=false,aeration=true){
 const g=new THREE.Group();g.name=b.id;g.userData={id:b.id,kind:'bin',diameter:b.diameter,capacityTonnes:b.capacity};const r=b.diameter/2,base=b.type==='hopper'?r+2.5:.4;
 const mat=selected?new THREE.MeshStandardMaterial({color:0xe39cac,metalness:.45,roughness:.45}):metal;
 const cylinder=new THREE.Mesh(new THREE.CylinderGeometry(r,r,b.height,64),mat);cylinder.position.y=base+b.height/2;cylinder.castShadow=true;cylinder.receiveShadow=true;g.add(cylinder);
 const roofH=r*Math.tan(28*Math.PI/180),roof=new THREE.Mesh(new THREE.ConeGeometry(r+.12,roofH,48),metal);roof.position.y=base+b.height+roofH/2;roof.castShadow=true;g.add(roof);
 const foundation=new THREE.Mesh(new THREE.CylinderGeometry(r+.45,r+.45,.4,64),concrete);foundation.position.y=.15;g.add(foundation);
 const rings=new THREE.InstancedMesh(new THREE.TorusGeometry(r+.015,.035,3,64),dark,Math.floor(b.height/.23)),matrix=new THREE.Matrix4();
 for(let i=0;i<rings.count;i++){matrix.makeRotationX(Math.PI/2);matrix.setPosition(0,base+i*.23,0);rings.setMatrixAt(i,matrix);}g.add(rings);
 const details=roofDetails(r,roofH);details.root.position.y=base+b.height;g.add(details.root);
 const stiffeners=roofPanelCount(r);for(let n=0;n<stiffeners;n++){const a=n*Math.PI*2/stiffeners,x=Math.sin(a)*(r+.045),z=Math.cos(a)*(r+.045),stiffener=box(g,.12,b.height,.07,x,base+b.height/2,z,dark);stiffener.rotation.y=a;stiffener.name='Wall stiffener';stiffener.userData={angle:a};}
 if(b.type==='hopper'){const cone=new THREE.Mesh(new THREE.CylinderGeometry(r,.35,r,48),metal);cone.position.y=2.5+r/2;g.add(cone);for(let i=0;i<6;i++){const a=i*Math.PI/3;box(g,.18,base,.18,Math.sin(a)*r*.86,base/2,Math.cos(a)*r*.86,dark);}}
 const ladder=new THREE.Group();ladder.name='Wall access ladder';ladder.rotation.y=ROOF_LADDER_ANGLE;g.add(ladder);const lz=r+.29;box(ladder,.08,b.height,.08,-.4,base+b.height/2,lz,dark);box(ladder,.08,b.height,.08,.4,base+b.height/2,lz,dark);for(let h=.3;h<b.height;h+=.35)box(ladder,.8,.055,.07,0,base+h,lz,dark);
 for(let y=base+2;y<base+b.height;y+=1.5){const hoop=new THREE.Mesh(new THREE.TorusGeometry(.5,.025,5,18,Math.PI),metal);hoop.rotation.set(Math.PI/2,0,0);hoop.position.set(0,y,lz);ladder.add(hoop)}
 box(g,1.1,1.9,.16,0,base+.95,r,orange);
 if(aeration){box(g,1.4,1.2,1.5,-r*.6,.8,r*.88,dark);const fan=new THREE.Mesh(new THREE.CylinderGeometry(.65,.65,.7,24),orange);fan.rotation.x=Math.PI/2;fan.position.set(-r*.6,.9,r+1);g.add(fan);}
 g.add(siloBranding(b.diameter,b.height,base));g.position.set(b.x,0,b.z);return g;
}
export function createEquipment(e:Equipment){const g=new THREE.Group();g.name=e.name;g.userData={id:e.id,kind:e.type};
 if(e.type==='elevator'){
  box(g,.8,e.height,.7,-.65,e.height/2,0);box(g,.8,e.height,.7,.65,e.height/2,0);box(g,2.8,1.5,1.6,0,e.height,0,orange);
  for(const x of [-1.3,1.3])for(const z of [-1.3,1.3])box(g,.14,e.height,.14,x,e.height/2,z,dark);
  for(let y=2;y<e.height;y+=4)for(const z of [-1.3,1.3]){beam(g,new THREE.Vector3(-1.3,y,z),new THREE.Vector3(1.3,Math.min(y+3,e.height),z),.07);box(g,3,.09,.09,0,y,z,dark);}
 }else if(e.type==='dryer'){
  box(g,e.width,1,e.depth,0,.5,0,concrete);box(g,e.width-1,e.height-3,e.depth-2,0,(e.height+1)/2,0);
  for(let y=3;y<e.height;y+=1.4)box(g,e.width-.7,.2,e.depth-1.7,0,y,0,dark);
  box(g,e.width,1.2,e.depth-1,0,e.height,0,orange);for(let y=4;y<14;y+=4){const m=new THREE.Mesh(new THREE.CylinderGeometry(1,1,1,24),dark);m.rotation.x=Math.PI/2;m.position.set(0,y,e.depth/2);g.add(m);}
 }else if(e.type==='wetbin'){g.add(createBin({id:e.id,x:0,z:0,diameter:6,height:5,peak:12.1,capacity:0,volume:0,type:'hopper'}));
 }else if(e.type==='intake'){
  box(g,e.width,.4,e.depth,0,.1,0,dark);for(let x=-e.width/2;x<e.width/2;x+=.4)box(g,.12,.07,e.depth,x,.34,0);
  for(const x of [-e.width/2,e.width/2])for(const z of [-e.depth/2,e.depth/2])box(g,.15,5,.15,x,2.5,z,dark);box(g,e.width+1,.2,e.depth+1,0,5,0);
 }else if(e.type==='cleaner'){for(const x of [-2,2])for(const z of [-2,2])box(g,.16,3,.16,x,1.5,z,dark);box(g,4.5,3.5,4.5,0,4,0,orange);box(g,3,.3,4.6,0,4.5,0,dark);box(g,1.5,1,1.5,0,6,0);
 }else{box(g,e.width,e.height,e.depth,0,e.height/2,0,concrete);box(g,e.width+.5,.3,e.depth+.5,0,e.height,0,dark);for(const x of [-2,1])box(g,1.8,1.3,.05,x,2,e.depth/2+.03,dark);}
 g.position.set(e.x,0,e.z);return g;
}
export function createFacility(p:Inputs,l:Layout,selected:string){
 const g=new THREE.Group();g.name='Silo Studio conceptual facility';box(g,p.width,.3,p.depth,0,-.3,0,new THREE.MeshStandardMaterial({color:0xe1e6e5,roughness:1}));
 const road=new THREE.MeshStandardMaterial({color:0xc2cbcc,roughness:1});
 if(l.rotated)box(g,l.service,.025,p.depth-2*p.margin,p.width/2-p.margin-l.service/2,-.12,0,road);else box(g,p.width-2*p.margin,.025,l.service,0,-.12,p.depth/2-p.margin-l.service/2,road);
 l.bins.forEach(b=>g.add(createBin(b,b.id===selected,p.aeration)));l.equipment.forEach(e=>g.add(createEquipment(e)));
 const elevator=l.equipment.find(e=>e.type==='elevator');
 if(elevator&&l.bins.length){const route=new THREE.Group();route.name='Şematik üst taşıma hatları';const y=elevator.height;
  for(const row of [...new Set(l.bins.map(b=>l.rotated?b.x:b.z))]){const bins=l.bins.filter(b=>(l.rotated?b.x:b.z)===row),first=bins[0],last=bins[bins.length-1];const a=new THREE.Vector3(first.x,y,first.z),b=new THREE.Vector3(last.x,y,last.z);beam(route,new THREE.Vector3(elevator.x,y,elevator.z),a,.22,orange);beam(route,a,b,.22,orange);bins.forEach(bin=>beam(route,new THREE.Vector3(bin.x,y,bin.z),new THREE.Vector3(bin.x,bin.peak,bin.z),.18));}g.add(route);
 }return g;
}

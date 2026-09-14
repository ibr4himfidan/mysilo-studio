import * as T from 'three';
import {compactStatic} from './render-batching';
import type {Item} from './editor';
const concrete=new T.MeshStandardMaterial({color:0xbbc1bf,roughness:1});
const steel=new T.MeshStandardMaterial({color:0x798f99,metalness:.65,roughness:.4});
function rectangle(x:number,z:number,w:number,d:number){const s=new T.Path();s.moveTo(x-w/2,z-d/2);s.lineTo(x-w/2,z+d/2);s.lineTo(x+w/2,z+d/2);s.lineTo(x+w/2,z-d/2);s.closePath();return s}
export function hasFloorAeration(i:Item){return i.kind==='flat'||i.kind==='industrial'}
export function foundationModel(i:Item,apron:number){
 const root=new T.Group(),r=i.width/2+apron,shape=new T.Shape();root.name='Concrete with reserved air channels';
 if(i.kind==='square'){shape.moveTo(-r,-i.depth/2-apron);shape.lineTo(r,-i.depth/2-apron);shape.lineTo(r,i.depth/2+apron);shape.lineTo(-r,i.depth/2+apron);shape.closePath()}else shape.absarc(0,0,r,0,Math.PI*2,false);
 const channels=hasFloorAeration(i)?[-.45,0,.45].map(f=>({x:f*i.width/2,length:Math.sqrt((i.width/2)**2-(f*i.width/2)**2)*1.65,width:Math.min(.65,i.width*.07)})):[];
 for(const ch of channels)shape.holes.push(rectangle(ch.x,0,ch.width,ch.length));
 const slab=new T.Mesh(new T.ExtrudeGeometry(shape,{depth:.44,bevelEnabled:false,curveSegments:32}),concrete.clone());slab.rotation.x=-Math.PI/2;slab.position.y=-.06;slab.receiveShadow=true;root.add(slab);
 const grates=new T.Group();grates.name='Aeration grates';const panels:T.Group[]=[];root.add(grates);
 for(const ch of channels){
  const bed=new T.Mesh(new T.BoxGeometry(ch.width,.08,ch.length),new T.MeshStandardMaterial({color:0x53666c,roughness:.85}));bed.position.set(ch.x,.09,0);root.add(bed);
  const sections=Math.ceil(ch.length/1.1),length=ch.length/sections;
  for(let n=0;n<sections;n++){const panel=new T.Group();panel.position.set(ch.x,.35,-ch.length/2+(n+.5)*length);panel.name='Aeration grate panel';
   for(const x of [-ch.width/2,ch.width/2]){const rail=new T.Mesh(new T.BoxGeometry(.025,.04,length-.015),steel.clone());rail.position.x=x;panel.add(rail)}
   for(let z=-length/2+.035;z<length/2;z+=.1){const bar=new T.Mesh(new T.BoxGeometry(ch.width,.035,.055),steel.clone());bar.position.z=z;panel.add(bar)}
   compactStatic(panel);grates.add(panel);panels.push(panel);
  }
 }
 return{root,grates,install:(progress:number)=>panels.forEach((panel,n)=>panel.visible=n<Math.ceil(progress*panels.length))};
}

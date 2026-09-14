import * as T from 'three';
import type {Item} from './editor';
function box(g:T.Group,w:number,h:number,d:number,x:number,y:number,z:number,color:number){const m=new T.Mesh(new T.BoxGeometry(w,h,d),new T.MeshStandardMaterial({color,roughness:.9}));m.position.set(x,y,z);m.receiveShadow=true;g.add(m);return m}
export function equipmentBase(i:Item){const root=new T.Group();root.name='Equipment base '+i.id;root.position.set(i.x,i.y,i.z);root.rotation.y=i.rotation*Math.PI/180;
 if(i.y>0||i.kind==='conveyor'||i.kind==='shiploader')return root;
 if(i.kind==='intake'){box(root,i.width+.1,.12,i.depth+.1,0,.04-i.height,0,0x536065)}
 else if(i.kind==='building')box(root,i.width+.2,.15,i.depth+.2,0,-.04,0,0xb9c0be);
 else for(const x of [-1,1])for(const z of [-1,1]){const w=Math.min(.85,i.width*.25),d=Math.min(.85,i.depth*.25);box(root,w,.18,d,x*(i.width/2-w/2),-.04,z*(i.depth/2-d/2),0xb9c0be);box(root,.08,.15,.08,x*(i.width/2-w/2),.08,z*(i.depth/2-d/2),0x5e7078)}
 return root;
}

import * as T from 'three';
import type {Item} from './editor';
const material=()=>new T.MeshStandardMaterial({color:0x8096a0,metalness:.65,roughness:.42});
function beam(g:T.Object3D,a:T.Vector3,b:T.Vector3,r=.05){const m=new T.Mesh(new T.CylinderGeometry(r,r,a.distanceTo(b),6),material());m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),b.clone().sub(a).normalize());m.castShadow=true;g.add(m);return m}
export function elevatorAccessStructure(e:Item,deck:number){const root=new T.Group();root.name='Elevator access structure';root.position.set(e.x,e.y,e.z);root.userData={id:e.id,kind:'elevator'};
 const a=e.rotation*Math.PI/180,W=Math.abs(Math.cos(a))*e.width+Math.abs(Math.sin(a))*e.depth,D=Math.abs(Math.sin(a))*e.width+Math.abs(Math.cos(a))*e.depth,head=e.height-1.8,levels=[deck-e.y,...head>deck-e.y+1.5?[head]:[]];
 for(const y of levels)for(const x of [-1,1])for(const z of [-1,1])beam(root,new T.Vector3(x*W*.4,y-1.3,z*D*.4),new T.Vector3(x*(W/2+1.4),y-.08,z*(D/2+1.4)),.075);
 const ladder=new T.Group();ladder.name='Elevator caged access ladder';root.add(ladder);const lx=W/2+1.72;
 for(const z of [-.4,.4])beam(ladder,new T.Vector3(lx,.2,z),new T.Vector3(lx,e.height-.45,z),.04);
 for(let y=.4;y<head+.4;y+=.3)beam(ladder,new T.Vector3(lx,y,-.4),new T.Vector3(lx,y,.4),.027);
 for(let y=2;y<head;y+=1.3){const hoop=new T.Mesh(new T.TorusGeometry(.52,.026,5,20,Math.PI),material());hoop.rotation.x=Math.PI/2;hoop.rotation.z=-Math.PI/2;hoop.position.set(lx,y,0);ladder.add(hoop)}
 for(const y of levels){const gate=new T.Group();gate.name='Self-closing ladder gate';for(const h of [.6,1.1])beam(gate,new T.Vector3(W/2+1.5,y+h,-.43),new T.Vector3(W/2+1.5,y+h,.43),.035);root.add(gate)}
 return root;
}

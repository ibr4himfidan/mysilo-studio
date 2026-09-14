import * as T from 'three';
const mat=(color:number)=>new T.MeshStandardMaterial({color,metalness:.45,roughness:.55});
function box(g:T.Object3D,w:number,h:number,d:number,x:number,y:number,z:number,color:number){const m=new T.Mesh(new T.BoxGeometry(w,h,d),mat(color));m.position.set(x,y,z);m.castShadow=true;g.add(m)}
function line(g:T.Object3D,r:number,color:number){const mesh=new T.Mesh(new T.CylinderGeometry(r,r,1,8),mat(color));g.add(mesh);return(a:T.Vector3,b:T.Vector3)=>{mesh.position.copy(a).add(b).multiplyScalar(.5);mesh.scale.y=Math.max(.001,a.distanceTo(b));mesh.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),b.clone().sub(a).normalize())}}
export function liftingCrane(x:number,z:number){const root=new T.Group();root.name='Equipment installation crane';const truck=new T.Group();truck.position.set(x,0,z);root.add(truck);
 box(truck,5.8,.7,2.6,0,1,0,0xd1a13d);box(truck,1.6,1.5,2.3,2,2,0,0xc00031);box(truck,1.62,.85,2.32,2,2.25,0,0x7396a5);box(truck,1.5,1.2,2.5,-1.8,2,0,0xc00031);
 for(const x of [-1.9,0,1.9])for(const z of [-1.5,1.5]){const wheel=new T.Mesh(new T.CylinderGeometry(.55,.55,.4,16),mat(0x303c42));wheel.rotation.x=Math.PI/2;wheel.position.set(x,.6,z);truck.add(wheel)}
 for(const x of [-2,2]){box(truck,.22,.22,6,x,.65,0,0x4b5c65);for(const z of [-3,3]){box(truck,.18,.55,.18,x,.35,z,0xc7d0d0);box(truck,.8,.12,.8,x,.08,z,0x394b54)}}
 const boom=[line(root,.33,0xc00031),line(root,.26,0xd2aa48),line(root,.19,0xd2aa48)],cable=line(root,.035,0x394952),slings=[line(root,.025,0x6c7a80),line(root,.025,0x6c7a80)],pivot=new T.Vector3(x,2.5,z);
 const spread=new T.Mesh(new T.BoxGeometry(1,.16,.25),mat(0xc00031));spread.name='Lifting spreader';root.add(spread);
 return{root,update:(points:[T.Vector3,T.Vector3])=>{const hook=points[0].clone().add(points[1]).multiplyScalar(.5);hook.y=Math.max(points[0].y,points[1].y)+2;const tip=hook.clone().add(new T.Vector3(0,5,0));
  boom.forEach((set,n)=>set(pivot.clone().lerp(tip,n/3),pivot.clone().lerp(tip,(n+1)/3)));cable(tip,hook);spread.position.copy(hook);spread.scale.x=Math.max(.6,Math.hypot(points[1].x-points[0].x,points[1].z-points[0].z));spread.rotation.y=-Math.atan2(points[1].z-points[0].z,points[1].x-points[0].x);slings.forEach((set,n)=>set(hook,points[n]));
 }};
}

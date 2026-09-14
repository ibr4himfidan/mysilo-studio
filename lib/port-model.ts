import * as T from 'three';
import {portFrame,type CoastalSite} from './site-context';
const mat=(color:number,roughness=.65)=>new T.MeshStandardMaterial({color,roughness,metalness:.2});
function box(g:T.Object3D,w:number,h:number,d:number,x:number,y:number,z:number,color:number){const m=new T.Mesh(new T.BoxGeometry(w,h,d),mat(color));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;g.add(m);return m}
function line(g:T.Object3D,a:T.Vector3,b:T.Vector3,color=0x716b5d){const m=new T.Mesh(new T.CylinderGeometry(.045,.045,a.distanceTo(b),6),mat(color));m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),b.clone().sub(a).normalize());g.add(m)}
export function portEnvironment(p:CoastalSite){const root=new T.Group(),f=portFrame(p);root.name='Port quay and continuous sea';root.rotation.y=f.angle;
 const waterTime={value:0},waterMat=new T.MeshStandardMaterial({color:0x487a8d,roughness:.3,metalness:.35});
 waterMat.onBeforeCompile=shader=>{shader.uniforms.waterTime=waterTime;shader.vertexShader='varying vec3 waterPosition;\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nwaterPosition=(modelMatrix*vec4(position,1.0)).xyz;');shader.fragmentShader='uniform float waterTime;\nvarying vec3 waterPosition;\n'+shader.fragmentShader;shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\nfloat ripple=sin(waterPosition.x*0.71+waterPosition.z*1.13+waterTime*0.8)*sin(waterPosition.z*0.38-waterTime*0.57);\ndiffuseColor.rgb*=0.94+0.08*ripple;');shader.fragmentShader=shader.fragmentShader.replace('#include <normal_fragment_maps>','#include <normal_fragment_maps>\nnormal=normalize(normal+vec3(sin(waterPosition.x*0.7+waterTime)*0.09,sin(waterPosition.z*0.9-waterTime)*0.09,0.0));')};
 waterMat.customProgramCacheKey=()=> 'mysilo-water-v1';
 const sea=new T.Mesh(new T.PlaneGeometry(120000,120000),waterMat);sea.name='Continuous sea';sea.rotation.x=-Math.PI/2;sea.position.set(0,-.65,f.quayEnd+60000);sea.userData.waterTime=waterTime;root.add(sea);
 // Keep the surrounding land below excavated foundations and intake pits.
 const backland=box(root,120000,.3,120000,0,-1.8,f.quayEnd-60000,0xcfd8d3);backland.name='Coastal backland';
 const quay=box(root,f.width,.8,f.quayDepth,0,-.45,f.depth/2+f.quayDepth/2,0xa5afb0);quay.name='Usable quay';
 box(root,f.width,.12,.45,0,.02,f.quayEnd-.24,0xe5d6a6);
 for(let x=-f.width/2+4;x<f.width/2-3;x+=8){box(root,.6,.3,.6,x,.18,f.quayEnd-1.2,0x32444e);box(root,.8,1.3,.5,x,-.6,f.quayEnd+.2,0x2d3940);for(let n=0;n<3;n++)box(root,.65,.03,.5,x+n*.8,.015,f.quayEnd-2.2,0xe2c365)}
 const ship=new T.Group();ship.name='Bulk carrier with open hatches';ship.position.set(0,0,f.shipZ);root.add(ship);const length=f.shipLength,beam=f.shipBeam,shape=new T.Shape();shape.moveTo(-length/2,-beam*.35);shape.lineTo(-length/2+beam*.3,-beam/2);shape.lineTo(length/2-beam*.6,-beam/2);shape.quadraticCurveTo(length/2+2,0,length/2-beam*.6,beam/2);shape.lineTo(-length/2+beam*.3,beam/2);shape.lineTo(-length/2,beam*.35);shape.closePath();
 const hull=new T.Mesh(new T.ExtrudeGeometry(shape,{depth:3.8,bevelEnabled:false}),mat(0x435967));hull.rotation.x=-Math.PI/2;hull.position.y=-.4;ship.add(hull);
 box(ship,length-beam*.9,.18,beam*.85,-beam*.15,3.5,0,0xa5b4b8);
 const usable=length-beam*1.5,cell=usable/f.hatches,hatchLength=Math.max(2,cell-2),hatchWidth=beam*.66;
 for(let n=0;n<f.hatches;n++){const x=-length/2+beam*.8+(n+.5)*cell;
  box(ship,hatchLength,.12,hatchWidth,x,3.64,0,0x3c4a4e);box(ship,hatchLength-1,.25,hatchWidth-1,x,3.7,0,0xb59b68);
  for(const z of [-hatchWidth/2,hatchWidth/2])box(ship,hatchLength,.75,.18,x,3.98,z,0x758c95);for(const side of [-1,1])box(ship,.18,.75,hatchWidth,x+side*hatchLength/2,3.98,0,0x758c95);
 }
 box(ship,beam*.5,4,beam*.72,-length/2+beam*.35,5.4,0,0xe1e7e7);box(ship,beam*.35,1.3,beam*.77,-length/2+beam*.35,8,0,0xd6e0e2);box(ship,beam*.36,.55,beam*.78,-length/2+beam*.35,8.1,0,0x456e80);
 for(const side of [-1,1])line(root,new T.Vector3(side*Math.min(length*.32,f.width*.35),1,f.shipZ-beam/2),new T.Vector3(side*Math.min(length*.32,f.width*.35),.3,f.quayEnd-1.2));
 return root;
}
export function updateWater(root:T.Object3D,time:number){root.traverse(o=>{if(o.userData.waterTime)o.userData.waterTime.value=time})}

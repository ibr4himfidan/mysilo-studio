import * as T from 'three';
import logo from './logo-mesh.json';
export function siloBranding(width:number,bodyHeight:number,base:number,round=true,depth=width){
 const root=new T.Group();root.name='Mysilo white logo on red sign';
 const w=Math.min(4.2,width*.5,bodyHeight*1.6),h=w*.3;
 const positions:number[]=[];
 for(const [left,right,top,bottom] of logo.runs){const x0=(left-.5)*w*.84,x1=(right-.5)*w*.84,y0=(.5-bottom)*w*.84/logo.aspect,y1=(.5-top)*w*.84/logo.aspect;positions.push(x0,y0,.051,x1,y0,.051,x1,y1,.051,x0,y0,.051,x1,y1,.051,x0,y1,.051)}
 for(const angle of [0]){const sign=new T.Group();const panel=new T.Mesh(new T.BoxGeometry(w,h,.08),new T.MeshBasicMaterial({color:0xc00031}));sign.add(panel);const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.computeVertexNormals();sign.add(new T.Mesh(geometry,new T.MeshBasicMaterial({color:0xffffff})));sign.position.set(Math.sin(angle)*(width/2+.13),base+bodyHeight-h/2-Math.min(.28,bodyHeight*.12),Math.cos(angle)*(depth/2+.13));sign.rotation.y=angle;root.add(sign)}
 return root;
}

'use client';
import {useEffect,useRef,useState} from 'react';
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {createFacility,disposeModel} from '@/lib/models';
import type {Inputs,Layout} from '@/lib/planner';
export default function Scene({inputs,layout,selected,onSelect,view,reset,grid}:{inputs:Inputs;layout:Layout;selected:string;onSelect:(id:string)=>void;view:string;reset:number;grid:boolean}){
 const ref=useRef<HTMLDivElement>(null),[error,setError]=useState('');
 const pose=useRef<{key:string;position:THREE.Vector3;target:THREE.Vector3}|null>(null);
 useEffect(()=>{if(!ref.current)return;const host=ref.current;let renderer:THREE.WebGLRenderer;
  try{renderer=new THREE.WebGLRenderer({antialias:true});}catch{setError('3B görünüm için WebGL gerekli. Proje listesi ve 2B planı kullanabilirsiniz.');return;}
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.setClearColor(0xeef1f2,1);host.appendChild(renderer.domElement);
  const scene=new THREE.Scene();scene.add(new THREE.HemisphereLight(0xe8f5ff,0x798382,3));const sun=new THREE.DirectionalLight(0xfff4dd,3.5);sun.position.set(-60,100,40);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-160,right:160,top:160,bottom:-160,far:500});sun.shadow.bias=-.001;scene.add(sun);
  const size=Math.max(inputs.width,inputs.depth),camera=new THREE.PerspectiveCamera(38,1,.1,3000);camera.position.set(size*.85,size*.85,size*1.1);
  const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,4,0);controls.enableDamping=true;controls.maxPolarAngle=Math.PI/2.03;controls.minDistance=10;controls.maxDistance=size*4;
  if(view==='top'){camera.position.set(0,size*1.55,.01);controls.enableRotate=false;controls.target.set(0,0,0);}
  const poseKey=`${view}/${reset}/${inputs.width}/${inputs.depth}`;if(pose.current?.key===poseKey){camera.position.copy(pose.current.position);controls.target.copy(pose.current.target)}
  const facility=createFacility(inputs,layout,selected);scene.add(facility);
  if(grid){const gh=new THREE.GridHelper(Math.ceil(size*2/10)*10,Math.ceil(size*2/10),0xd1d9dc,0xe1e6e8);gh.position.y=-.52;scene.add(gh);}
  const boundary=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-inputs.width/2,0,-inputs.depth/2),new THREE.Vector3(inputs.width/2,0,-inputs.depth/2),new THREE.Vector3(inputs.width/2,0,inputs.depth/2),new THREE.Vector3(-inputs.width/2,0,inputs.depth/2),new THREE.Vector3(-inputs.width/2,0,-inputs.depth/2)]);scene.add(new THREE.Line(boundary,new THREE.LineBasicMaterial({color:0x488d95})));
  const resize=()=>{const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix()};const observer=new ResizeObserver(resize);observer.observe(host);resize();
  const ray=new THREE.Raycaster();let down={x:0,y:0};const pointerdown=(e:PointerEvent)=>{down={x:e.clientX,y:e.clientY}};
  const select=(e:PointerEvent)=>{if(Math.hypot(e.clientX-down.x,e.clientY-down.y)>5)return;const r=host.getBoundingClientRect();ray.setFromCamera(new THREE.Vector2((e.clientX-r.left)/r.width*2-1,-((e.clientY-r.top)/r.height)*2+1),camera);const hit=ray.intersectObjects(facility.children,true)[0];let object=hit?.object;while(object&&!object.userData.id)object=object.parent!;if(object?.userData.kind==='bin')onSelect(object.userData.id)};
  renderer.domElement.addEventListener('pointerdown',pointerdown);renderer.domElement.addEventListener('pointerup',select);renderer.setAnimationLoop(()=>{controls.update();renderer.render(scene,camera)});
  const lost=(e:Event)=>{e.preventDefault();setError('3B görüntü bağlamı kesildi. Sayfayı yeniden yükleyin.')};renderer.domElement.addEventListener('webglcontextlost',lost);
  return()=>{pose.current={key:poseKey,position:camera.position.clone(),target:controls.target.clone()};renderer.setAnimationLoop(null);observer.disconnect();controls.dispose();renderer.domElement.removeEventListener('pointerdown',pointerdown);renderer.domElement.removeEventListener('pointerup',select);renderer.domElement.removeEventListener('webglcontextlost',lost);disposeModel(scene);renderer.dispose();renderer.domElement.remove()};
 },[inputs,layout,selected,onSelect,view,reset,grid]);
 return <div className="scene" ref={ref} aria-label="Etkileşimli üç boyutlu tahıl tesisi">{error&&<div className="scene-error">{error}</div>}</div>;
}

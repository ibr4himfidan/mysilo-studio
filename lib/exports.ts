import {GLTFExporter} from 'three/addons/exporters/GLTFExporter.js';
import {createFacility,disposeModel} from './models';
import {downloadBlob} from './project';
import type {Inputs,Layout} from './planner';
export async function exportFacility(inputs:Inputs,layout:Layout){
 const model=createFacility(inputs,layout,'');
 model.userData={...model.userData,units:'meters',purpose:'Conceptual predesign. No engineering certification.',projectName:inputs.name};
 try{const data=await new GLTFExporter().parseAsync(model,{binary:true});if(!(data instanceof ArrayBuffer))throw new Error('GLB üretilemedi.');downloadBlob(new Blob([data],{type:'model/gltf-binary'}),'silo-tesisi.glb')}finally{disposeModel(model)}
}

import {createBin,createEquipment} from './models';
import {manualItem} from './manual-models';
import {SITE_EQUIPMENT} from './site-equipment-catalog';
import {createItem} from './editor';
import {handlingIds,modelDefaults,type HandlingModel} from './handling-catalog';
import {binVolume,type Equipment} from './planner';
export function createAsset(id:string){
 if(id.startsWith('site:')){const kind=id.slice(5) as keyof typeof SITE_EQUIPMENT;if(!Object.hasOwn(SITE_EQUIPMENT,kind))throw new Error('Bilinmeyen varlık');return manualItem(createItem(kind))}
 if(id.startsWith('handling:')){const key=id.slice(9) as HandlingModel;if(!handlingIds.includes(key))throw new Error('Bilinmeyen varlık');const defaults=modelDefaults(key);return manualItem({...createItem(defaults.kind),...defaults,y:0})}
 if(id==='flat-bin'||id==='hopper-bin'){
  const type=id==='flat-bin'?'flat':'hopper',d=type==='flat'?12.83:8.25,h=type==='flat'?10.14:6.76,volume=binVolume(d,h,type);
  return createBin({id,x:0,z:0,diameter:d,height:h,peak:h+d/2*Math.tan(28*Math.PI/180)+(type==='hopper'?d/2+2.5:.4),capacity:volume*.769,volume,type});
 }
 const presets:Record<string,{type:Equipment['type'];width:number;depth:number;height:number}>={elevator:{type:'elevator',width:3,depth:3,height:24},dryer:{type:'dryer',width:7,depth:9,height:17},cleaner:{type:'cleaner',width:5,depth:5,height:6},intake:{type:'intake',width:12,depth:5,height:5.1},wetbin:{type:'wetbin',width:6,depth:6,height:12.1},office:{type:'office',width:9,depth:6,height:3.5}};
 const p=presets[id];if(!p)throw new Error('Bilinmeyen varlık');return createEquipment({id,name:id,x:0,z:0,...p});
}

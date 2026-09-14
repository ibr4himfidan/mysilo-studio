import {itemTop,type Item,type Project} from './editor';
import {walkwayLaydown,type BuildStage} from './installation';
const smooth=(v:number)=>{const p=Math.max(0,Math.min(1,v));return p*p*(3-2*p)};
const lerp=(a:number,b:number,t:number)=>a+(b-a)*t;
export function walkwayPose(p:Project,i:Item,stage:BuildStage,progress:number,bay=walkwayLaydown(p,i)){
 if(!bay)return{x:i.x,y:i.y,z:i.z,rotation:i.rotation};
 const start={x:bay.x,y:.85,z:bay.z,rotation:bay.rotation};
 if(stage==='walkwayAssembly'||stage==='walkwayRigging'||stage==='queued')return start;
 if(stage!=='walkwayLifting')return{x:i.x,y:i.y,z:i.z,rotation:i.rotation};
 // Lift clear of every roof before slewing; only then lower onto the supports.
 const clearance=Math.max(i.y,...p.items.filter(other=>other.kind!=='walkway').map(itemTop))+4;
 if(progress<.35)return{...start,y:lerp(start.y,clearance,smooth(progress/.35))};
 if(progress<.8){const q=smooth((progress-.35)/.45);return{x:lerp(start.x,i.x,q),y:clearance,z:lerp(start.z,i.z,q),rotation:lerp(start.rotation,i.rotation,q)}}
 return{x:i.x,y:lerp(clearance,i.y,smooth((progress-.8)/.2)),z:i.z,rotation:i.rotation};
}

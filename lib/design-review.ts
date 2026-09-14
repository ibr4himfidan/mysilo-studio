import {isSilo,type Project,type Item} from './editor';
import {designBasis,toCoast,portFrame} from './site-context';
export function roofSnowForce(p:Project){const d=designBasis(p);if(d.snowLoad===null)return null;const area=p.items.filter(isSilo).reduce((sum,i)=>sum+(i.kind==='square'?i.width*i.depth:Math.PI*i.width*i.width/4),0);return area*d.snowLoad}
export function missingDesignInputs(p:Project){const d=designBasis(p);return ['location','standard','snowLoad','windSpeed','seismicPga','soilBearing','corrosion'].filter(k=>{const v=d[k as keyof typeof d];return v===null||v===''||v==='unknown'})}
export function loaderTip(i:Item){const a=i.rotation*Math.PI/180;return{x:i.x+Math.cos(a)*i.width,z:i.z-Math.sin(a)*i.width}}
export function reachesVessel(p:Project,i:Item){if(p.facility!=='port'||i.kind!=='shiploader'||!i.model)return false;const f=portFrame(p),tip=toCoast(p,loaderTip(i)),usable=f.shipLength-f.shipBeam*1.5,cell=usable/f.hatches,hatch=Math.max(2,cell-2);return Array.from({length:f.hatches},(_,n)=>-f.shipLength/2+f.shipBeam*.8+(n+.5)*cell).some(x=>Math.abs(tip.x-x)<=hatch/2&&Math.abs(tip.z-f.shipZ)<=f.shipBeam*.33)}

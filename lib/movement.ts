import {validItem,itemIssue,type Item,type Project} from './editor';
import {accessIssue} from './access-network';
import {buildBusy} from './installation';
import type {TextKey} from './i18n';
export type MoveScope='linked'|'facility';
export function movementIds(p:Project,id:string,scope:MoveScope='linked'){
 const ids=new Set<string>();if(!p.items.some(i=>i.id===id))return ids;
 if(scope==='facility')return new Set(p.items.map(i=>i.id));ids.add(id);
 // Roof-centred paths, aligned silo rows and elevator access are one assembly.
 let changed=true;while(changed){changed=false;for(const i of p.items){const neighbours=[...(i.anchor?.siloIds||[]),...(i.access?.walkwayIds||[]),...i.layout?p.items.filter(s=>s.layout?.group===i.layout!.group).map(s=>s.id):[]];if(ids.has(i.id)||neighbours.some(n=>ids.has(n)))for(const n of [i.id,...neighbours])if(!ids.has(n)&&p.items.some(i=>i.id===n)){ids.add(n);changed=true}}}
 return ids;
}
export function movementPreview(p:Project,id:string,x:number,z:number,scope:MoveScope='linked'):{items:Item[];moving:Item[];issue:TextKey|null}{
 const source=p.items.find(i=>i.id===id);if(!source||!Number.isFinite(x)||!Number.isFinite(z))return{items:p.items,moving:[],issue:'invalid'};
 const ids=movementIds(p,id,scope),dx=x-source.x,dz=z-source.z,items=p.items.map(i=>ids.has(i.id)?{...i,x:i.x+dx,z:i.z+dz}:i),moving=items.filter(i=>ids.has(i.id));
 const issue=buildBusy(p)?'buildingBusy':moving.some(i=>!validItem(i))?'invalid':moving.map(i=>itemIssue({...p,items},i)).find(Boolean)||accessIssue({...p,items});return{items,moving,issue:issue||null};
}
export function moveItems(p:Project,id:string,x:number,z:number,scope:MoveScope='linked'){
 const result=movementPreview(p,id,x,z,scope);if(result.issue)throw new Error(result.issue);return result.items;
}

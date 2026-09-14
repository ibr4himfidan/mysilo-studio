import {EQUIPMENT_KINDS,isSilo,validItem,itemIssue,corners,type EquipmentJob,type EquipmentKind,type Item,type Project} from './editor';
import {buildBusy,walkwayLaydown} from './installation';
import {accessIssue,connectElevator,elevatorAccessDecks} from './access-network';
import {workingGround} from './site-context';
// The longest component is assembled horizontally beside the crane.
export function equipmentLaydown(p:Project,i:Item){
 const span=Math.hypot(i.width,i.depth,i.height+(i.rise||0)),angle=i.rotation*Math.PI/180,accessDepth=i.access?Math.max(0,...elevatorAccessDecks(p.items).filter(d=>d.id.startsWith(`access:${i.id}:`)).map(d=>{const z=corners(d).map(c=>c.z);return Math.max(...z)-Math.min(...z)})):0;
 const proxy={...i,kind:'walkway' as const,width:span,depth:Math.max(1.5,accessDepth,Math.abs(Math.sin(angle))*i.width+Math.abs(Math.cos(angle))*i.depth),rotation:0};
 const ground=workingGround(p),items=p.items.filter(other=>other.id!==i.id).concat(i.y<3&&i.kind!=='conveyor'?[i]:[]).map(item=>({...item,x:item.x-ground.x,z:item.z-ground.z}));
 const bay=walkwayLaydown({...p,width:ground.width,depth:ground.depth,items},proxy,{x:i.x-ground.x,z:i.z-ground.z});
 return bay?{...bay,x:bay.x+ground.x,z:bay.z+ground.z,crane:{x:bay.crane.x+ground.x,z:bay.crane.z+ground.z}}:null;
}
function startJob(p:Project,items:Item[],job:EquipmentJob):Project{
 if(buildBusy(p))throw new Error('buildingBusy');const i=items.find(i=>i.id===job.id)!;
 const issue=accessIssue({...p,items});if(issue)throw new Error(issue);
 if(!equipmentLaydown({...p,items},i))throw new Error('assemblySpace');
 return{...p,items,construction:{timeline:2,siloIds:[],walkwayIds:[],equipmentJobs:[job],elapsed:0,paused:false,speed:p.construction?.speed||1},updatedAt:new Date().toISOString()};
}
export function instantiateEquipment(p:Project,input:Item):Project{
 if(!validItem(input)||!EQUIPMENT_KINDS.includes(input.kind as EquipmentKind))throw new Error('invalid');
 if(p.items.length>=150)throw new Error('limit');if(p.items.some(i=>i.id===input.id))throw new Error('invalid');
 const {access,...i}=input,issue=itemIssue(p,i);if(issue)throw new Error(issue);
 return startJob(p,[...p.items,i],{id:i.id,kind:i.kind as EquipmentKind,mode:'install'});
}
export function instantiateAccess(p:Project,id:string):Project{
 if(buildBusy(p))throw new Error('buildingBusy');const items=connectElevator(p,id);return startJob(p,items,{id,kind:'elevator',mode:'access'});
}
export function replayEquipment(p:Project,id:string):Project{
 if(buildBusy(p))throw new Error('buildingBusy');const i=p.items.find(i=>i.id===id);if(!i||isSilo(i))throw new Error('invalid');
 if(i.kind==='walkway'){const walks=p.items.filter(i=>i.kind==='walkway');for(const walk of walks)if(!walkwayLaydown(p,walk))throw new Error('assemblySpace');return{...p,construction:{timeline:2,siloIds:[],walkwayIds:walks.map(w=>w.id),elapsed:0,paused:false,speed:p.construction?.speed||1},updatedAt:new Date().toISOString()}}
 return startJob(p,p.items,{id,kind:i.kind as EquipmentKind,mode:'install'});
}

import type {EquipmentJob,EquipmentKind} from './editor';
import type {BuildStage} from './installation';
export type EquipmentPhase={stage:BuildStage;seconds:number};
const phase=(stage:BuildStage,seconds:number):EquipmentPhase=>({stage,seconds});
const prepare=phase('sitePreparation',3),anchors=phase('baseAnchoring',4),test=phase('commissioning',3);
export const EQUIPMENT_PHASES:Record<EquipmentKind,EquipmentPhase[]>={
 elevator:[prepare,anchors,phase('frameAssembly',5),phase('moduleLifting',9),phase('driveAssembly',4),test],
 building:[prepare,phase('foundation',4),phase('frameAssembly',7),phase('panelAssembly',8),test],
 tower:[prepare,anchors,phase('frameAssembly',6),phase('moduleLifting',7),phase('finishing',3),test],
 conveyor:[prepare,phase('frameAssembly',6),phase('moduleLifting',8),phase('driveAssembly',3),test],
 intake:[prepare,phase('excavating',5),phase('foundation',4),phase('moduleLifting',6),phase('panelAssembly',5),test],
 dryer:[prepare,anchors,phase('frameAssembly',5),phase('moduleLifting',8),phase('driveAssembly',4),test],
 cleaner:[prepare,anchors,phase('moduleLifting',7),phase('driveAssembly',4),test],
 shiploader:[prepare,anchors,phase('frameAssembly',6),phase('moduleLifting',9),phase('driveAssembly',4),test],
};
const ACCESS_PHASES=[prepare,phase('frameAssembly',5),phase('moduleLifting',9),phase('walkwayFixing',3),test];
export const equipmentPhases=(job:EquipmentJob)=>job.mode==='access'?ACCESS_PHASES:EQUIPMENT_PHASES[job.kind];
export const equipmentDuration=(job:EquipmentJob)=>equipmentPhases(job).reduce((sum,p)=>sum+p.seconds,0);
export function equipmentStage(job:EquipmentJob,seconds:number):{stage:BuildStage;progress:number}{
 if(seconds<0)return{stage:'queued',progress:0};let start=0;
 for(const p of equipmentPhases(job)){if(seconds<start+p.seconds)return{stage:p.stage,progress:Math.max(0,Math.min(1,(seconds-start)/p.seconds))};start+=p.seconds}
 return{stage:'complete',progress:1};
}

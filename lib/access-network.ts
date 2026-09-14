import {itemIssue,itemTop,type Item,type Project} from './editor';
import type {TextKey} from './i18n';
const clamp=(v:number,a:number,b:number)=>Math.max(a,Math.min(b,v));
function nearest(w:Item,e:Item){const a=w.rotation*Math.PI/180,c=Math.cos(a),s=Math.sin(a),local=(e.x-w.x)*c-(e.z-w.z)*s,u=clamp(local,-w.width/2+Math.min(.65,w.width/2),w.width/2-Math.min(.65,w.width/2));return{x:w.x+u*c,z:w.z-u*s}}
function deck(id:string,x:number,z:number,y:number,width:number,depth:number,rotation=0):Item{return{id,kind:'walkway',x,z,y,width,depth,rotation,height:1.2}}
export function elevatorAccessDecks(items:Item[],onlyId?:string):Item[]{const result:Item[]=[];
 for(const e of items.filter(i=>i.kind==='elevator'&&i.access&&(!onlyId||i.id===onlyId))){const walks=e.access!.walkwayIds.map(id=>items.find(i=>i.id===id&&i.kind==='walkway')).filter((i):i is Item=>!!i);if(!walks.length)continue;
  const y=walks[0].y,rad=e.rotation*Math.PI/180,W=Math.abs(Math.cos(rad))*e.width+Math.abs(Math.sin(rad))*e.depth+3,D=Math.abs(Math.sin(rad))*e.width+Math.abs(Math.cos(rad))*e.depth+3,lane=1.5,key=`access:${e.id}:`;
  // Four separate deck strips leave an opening for the elevator casing and tower.
  for(const [level,levelY] of [['service',y],...e.y+e.height-1.8>y+1.5?[['head',e.y+e.height-1.8] as const]:[]] as const)for(const side of [-1,1]){result.push(deck(key+level+'-platform-z'+side,e.x,e.z+side*(D-lane)/2,levelY,W,lane));result.push(deck(key+level+'-platform-x'+side,e.x+side*(W-lane)/2,e.z,levelY,D-2*lane,lane,90))}
  walks.forEach((w,n)=>{const target=nearest(w,e),dx=target.x-e.x,dz=target.z-e.z,exitZ=Math.abs(dz)/D>=Math.abs(dx)/W;
   const start=exitZ?{x:e.x,z:e.z+Math.sign(dz||1)*D/2}:{x:e.x+Math.sign(dx||1)*W/2,z:e.z};
   const bend=exitZ?{x:e.x,z:target.z}:{x:target.x,z:e.z},points=[start,bend,target];
   for(let k=0;k<2;k++){const a=points[k],b=points[k+1],length=Math.hypot(a.x-b.x,a.z-b.z);if(length<.05)continue;const alongX=Math.abs(a.x-b.x)>.01;
    // Half a deck width of overlap at bends makes a continuous right-angle landing.
    result.push(deck(key+`bridge-${n}-${k}`,(a.x+b.x)/2,(a.z+b.z)/2,y,length+lane,lane,alongX?0:90));
   }
  });
 }
 return result;
}
export function pruneAccess(items:Item[]):Item[]{return items.map(i=>{if(!i.access)return i;const walkwayIds=i.access.walkwayIds.filter(id=>items.some(w=>w.id===id&&w.kind==='walkway'));const {access,...rest}=i;return walkwayIds.length?{...rest,access:{walkwayIds}}:rest})}
export function accessIssue(p:Pick<Project,'items'|'width'|'depth'|'site'>):TextKey|null{
 for(const e of p.items.filter(i=>i.kind==='elevator'&&i.access)){
  const targets=e.access!.walkwayIds.map(id=>p.items.find(w=>w.id===id&&w.kind==='walkway'));if(targets.some(w=>!w))return'connectionMissing';const walks=targets as Item[];
  if(walks.some(w=>Math.abs(w.y-walks[0].y)>.08||w.y<e.y+1||w.y+1.5>itemTop(e)))return'connectionHeight';
  if(walks.some(w=>{const n=nearest(w,e);return Math.hypot(n.x-e.x,n.z-e.z)>12}))return'connectionDistance';
  const parts=elevatorAccessDecks(p.items,e.id),otherParts=elevatorAccessDecks(p.items).filter(i=>!i.id.startsWith(`access:${e.id}:`));
  for(const part of parts){const issue=itemIssue({...p,items:[...p.items.filter(i=>i.id!==e.id&&(i.kind!=='walkway'||Math.abs(i.y-part.y)>.08)),...otherParts]},part);if(issue)return issue}
 }
 return null;
}
export function connectElevator(p:Project,id:string):Item[]{
 const e=p.items.find(i=>i.id===id&&i.kind==='elevator');if(!e)throw new Error('invalid');
 const candidates=p.items.filter(i=>i.kind==='walkway').map(w=>{const pos=nearest(w,e);return{w,distance:Math.hypot(e.x-pos.x,e.z-pos.z)}}).sort((a,b)=>a.distance-b.distance);
 if(!candidates.length)throw new Error('connectionMissing');if(candidates[0].distance>12)throw new Error('connectionDistance');
 const chosen=candidates.filter(v=>v.distance<=12&&v.distance<=candidates[0].distance+3&&Math.abs(v.w.y-candidates[0].w.y)<.08).slice(0,2);
 const items=p.items.map(i=>i.id===id?{...i,access:{walkwayIds:chosen.map(v=>v.w.id)}}:i),issue=accessIssue({...p,items});if(issue)throw new Error(issue);return items;
}

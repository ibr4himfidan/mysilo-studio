import {createItem,isSilo,itemIssue,itemTop,siteSettings,validItem,validSite,type Item,type Project,type Construction} from './editor';
import {equipmentDuration,equipmentStage} from './equipment-timeline';
import {pruneAccess} from './access-network';
import type {TextKey} from './i18n';
export type BuildStage='sitePreparation'|'baseAnchoring'|'frameAssembly'|'moduleLifting'|'panelAssembly'|'driveAssembly'|'commissioning'|'queued'|'excavating'|'foundation'|'aeration'|'roofAssembly'|'jackLifting'|'finishing'|'walkwayAssembly'|'walkwayRigging'|'walkwayLifting'|'walkwayFixing'|'complete';
export const PHASE_SECONDS={excavation:3,foundation:4,aeration:4,roof:3,lift:12,finish:2,walkwayAssembly:5,walkwayRigging:2,walkwayLifting:8,walkwayFixing:2};
const walkwaySeconds=17;
export function baseBuildSeconds(c:Construction){return c.timeline===2?2+c.siloIds.length*24+(c.aerationIds?.length||0)*4+c.walkwayIds.length*walkwaySeconds:2+c.siloIds.length*22+(c.walkwayIds.length?5:0)}
export function totalBuildSeconds(c:Construction){return baseBuildSeconds(c)+(c.equipmentJobs||[]).reduce((sum,j)=>sum+equipmentDuration(j),0)}
export function constructionStage(c:Construction|undefined,id:string,elapsed=c?.elapsed||0):{stage:BuildStage;progress:number}{
 if(!c)return{stage:'complete',progress:1};
 const jobIndex=c.equipmentJobs?.findIndex(j=>j.id===id)??-1;if(jobIndex>=0){const start=baseBuildSeconds(c)+c.equipmentJobs!.slice(0,jobIndex).reduce((sum,j)=>sum+equipmentDuration(j),0);return equipmentStage(c.equipmentJobs![jobIndex],elapsed-start)}
 const modern=c.timeline===2,count=c.siloIds.length,index=c.siloIds.indexOf(id),pourSeconds=modern?4:2,airIds=modern?c.aerationIds||[]:[],civilEnd=2+count*(3+pourSeconds)+airIds.length*4;
 const stage=(name:BuildStage,start:number,duration:number)=>({stage:name,progress:Math.max(0,Math.min(1,(elapsed-start)/duration))});
 const wi=c.walkwayIds.indexOf(id);
 if(wi>=0){const start=civilEnd+count*17+(modern?wi*walkwaySeconds:0);if(elapsed<start)return{stage:'queued',progress:0};
  if(!modern)return elapsed<start+5?stage('walkwayAssembly',start,5):{stage:'complete',progress:1};
  let at=start;for(const [name,duration] of [['walkwayAssembly',5],['walkwayRigging',2],['walkwayLifting',8],['walkwayFixing',2]] as const){if(elapsed<at+duration)return stage(name,at,duration);at+=duration}return{stage:'complete',progress:1};
 }
 if(index<0)return{stage:'complete',progress:1};
 const dig=2+index*3,pour=2+count*3+index*pourSeconds,air=2+count*(3+pourSeconds)+airIds.indexOf(id)*4,roof=civilEnd+index*17;
 if(elapsed<dig)return{stage:'queued',progress:0};if(elapsed<dig+3)return stage('excavating',dig,3);
 if(elapsed<pour)return{stage:'excavating',progress:1};if(elapsed<pour+pourSeconds)return stage('foundation',pour,pourSeconds);
 if(airIds.includes(id)){if(elapsed<air)return{stage:'foundation',progress:1};if(elapsed<air+4)return stage('aeration',air,4)}
 if(elapsed<roof)return{stage:airIds.includes(id)?'aeration':'foundation',progress:1};if(elapsed<roof+3)return stage('roofAssembly',roof,3);
 if(elapsed<roof+15)return stage('jackLifting',roof+3,12);if(elapsed<roof+17)return stage('finishing',roof+15,2);
 return{stage:'complete',progress:1};
}
export function buildBusy(p:Project){return !!p.construction&&p.construction.elapsed<totalBuildSeconds(p.construction)}
export function advanceConstruction(c:Construction,seconds:number):Construction{return c.paused?c:{...c,elapsed:Math.min(totalBuildSeconds(c),c.elapsed+Math.max(0,seconds)*c.speed)}}
export function activeStage(p:Project):BuildStage{const c=p.construction;if(!c||c.elapsed>=totalBuildSeconds(c))return'complete';return [...c.siloIds,...c.walkwayIds,...(c.equipmentJobs||[]).map(j=>j.id)].map(id=>constructionStage(c,id)).find(s=>s.stage!=='queued'&&s.stage!=='complete'&&s.progress<1)?.stage||'queued'}
export function roofWalkways(p:Project,silos=p.items.filter(isSilo)):Item[]{
 if(!silos.length)return[];
 // Shared deck elevation and orthogonal centre lines keep every branch connected.
 const site=siteSettings(p),deck=Math.max(...silos.map(itemTop))+.6,rows=[...new Set(silos.map(i=>i.z))].sort((a,b)=>a-b),spineX=Math.min(...silos.map(i=>i.x)),walkways:Item[]=[];
 const make=(x:number,z:number,length:number,axis:'x'|'z',ids:string[])=>({...createItem('walkway',x,z),width:Math.max(1,length),y:deck,rotation:axis==='x'?0:90,anchor:{axis,siloIds:ids}});
 for(const z of rows){const row=silos.filter(i=>i.z===z).sort((a,b)=>a.x-b.x);const left=Math.min(spineX,row[0].x-row[0].width/2-site.walkwayOverhang),right=row.at(-1)!.x+row.at(-1)!.width/2+site.walkwayOverhang;walkways.push(make((left+right)/2,z,right-left,'x',row.map(i=>i.id)))}
 if(rows.length>1)walkways.push(make(spineX,(rows[0]+rows.at(-1)!)/2,rows.at(-1)!-rows[0],'z',silos.filter(i=>i.x===spineX).map(i=>i.id)));
 return walkways;
}
export function reflowWalkways(p:Project,items:Item[]){if(!p.items.some(i=>i.kind==='walkway'&&i.anchor))return pruneAccess(items);const kept=items.filter(i=>!(i.kind==='walkway'&&i.anchor)),previous=p.items.filter(i=>i.kind==='walkway'&&i.anchor),used=new Set<string>();const routes=roofWalkways({...p,items:kept}).map(route=>{const match=previous.find(w=>!used.has(w.id)&&w.anchor!.axis===route.anchor!.axis&&w.anchor!.siloIds.some(id=>route.anchor!.siloIds.includes(id)));if(match){used.add(match.id);return{...route,id:match.id}}return route});return pruneAccess([...kept,...routes])}
export type BatchOptions={count:number;columns:number};
export function planSiloBatch(p:Project,template:Item,options:BatchOptions):{items:Item[];silos:Item[];error:TextKey|null}{
 const fail=(error:TextKey)=>({items:[],silos:[],error});
 if(!validItem(template)||!isSilo(template)||!validSite(siteSettings(p))||siteSettings(p).setback<1||!Number.isInteger(options.count)||options.count<1||options.count>60||!Number.isInteger(options.columns)||options.columns<1||options.columns>options.count)return fail('invalid');
 const site=siteSettings(p),cols=options.columns,rows=Math.ceil(options.count/cols),pitchX=template.width+2*site.foundationApron+site.siloGap,pitchZ=template.depth+2*site.foundationApron+site.siloGap,group='layout-preview';
 const silos=Array.from({length:options.count},(_,n)=>({...template,id:`silo-preview-${n}`,x:(n%cols-(cols-1)/2)*pitchX,z:(Math.floor(n/cols)-(rows-1)/2)*pitchZ,y:0,rotation:0,layout:{group,row:Math.floor(n/cols),column:n%cols}}));
 const retained=pruneAccess(p.items.filter(i=>!isSilo(i)&&i.kind!=='walkway'));const all=[...retained,...silos];
 for(const silo of silos){const issue=itemIssue({...p,items:all},silo);if(issue)return fail(issue)}
 if(all.length>150)return fail('limit');for(const walkway of all.filter(i=>i.kind==='walkway')){if(!validItem(walkway))return fail('invalid');const issue=itemIssue({...p,items:all},walkway);if(issue)return fail(issue)}
 return{items:all,silos,error:null};
}
export function instantiateBatch(p:Project,template:Item,options:BatchOptions):Project{
 const planned=planSiloBatch(p,template,options);if(planned.error)throw new Error(planned.error);
 const group=crypto.randomUUID(),ids=new Map(planned.silos.map(i=>[i.id,crypto.randomUUID()]));
 const items=planned.items.map(i=>({...i,id:ids.get(i.id)||i.id,...(i.layout?{layout:{...i.layout,group}}:{}),...(i.anchor?{anchor:{...i.anchor,siloIds:i.anchor.siloIds.map(id=>ids.get(id)||id)}}:{})}));
 return{...p,items,construction:{timeline:2,aerationIds:items.filter(i=>['flat','industrial'].includes(i.kind)).map(i=>i.id),elapsed:0,paused:false,speed:p.construction?.speed||1,siloIds:items.filter(isSilo).map(i=>i.id),walkwayIds:[]},updatedAt:new Date().toISOString()};
}
export function alignSiloChange(p:Project,next:Item):Item[]{
 const original=p.items.find(i=>i.id===next.id);if(!original)return p.items;
 if(!isSilo(original))return reflowWalkways(p,p.items.map(i=>i.id===next.id?next:i));
 const members=p.items.filter(i=>isSilo(i)&&(original.layout?i.layout?.group===original.layout.group:true));
 const dx=next.x-original.x,dz=next.z-original.z,site=siteSettings(p);
 return reflowWalkways(p,p.items.map(i=>{if(!members.some(m=>m.id===i.id))return i;const x=original.layout&&i.layout?next.x+(i.layout.column-original.layout.column)*(next.width+2*site.foundationApron+site.siloGap):i.x+dx,z=original.layout&&i.layout?next.z+(i.layout.row-original.layout.row)*(next.depth+2*site.foundationApron+site.siloGap):i.z+dz;return{...i,x,z,width:next.width,depth:next.depth,height:next.height,y:next.y,rotation:0}}));
}

// An assembly bay includes the deck, working space and the crane's outriggers.
// Its footprint must fit on the parcel without covering existing ground equipment.
export function walkwayLaydown(p:Project,walk:Item,near?:{x:number;z:number}){
 const apron=siteSettings(p).foundationApron;
 const occupied=p.items.filter(i=>i.kind!=='walkway'&&i.y<3).map(i=>{const rad=i.rotation*Math.PI/180,halfX=(Math.abs(Math.cos(rad))*i.width+Math.abs(Math.sin(rad))*i.depth)/2+(isSilo(i)?apron:0),halfZ=(Math.abs(Math.sin(rad))*i.width+Math.abs(Math.cos(rad))*i.depth)/2+(isSilo(i)?apron:0);return{left:i.x-halfX,right:i.x+halfX,back:i.z-halfZ,front:i.z+halfZ}});
 for(const rotation of [walk.rotation,walk.rotation===0?90:0]){
  const alongX=rotation===0,hx=(alongX?Math.max(9,walk.width+3):walk.depth+11)/2,hz=(alongX?walk.depth+11:Math.max(9,walk.width+3))/2;
  const left=-p.width/2+1+hx,right=p.width/2-1-hx,back=-p.depth/2+1+hz,front=p.depth/2-1-hz;
  if(left>right||back>front)continue;
  const a=rotation*Math.PI/180,wanted=near?{x:near.x+Math.sin(a)*3,z:near.z+Math.cos(a)*3}:undefined;
  const xs=[...(wanted?[wanted.x]:[]),0,left,right,...occupied.flatMap(o=>[o.left-hx-1,o.right+hx+1])].filter(x=>x>=left&&x<=right),zs=[...(wanted?[wanted.z]:[]),front,back,0,...occupied.flatMap(o=>[o.front+hz+1,o.back-hz-1])].filter(z=>z>=back&&z<=front).sort((a,b)=>b-a);
  const candidates=zs.flatMap(z=>xs.map(x=>({x,z})));if(wanted)candidates.sort((a,b)=>Math.hypot(a.x-wanted.x,a.z-wanted.z)-Math.hypot(b.x-wanted.x,b.z-wanted.z));
  for(const {x,z} of candidates){if(occupied.some(o=>x+hx>o.left&&x-hx<o.right&&z+hz>o.back&&z-hz<o.front))continue;
   const a=rotation*Math.PI/180,offset=(v:number)=>({x:x+Math.sin(a)*v,z:z+Math.cos(a)*v});
   return{...offset(-3),rotation,crane:offset(walk.depth/2+1.5)};
  }
 }
 return null;
}
export function instantiateWalkways(p:Project):Project{
 if(buildBusy(p))throw new Error('buildingBusy');
 if(!p.items.some(isSilo))throw new Error('buildFirst');
 if(p.items.some(i=>i.kind==='walkway'))throw new Error('walkwaysExist');
 const walks=roofWalkways(p),items=[...p.items,...walks];
 if(items.length>150)throw new Error('limit');
 for(const w of walks){if(!validItem(w))throw new Error('invalid');const issue=itemIssue({...p,items},w);if(issue)throw new Error(issue);if(!walkwayLaydown(p,w))throw new Error('assemblySpace')}
 return{...p,items,construction:{timeline:2,aerationIds:[],elapsed:0,paused:false,speed:p.construction?.speed||1,siloIds:[],walkwayIds:walks.map(i=>i.id)},updatedAt:new Date().toISOString()};
}

import {type Item} from './editor';
export type Barrier={side:'left'|'right'|'front'|'back';start:number;end:number};
const toWorld=(i:Item,x:number,z:number)=>{const a=i.rotation*Math.PI/180;return{x:i.x+x*Math.cos(a)+z*Math.sin(a),z:i.z-x*Math.sin(a)+z*Math.cos(a)}};
function coveredInterval(i:Item,other:Item,side:Barrier['side']):[number,number]|null{
 const alongX=side==='front'||side==='back',sign=side==='front'||side==='right'?1:-1,half=alongX?i.width/2:i.depth/2;
 const point=(v:number)=>toWorld(i,alongX?v:sign*(i.width/2+.025),alongX?sign*(i.depth/2+.025):v);
 const start=point(0),end=point(1),a=other.rotation*Math.PI/180,c=Math.cos(a),s=Math.sin(a),ox=start.x-other.x,oz=start.z-other.z;
 const origins=[ox*c-oz*s,ox*s+oz*c],directions=[(end.x-start.x)*c-(end.z-start.z)*s,(end.x-start.x)*s+(end.z-start.z)*c],sizes=[other.width/2,other.depth/2];let low=-half,high=half;
 for(let n=0;n<2;n++){const o=origins[n],d=directions[n],size=sizes[n];if(Math.abs(d)<1e-8){if(Math.abs(o)>size-.005)return null}else{const t1=(-size-o)/d,t2=(size-o)/d;low=Math.max(low,Math.min(t1,t2));high=Math.min(high,Math.max(t1,t2));if(high-low<.01)return null}}
 return[low,high];
}
export function walkwayBarriers(i:Item,network:Item[]):Barrier[]{
 const result:Barrier[]=[];for(const side of ['left','right','front','back'] as const){const half=(side==='front'||side==='back'?i.width:i.depth)/2;let intervals:[number,number][]=[[-half,half]];
  for(const other of network){if(other.id===i.id||other.kind!=='walkway'||Math.abs(other.y-i.y)>.08)continue;const cut=coveredInterval(i,other,side);if(!cut)continue;const [lo,hi]=cut;intervals=intervals.flatMap(([a,b])=>hi<=a||lo>=b?[[a,b]]:[...(lo>a?[[a,lo] as [number,number]]:[]),...(hi<b?[[hi,b] as [number,number]]:[])]);}
  if(i.id.startsWith('access:')&&i.id.endsWith('-platform-x1')&&side==='front')intervals=intervals.flatMap(([a,b])=>b<=-.45||a>=.45?[[a,b]]:[...(a<-.45?[[a,-.45] as [number,number]]:[]),...(b>.45?[[.45,b] as [number,number]]:[])]);
  result.push(...intervals.filter(([a,b])=>b-a>.03).map(([start,end])=>({side,start,end})));
 }return result;
}

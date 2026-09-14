import * as T from 'three';
import {isSilo,siteSettings,corners,type Project} from './editor';
// Split each grid line around foundation footprints so no line floats over a pit.
export function siteGridPoints(p:Project){const points:T.Vector3[]=[],apron=siteSettings(p).foundationApron,silos=p.items.filter(i=>isSilo(i)||i.kind==='intake'&&i.y===0);
 for(const axis of ['x','z'] as const){const other=axis==='x'?'z':'x',length=axis==='x'?p.width:p.depth,cross=axis==='x'?p.depth:p.width;
  for(let at=Math.ceil(-cross/10)*5;at<=cross/2;at+=5){let spans:[number,number][]=[[-length/2,length/2]];
   for(const i of silos){const delta=at-i[other],rx=i.width/2+apron+.06,rz=i.depth/2+apron+.06,crossRadius=axis==='x'?rz:rx,alongRadius=axis==='x'?rx:rz;if(i.kind!=='intake'&&Math.abs(delta)>=crossRadius)continue;
    if(i.kind==='intake'){const poly=corners(i),hits:number[]=[];for(let n=0;n<poly.length;n++){const a=poly[n],b=poly[(n+1)%poly.length];if((a[other]<=at&&b[other]>at)||(b[other]<=at&&a[other]>at))hits.push(a[axis]+(b[axis]-a[axis])*(at-a[other])/(b[other]-a[other]))}if(hits.length>=2){const lo=Math.min(...hits)-.04,hi=Math.max(...hits)+.04;spans=spans.flatMap(([a,b])=>hi<=a||lo>=b?[[a,b]]:[...(a<lo?[[a,lo] as [number,number]]:[]),...(hi<b?[[hi,b] as [number,number]]:[])])}continue}
    const half=i.kind==='square'?alongRadius:alongRadius*Math.sqrt(1-(delta/crossRadius)**2),lo=i[axis]-half,hi=i[axis]+half;
    spans=spans.flatMap(([a,b])=>hi<=a||lo>=b?[[a,b]]:([...a<lo?[[a,lo]]:[],...hi<b?[[hi,b]]:[]] as [number,number][]));
   }
   for(const [a,b] of spans)points.push(new T.Vector3(axis==='x'?a:at,.01,axis==='x'?at:a),new T.Vector3(axis==='x'?b:at,.01,axis==='x'?at:b));
  }
 }return points;
}
export function siteGrid(p:Project){return new T.LineSegments(new T.BufferGeometry().setFromPoints(siteGridPoints(p)),new T.LineBasicMaterial({color:0xcfd7dc}))}

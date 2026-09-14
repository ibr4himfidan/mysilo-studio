export type SiloType = 'flat' | 'hopper';
export type Inputs = {
 name: string; grain: string; density: number; capacity: number; width: number; depth: number;
 margin: number; gap: number; lots: number; siloType: SiloType; diameter: number;
 intake: number; hours: number; moistureIn: number; moistureOut: number;
 dryer: boolean; cleaner: boolean; aeration: boolean;
};
export const GRAINS = [
 {id:'wheat',name:'Buğday',density:769,moisture:13.5},
 {id:'corn',name:'Mısır',density:720,moisture:14},
 {id:'barley',name:'Arpa',density:640,moisture:12},
 {id:'soy',name:'Soya',density:720,moisture:12},
 {id:'sunflower',name:'Ayçiçeği',density:400,moisture:8},
 {id:'paddy',name:'Çeltik',density:510,moisture:13},
];
export const DIAMETERS = [4.58,5.5,6.41,7.33,8.25,9.16,10.08,11,12.83,14.66,16.49,18.33,21.99,25.66,27.49,32];
export const DEFAULTS:Inputs={name:'Anadolu Tahıl Tesisi',grain:'wheat',density:769,capacity:6000,width:120,depth:85,margin:5,gap:3,lots:6,siloType:'flat',diameter:0,intake:800,hours:10,moistureIn:16,moistureOut:13.5,dryer:true,cleaner:true,aeration:true};
export type Bin={id:string;x:number;z:number;diameter:number;height:number;peak:number;capacity:number;volume:number;type:SiloType};
export type Equipment={id:string;type:'intake'|'elevator'|'cleaner'|'dryer'|'wetbin'|'office';name:string;x:number;z:number;width:number;depth:number;height:number};
export type Layout={bins:Bin[];equipment:Equipment[];total:number;volume:number;diameter:number;height:number;coverage:number;flow:number;water:number;dryOutput:number;warnings:string[];valid:boolean;errors:string[];service:number;rotated:boolean};
export function validateInputs(p:Inputs):string[]{
 const rules:[keyof Inputs,number,number][]=[['density',200,1000],['capacity',50,100000],['width',20,600],['depth',20,600],['margin',1,30],['gap',1,20],['lots',1,36],['intake',10,20000],['hours',1,24],['moistureIn',5,40],['moistureOut',5,30]];
 const errors=rules.filter(([key,min,max])=>typeof p[key]!=='number'||!Number.isFinite(p[key])||(p[key] as number)<min||(p[key] as number)>max).map(([key])=>`Geçersiz sayısal alan: ${key}`);
 if(!GRAINS.some(g=>g.id===p.grain))errors.push('Ürün seçimi geçersiz.');
 if(!['flat','hopper'].includes(p.siloType))errors.push('Silo tipi geçersiz.');
 if(!Number.isInteger(p.lots))errors.push('Parti sayısı tam sayı olmalı.');
 if(p.diameter!==0&&!DIAMETERS.includes(p.diameter))errors.push('Çap katalog aralığında olmalı.');
 if(typeof p.name!=='string'||p.name.length>100)errors.push('Proje adı en fazla 100 karakter olmalı.');
 if(['dryer','cleaner','aeration'].some(k=>typeof p[k as keyof Inputs]!=='boolean'))errors.push('Ekipman seçimi geçersiz.');
 return errors;
}
export function binVolume(d:number,h:number,type:SiloType){
 // Usable predesign volume: 95% of cylinder + 28 degree grain cone, no compaction uplift.
 const r=d/2,top=r*Math.tan(28*Math.PI/180);
 return (Math.PI*r*r*h+Math.PI*r*r*top/3+(type==='hopper'?Math.PI*r*r*r/3:0))*.95;
}
export function plan(p:Inputs):Layout{
 const errors=validateInputs(p),flow=p.intake/p.hours;
 const water=p.moistureIn>p.moistureOut?flow*(p.moistureIn-p.moistureOut)/(100-p.moistureOut):0;
 const service=p.dryer?32:22;
 const base:Layout={bins:[],equipment:[],total:0,volume:0,diameter:0,height:0,coverage:0,flow,water,dryOutput:flow-water,warnings:[],valid:false,errors,service,rotated:false};
 if(errors.length)return base;
 const options:{score:number;bins:Bin[];d:number;h:number;rotated:boolean}[]=[];
 for(const rotated of [false,true]){
  const width=rotated?p.depth:p.width,depth=rotated?p.width:p.depth;
  if(width-2*p.margin<51||depth-2*p.margin-service<4.58)continue;
  for(const d of DIAMETERS.filter(d=>(!p.diameter||p.diameter===d)&&(p.siloType==='flat'||d<=11))){
   for(const h of p.siloType==='flat'?[8.45,10.14,11.83,13.52,15.21,16.9]:[5.07,6.76,8.45,10.14]){
    const volume=binVolume(d,h,p.siloType),capacity=volume*p.density/1000,count=Math.max(p.lots,Math.ceil(p.capacity/capacity));
    const cols=Math.floor((width-2*p.margin+p.gap)/(d+p.gap)),rows=Math.floor((depth-2*p.margin-service+p.gap)/(d+p.gap));
    if(count>cols*rows||count>36)continue;
    const useCols=Math.min(cols,Math.ceil(Math.sqrt(count*width/(depth-service))));
    const actualCols=Math.max(useCols,Math.ceil(count/rows)),actualRows=Math.ceil(count/actualCols);
    const startX=-(actualCols*d+(actualCols-1)*p.gap)/2+d/2,startZ=-depth/2+p.margin+d/2;
    const bins=Array.from({length:count},(_,i)=>{const x=startX+(i%actualCols)*(d+p.gap),z=startZ+Math.floor(i/actualCols)*(d+p.gap);return{id:`S-${String(i+1).padStart(2,'0')}`,x:rotated?z:x,z:rotated?x:z,diameter:d,height:h,peak:h+d/2*Math.tan(28*Math.PI/180)+(p.siloType==='hopper'?d/2+2.5:.4),volume,capacity,type:p.siloType}});
    const score=(count*capacity/p.capacity-1)*120+count*1.7+(actualCols*d*actualRows*d)/(p.width*p.depth)*8+h*.05;
    options.push({score,bins,d,h,rotated});
   }
  }
 }
 options.sort((a,b)=>a.score-b.score);const best=options[0];
 if(!best)return{...base,errors:['Bu arsa ve ekipman alanında hedef kapasiteye uygun yerleşim bulunamadı. Arsayı büyütün; kapasite, parti sayısı veya sabit çapı değiştirin.']};
 const orientedDepth=best.rotated?p.width:p.depth,serviceZ=orientedDepth/2-p.margin-service/2;
 const eq:Equipment[]=[{id:'E-01',type:'intake',name:'Alım çukuru',x:-18,z:serviceZ+6,width:12,depth:5,height:5.1},{id:'E-02',type:'elevator',name:'Kovalı elevatör',x:-18,z:serviceZ-2,width:3,depth:3,height:Math.max(...best.bins.map(b=>b.peak))+4},{id:'E-06',type:'office',name:'Kontrol binası',x:20,z:serviceZ+5,width:9,depth:6,height:3.5}];
 if(p.cleaner)eq.push({id:'E-03',type:'cleaner',name:'Ön temizleyici',x:-7,z:serviceZ+2,width:5,depth:5,height:6});
 if(p.dryer)eq.push({id:'E-04',type:'dryer',name:'Kurutma kulesi',x:4,z:serviceZ-1,width:7,depth:9,height:17},{id:'E-05',type:'wetbin',name:'Yaş ürün tamponu',x:-7,z:serviceZ-8,width:6,depth:6,height:12.1});
 const equipment=eq.map(e=>best.rotated?{...e,x:e.z,z:e.x,width:e.depth,depth:e.width}:e),total=best.bins.reduce((s,b)=>s+b.capacity,0);
 const warnings=['Sınır mesafesi ve servis aralığı proje varsayımıdır; mevzuat uygunluğu hesaplanmaz.','Statik, zemin, deprem, yangın erişimi ve toz patlaması tasarımı ayrıca doğrulanmalı.'];
 if(!p.dryer&&water>0)warnings.unshift('Giriş nemi hedefin üzerinde; kurutma veya dışarıda şartlandırma gerekli.');
 if(!p.aeration)warnings.unshift('Havalandırma seçilmedi; ürün sıcaklığı ve depolama süresi ayrıca değerlendirilmeli.');
 if(p.moistureOut>p.moistureIn)warnings.unshift('Hedef nem giriş neminden yüksek. Bu model nemlendirme hesaplamaz.');
 if(p.grain==='sunflower'||p.grain==='paddy')warnings.unshift('Bu ürün için yoğunluk, akış ve kurutma reçetesi üreticiyle doğrulanmalı.');
 if(total>p.capacity*1.3)warnings.unshift('Parti veya çap kısıtı nedeniyle kapasite hedefin %30 üzerinde.');
 return{...base,bins:best.bins,equipment,total,volume:best.bins.reduce((s,b)=>s+b.volume,0),diameter:best.d,height:best.h,coverage:(best.bins.reduce((s,b)=>s+Math.PI*(b.diameter/2)**2,0)+equipment.reduce((s,e)=>s+e.width*e.depth,0))/(p.width*p.depth)*100,warnings,valid:true,rotated:best.rotated};
}
export const fmt=(n:number,digits=0)=>new Intl.NumberFormat('tr-TR',{maximumFractionDigits:digits}).format(Number.isFinite(n)?n:0);

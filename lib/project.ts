import {validateInputs,plan,type Inputs} from './planner';
export const STORAGE_KEY='silo-studio:project:v1';
export function decodeProject(raw:string):Inputs{
 if(raw.length>1_000_000)throw new Error('Proje dosyası 1 MB sınırını aşıyor.');
 const data=JSON.parse(raw);
 if(!data||data.version!==1||!data.inputs||typeof data.inputs!=='object')throw new Error('Silo Studio v1 proje dosyası bekleniyor.');
 const p=data.inputs as Inputs,errors=validateInputs(p);
 if(errors.length)throw new Error(errors.join(' '));
 // Only accepted fields survive; saved derived results are never trusted.
 const keys=['name','grain','density','capacity','width','depth','margin','gap','lots','siloType','diameter','intake','hours','moistureIn','moistureOut','dryer','cleaner','aeration'] as const;
 return Object.fromEntries(keys.map(k=>[k,p[k]])) as Inputs;
}
export function encodeProject(inputs:Inputs){return JSON.stringify({version:1,app:'Silo Studio',savedAt:new Date().toISOString(),units:{length:'m',mass:'metric tonne',density:'kg/m3',moisture:'percent wet basis'},inputs,layout:plan(inputs),method:'Conceptual geometry, 95% usable fill, 28 degree top pile, no compaction. Not an engineering approval.'},null,2)}
export function downloadBlob(blob:Blob,name:string){const a=document.createElement('a'),url=URL.createObjectURL(blob);a.href=url;a.download=name;a.hidden=true;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000)}

import type {ProjectRecord} from './business';
import type {Project} from './editor';
export class RequestError extends Error{constructor(public status:number,message:string){super(message)}}
export async function api<T>(path:string,method='GET',data?:unknown,keepalive=false):Promise<T>{let response:Response;try{response=await fetch('/api/'+path,{method,headers:data===undefined?{}:{'content-type':'application/json'},body:data===undefined?undefined:JSON.stringify(data),credentials:'same-origin',cache:'no-store',keepalive})}catch{throw new RequestError(0,'Bağlantı kurulamadı. Değişiklikler bu cihazda bekliyor.')}const result=await response.json() as T&{error?:string};if(!response.ok)throw new RequestError(response.status,result.error||'İşlem tamamlanamadı.');return result}
type Pending={project:Project;requestId:string;revision?:number;legacy?:boolean};
export type SaveState='saved'|'saving'|'error';
/** A durable, per-user outbox. Acknowledgements advance revisions, never optimistic writes. */
export class ProjectSync{
 private queue:Pending[]=[];private running:Promise<void>|null=null;private error:Error|null=null;private revisions=new Map<string,number>();
 private records=new Map<string,ProjectRecord>();
 private key:string;onState:(state:SaveState,error?:string)=>void=()=>{};onAck:(record:ProjectRecord)=>void=()=>{};
 constructor(userId:string,records:ProjectRecord[],private storage:Pick<Storage,'getItem'|'setItem'>){this.key=`mysilo:outbox:${userId}`;records.forEach(r=>{this.revisions.set(r.project.id,r.revision);this.records.set(r.project.id,r)});const raw=storage.getItem(this.key);if(raw){const q=JSON.parse(raw);if(Array.isArray(q))this.queue=q}}
 record(id:string){return this.records.get(id)}
 pending(){return this.queue.map(x=>x.project)}
 revision(id:string){return this.revisions.get(id)||0}
 private backup(){try{this.storage.setItem(this.key,JSON.stringify(this.queue))}catch{this.onState('error','Cihaz yedeği yazılamadı; veritabanı kaydı bekleniyor.')}}
 save(project:Project,legacy=false,force=false){const previous=this.queue.filter(p=>p.project.id===project.id).at(-1)?.project||this.records.get(project.id)?.project;const comparable=(p:Project)=>JSON.stringify({...p,updatedAt:''});if(!force&&previous&&comparable(previous)===comparable(project))return this.drain();this.queue.push({project:JSON.parse(JSON.stringify(project)),requestId:crypto.randomUUID(),legacy});try{this.backup()}catch{this.onState('error','Cihaz yedeği dolu; veritabanı kaydı bekleniyor.')}return this.drain()}
 drain(){if(this.running)return this.running;this.running=this.work().finally(()=>{this.running=null});return this.running}
 private async work(){this.error=null;while(this.queue.length){this.onState('saving');const next=this.queue[0];next.revision??=this.revision(next.project.id);try{this.backup();const record=await api<ProjectRecord>('projects/'+encodeURIComponent(next.project.id),'PUT',next);this.revisions.set(next.project.id,record.revision);this.records.set(next.project.id,record);this.queue.shift();this.backup();this.onAck(record)}catch(error){this.error=error as Error;this.onState('error',this.error.message);throw error}}this.onState('saved')}
 async flush(){await this.drain();if(this.error)throw this.error}
}

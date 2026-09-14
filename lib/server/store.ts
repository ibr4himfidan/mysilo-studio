import type {User,ProjectRecord,Region,Territory} from '../business';
import {ApiError,assert,cookieName,digest} from './security';
export type DBResult<T=unknown>={results:T[];meta:{changes:number}};
export interface DBStatement {bind(...args:unknown[]):DBStatement;first<T>():Promise<T|null>;all<T>():Promise<DBResult<T>>;run():Promise<DBResult>}
export interface DB {prepare(sql:string):DBStatement;batch(statements:DBStatement[]):Promise<DBResult[]>}
export const now=()=>new Date().toISOString();
export async function all<T>(db:DB,sql:string,...args:unknown[]):Promise<T[]>{return (await db.prepare(sql).bind(...args).all<T>()).results}
export async function first<T>(db:DB,sql:string,...args:unknown[]){return db.prepare(sql).bind(...args).first<T>()}
export const run=(db:DB,sql:string,...args:unknown[])=>db.prepare(sql).bind(...args).run();
export const stmt=(db:DB,sql:string,...args:unknown[])=>db.prepare(sql).bind(...args);
export async function authenticate(db:DB,request:Request){const raw=request.headers.get('cookie')?.split(';').map(s=>s.trim()).find(s=>s.startsWith(cookieName+'='))?.slice(cookieName.length+1);if(!raw)throw new ApiError(401,'Giriş yapmanız gerekiyor.');const u=await first<User>(db,'SELECT u.id,u.name,u.email,u.role,u.active FROM users u JOIN sessions s ON s.user_id=u.id WHERE s.token_hash=? AND s.expires_at>? AND u.active=1',digest(raw),Date.now());assert(u,'Oturum sona erdi. Tekrar giriş yapın.',401);return u}
export function admin(user:User){assert(user.role==='admin','Bu işlem için yönetici yetkisi gerekiyor.',403)}
export type ProjectRow={id:string;owner_id:string;sales_rep_id:string|null;data:string;revision:number;archived:number;country:string|null;region_id:string|null};
export const toRecord=(row:ProjectRow):ProjectRecord=>({project:JSON.parse(row.data),revision:row.revision,ownerId:row.owner_id,salesRepId:row.sales_rep_id,archived:row.archived});
export async function visibleProject(db:DB,user:User,id:string){const row=await first<ProjectRow>(db,'SELECT * FROM projects WHERE id=?',id);assert(row&&(user.role==='admin'||row.owner_id===user.id||row.sales_rep_id===user.id),'Proje bulunamadı.',404);return row}
export async function regionList(db:DB):Promise<Region[]>{return (await all<{id:string;country:string;name:string;data:string;revision:number;updated_at:string;updated_by:string}>(db,'SELECT * FROM regions ORDER BY country,name')).map(r=>({id:r.id,country:r.country,name:r.name,data:JSON.parse(r.data),revision:r.revision,updatedAt:r.updated_at,updatedBy:r.updated_by}))}
export const territoryList=(db:DB,activeOnly=true)=>all<Territory>(db,'SELECT t.key,t.continent,t.country,t.user_id AS userId FROM territories t JOIN users u ON u.id=t.user_id'+(activeOnly?' WHERE u.active=1':''));
export function audit(db:DB,userId:string,type:string,data:unknown,projectId:string|null=null,id=crypto.randomUUID()){return stmt(db,'INSERT INTO events(id,user_id,project_id,type,data,created_at) VALUES(?,?,?,?,?,?)',id,userId,projectId,type,JSON.stringify(data),now())}

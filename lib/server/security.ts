import {scrypt as nodeScrypt,randomBytes,createHash,timingSafeEqual} from 'node:crypto';
export class ApiError extends Error {constructor(public status:number,message:string){super(message)}}
export function assert(ok:unknown,message='Geçersiz veri.',status=400):asserts ok{if(!ok)throw new ApiError(status,message)}
export const digest=(s:string)=>createHash('sha256').update(s).digest('hex');
export const token=()=>randomBytes(32).toString('hex');
const derive=(password:string,salt:string)=>new Promise<Buffer>((resolve,reject)=>nodeScrypt(password,salt,32,{N:32768,r:8,p:3,maxmem:64*1024*1024},(error,key)=>error?reject(error):resolve(key)));
export async function hashPassword(password:string){assert(typeof password==='string'&&password.length>=12&&password.length<=128,'Şifre 12–128 karakter olmalı.');const salt=randomBytes(16).toString('hex');return `scrypt:32768:8:3:${salt}:${(await derive(password,salt)).toString('hex')}`}
export async function verifyPassword(password:string,stored:string){if(typeof password!=='string'||password.length>128)return false;const parts=stored.split(':');if(parts.length!==6)return false;const key=await derive(password,parts[4]),expected=Buffer.from(parts[5],'hex');return key.length===expected.length&&timingSafeEqual(key,expected)}
export function sameOrigin(request:Request){if(['GET','HEAD','OPTIONS'].includes(request.method))return;assert(request.headers.get('origin')===new URL(request.url).origin,'İstek kaynağı doğrulanamadı.',403);assert(request.headers.get('content-type')?.startsWith('application/json'),'JSON gerekli.',415)}
export const cookieName='mysilo_session';
export function sessionCookie(value:string,url:string,maxAge=8*3600){return `${cookieName}=${value}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${maxAge}${new URL(url).protocol==='https:'?'; Secure':''}`}
export async function body(request:Request){assert(Number(request.headers.get('content-length')||0)<=2_500_000,'İstek çok büyük.',413);const raw=await request.text();assert(raw.length<=2_500_000,'İstek çok büyük.',413);try{return JSON.parse(raw)}catch{throw new ApiError(400,'Geçersiz JSON.')}}
export const cleanString=(v:unknown,max=200)=>typeof v==='string'?v.trim().slice(0,max):'';

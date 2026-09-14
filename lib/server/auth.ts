import type {User} from '../business';
import {ApiError,assert,body,cleanString,digest,hashPassword,sessionCookie,token,verifyPassword} from './security';
import {all,audit,first,now,run,stmt,type DB} from './store';
export async function authRoute(db:DB,request:Request,path:string){
 if(path==='auth/status'&&request.method==='GET')return Response.json({needsSetup:!(await first(db,'SELECT id FROM users LIMIT 1'))});
 if(!['auth/login','auth/setup'].includes(path)||request.method!=='POST')return null;
 const input=await body(request),email=cleanString(input.email).toLowerCase();
 const key=digest(`login:${email}`),ipKey=digest(`login-ip:${process.env.MYSILO_TRUST_PROXY==='1'?request.headers.get('x-real-ip')||'local':'local'}`),time=Date.now();
 for(const k of [key,ipKey]){const attempt=await first<{count:number;reset_at:number}>(db,'SELECT * FROM auth_attempts WHERE key=?',k);assert(!attempt||attempt.reset_at<time||attempt.count<(k===key?8:60),'Çok fazla deneme. 15 dakika sonra tekrar deneyin.',429);await run(db,'INSERT INTO auth_attempts(key,count,reset_at) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=CASE WHEN reset_at<? THEN 1 ELSE count+1 END,reset_at=CASE WHEN reset_at<? THEN excluded.reset_at ELSE reset_at END',k,time+15*60000,time,time)}
 assert(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),'E-posta veya şifre hatalı.',401);
 let user:User|null=null;
 if(path==='auth/setup'){
  assert(!await first(db,'SELECT id FROM users LIMIT 1'),'İlk kurulum tamamlanmış.',409);
  const setup=await first<{value:string}>(db,"SELECT value FROM settings WHERE key='bootstrap_hash'");assert(setup&&typeof input.setupKey==='string'&&digest(input.setupKey)===setup.value,'Kurulum anahtarı hatalı.',403);
  const name=cleanString(input.name);assert(name,'Adınızı girin.');const passwordHash=await hashPassword(input.password),id=crypto.randomUUID();
  // Singleton row makes concurrent bootstrap requests fail atomically.
  await db.batch([stmt(db,"INSERT INTO settings(key,value) VALUES('admin_initialized',?)",id),stmt(db,'INSERT INTO users(id,email,name,password_hash,role,active,created_at) VALUES(?,?,?,?,\'admin\',1,?)',id,email,name,passwordHash,now()),stmt(db,"DELETE FROM settings WHERE key='bootstrap_hash'"),audit(db,id,'admin.created',{email,name})]);user={id,email,name,role:'admin',active:1};
 }else{
  const row=await first<User&{password_hash:string}>(db,'SELECT id,name,email,role,active,password_hash FROM users WHERE email=?',email);
  // Unknown accounts still perform a password derivation.
  const valid=await verifyPassword(input.password,row?.password_hash||'scrypt:32768:8:3:00000000000000000000000000000000:0000000000000000000000000000000000000000000000000000000000000000');
  assert(row&&row.active&&valid,'E-posta veya şifre hatalı.',401);user={id:row.id,name:row.name,email:row.email,role:row.role,active:row.active};
 }
 const raw=token();await db.batch([stmt(db,'DELETE FROM auth_attempts WHERE key=?',key),stmt(db,'DELETE FROM sessions WHERE expires_at<?',time),stmt(db,'INSERT INTO sessions(token_hash,user_id,expires_at) VALUES(?,?,?)',digest(raw),user.id,time+8*3600_000),audit(db,user.id,'session.login',{})]);
 return Response.json({user},{headers:{'set-cookie':sessionCookie(raw,request.url)}});
}

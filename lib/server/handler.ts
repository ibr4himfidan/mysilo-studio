import {ApiError,assert,body,cookieName,digest,hashPassword,sameOrigin,sessionCookie,verifyPassword} from './security';
import {authenticate,audit,first,stmt,type DB} from './store';
import {authRoute} from './auth';
import {projectRoute} from './projects';
import {adminRoute} from './admin';
export async function handleApi(db:DB,request:Request){try{
 sameOrigin(request);const path=new URL(request.url).pathname.replace(/^\/api\//,'');let response=await authRoute(db,request,path);
 if(!response){const user=await authenticate(db,request);
  if(path==='auth/me'&&request.method==='GET')response=Response.json({user});
  else if(path==='auth/logout'&&request.method==='POST'){const raw=request.headers.get('cookie')?.split(';').map(s=>s.trim()).find(s=>s.startsWith(cookieName+'='))?.slice(cookieName.length+1)||'';await db.batch([stmt(db,'DELETE FROM sessions WHERE token_hash=?',digest(raw)),audit(db,user.id,'session.logout',{})]);response=Response.json({ok:true},{headers:{'set-cookie':sessionCookie('',request.url,0)}})}
  else if(path==='auth/password'&&request.method==='POST'){const input=await body(request),stored=await first<{password_hash:string}>(db,'SELECT password_hash FROM users WHERE id=?',user.id);assert(stored&&await verifyPassword(input.current,stored.password_hash),'Mevcut şifre hatalı.',403);const hash=await hashPassword(input.password);await db.batch([stmt(db,'UPDATE users SET password_hash=? WHERE id=?',hash,user.id),stmt(db,'DELETE FROM sessions WHERE user_id=?',user.id),audit(db,user.id,'password.changed',{})]);response=Response.json({ok:true},{headers:{'set-cookie':sessionCookie('',request.url,0)}})}
  else response=await projectRoute(db,user,request,path)||await adminRoute(db,user,request,path);
 }
 if(!response)throw new ApiError(404,'İşlem bulunamadı.');response.headers.set('cache-control','no-store');response.headers.set('x-content-type-options','nosniff');return response;
 }catch(error){const known=error instanceof ApiError;if(!known)console.error('Mysilo API:',error instanceof Error?error.message:'Unknown error');return Response.json({error:known?error.message:'İşlem tamamlanamadı. Lütfen tekrar deneyin.'},{status:known?error.status:500,headers:{'cache-control':'no-store'}})}}

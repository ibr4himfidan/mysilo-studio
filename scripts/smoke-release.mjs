import {mkdtemp,cp,rm,readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {createServer} from 'node:net';
import {spawn,execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';

const root=process.cwd(),temporary=await mkdtemp(join(tmpdir(),'mysilo-release-'));
let server,logs='';
try{
  const release=join(temporary,'release');
  await cp(resolve('.next/standalone'),release,{recursive:true});
  const environment={...process.env,NODE_ENV:'production',NEXT_TELEMETRY_DISABLED:'1',MYSILO_DATABASE_PATH:join(temporary,'database','mysilo.sqlite'),MYSILO_BACKUP_DIR:join(temporary,'backups'),MYSILO_PUBLIC_ORIGIN:'',MYSILO_TRUST_PROXY:'0'};
  execFileSync(process.execPath,['scripts/database.mjs','init'],{cwd:release,env:environment,stdio:'pipe'});
  const probe=createServer();await new Promise(resolve=>probe.listen(0,'127.0.0.1',resolve));const port=probe.address().port;await new Promise(resolve=>probe.close(resolve));
  const url='http://127.0.0.1:'+port;
  server=spawn(process.execPath,['server.js'],{cwd:release,env:{...environment,PORT:String(port),HOSTNAME:'127.0.0.1'},stdio:['ignore','pipe','pipe']});
  server.stdout.on('data',data=>{logs+=data});server.stderr.on('data',data=>{logs+=data});
  let ready=false;
  for(let i=0;i<60;i++){try{const response=await fetch(url+'/api/health');if(response.ok){ready=true;break}}catch{}if(server.exitCode!==null)break;await new Promise(resolve=>setTimeout(resolve,250))}
  assert.ok(ready,'Standalone server did not become healthy:\n'+logs);
  for(const path of ['/','/login','/backoffice','/catalog','/research','/brand/logo.png'])assert.equal((await fetch(url+path)).status,200,path);
  assert.equal((await fetch(url+'/api/workspace')).status,401);
  const password=(await readFile(join(temporary,'database','ilk-giris.txt'),'utf8')).split('Şifre: ')[1].split('\n')[0];
  const login=await fetch(url+'/api/auth/login',{method:'POST',headers:{origin:url,'content-type':'application/json'},body:JSON.stringify({email:'admin@mysilo.local',password})});
  assert.equal(login.status,200,'Production login');
  const cookie=login.headers.get('set-cookie').split(';')[0];
  assert.equal((await fetch(url+'/api/workspace',{headers:{cookie}})).status,200);
  assert.equal((await fetch(url+'/api/admin/overview',{headers:{cookie}})).status,200);
  console.log('Isolated release verified: startup, pages, assets, authentication and database.');
}finally{
  if(server&&server.exitCode===null){server.kill('SIGTERM');await new Promise(resolve=>server.once('exit',resolve))}
  await rm(temporary,{recursive:true,force:true});
}

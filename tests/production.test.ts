import {test} from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {sqliteDatabase} from '../lib/server/sqlite';
import {publicRequest} from '../lib/server/public-request';
import {sameOrigin,sessionCookie} from '../lib/server/security';

test('native SQLite rolls back the whole batch on a later constraint failure',async()=>{
  const sql=new DatabaseSync(':memory:');sql.exec('CREATE TABLE records(id INTEGER PRIMARY KEY,value TEXT);');const db=sqliteDatabase(sql);
  try{await assert.rejects(db.batch([db.prepare('INSERT INTO records VALUES(1,?)').bind('one'),db.prepare('INSERT INTO records VALUES(1,?)').bind('duplicate')]));assert.equal(await db.prepare('SELECT count(*) AS n FROM records').first<{n:number}>().then(r=>r!.n),0)}finally{sql.close()}
});
test('parallel batches keep conditional audit rows within their own atomic revision writes',async()=>{
  const sql=new DatabaseSync(':memory:');sql.exec('CREATE TABLE records(id INTEGER PRIMARY KEY,revision INTEGER);INSERT INTO records VALUES(1,0);CREATE TABLE audit(name TEXT);');const db=sqliteDatabase(sql);
  try{const results=await Promise.all(['first','second'].map(name=>db.batch([db.prepare('UPDATE records SET revision=1 WHERE id=1 AND revision=0'),db.prepare('INSERT INTO audit SELECT ? WHERE changes()=1').bind(name)])));assert.deepEqual(results.map(r=>r[0].meta.changes),[1,0]);assert.equal((await db.prepare('SELECT * FROM audit').all()).results.length,1)}finally{sql.close()}
});
test('production origin preserves request body, rejects forged origins and sets Secure cookies',async()=>{
  const previous=process.env.MYSILO_PUBLIC_ORIGIN;process.env.MYSILO_PUBLIC_ORIGIN='https://203.0.113.1';
  try{const original=new Request('http://127.0.0.1:5188/api/auth/login',{method:'POST',headers:{origin:'https://203.0.113.1','content-type':'application/json','x-forwarded-host':'attacker.example'},body:JSON.stringify({email:'test@example.test'})});const request=publicRequest(original);sameOrigin(request);assert.equal(request.url,'https://203.0.113.1/api/auth/login');assert.equal((await request.json()).email,'test@example.test');assert.match(sessionCookie('test',request.url),/; Secure$/);const forged=publicRequest(new Request('http://127.0.0.1:5188/api/auth/login',{method:'POST',headers:{origin:'https://attacker.example','content-type':'application/json'},body:'{}'}));assert.throws(()=>sameOrigin(forged))}finally{if(previous===undefined)delete process.env.MYSILO_PUBLIC_ORIGIN;else process.env.MYSILO_PUBLIC_ORIGIN=previous}
});

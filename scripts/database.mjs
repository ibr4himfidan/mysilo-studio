import { DatabaseSync, backup } from 'node:sqlite';
import { mkdir, chmod, readFile, writeFile, readdir, access } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import { randomBytes, randomUUID, scryptSync, createHash } from 'node:crypto';

const action = process.argv[2] || 'backup';
const path = resolve(process.env.MYSILO_DATABASE_PATH || 'data/mysilo.sqlite');
const backupDir = resolve(process.env.MYSILO_BACKUP_DIR || join(dirname(path), 'backups'));
const exists = async path => { try { await access(path); return true; } catch { return false; } };
if (!['init', 'backup', 'import'].includes(action)) throw new Error('Use init, backup or import <sqlite-file>.');
await mkdir(dirname(path), { recursive: true, mode: 0o700 });
if (action === 'import') {
  if (await exists(path)) throw new Error('Destination exists; import never overwrites a database.');
  const source = process.argv[3];
  if (!source || !await exists(source)) throw new Error('Provide an existing SQLite backup.');
  const origin = new DatabaseSync(resolve(source), { readOnly: true });
  try {
    if (origin.prepare('PRAGMA integrity_check').get().integrity_check !== 'ok') throw new Error('Source integrity check failed.');
    if (!origin.prepare("SELECT name FROM sqlite_master WHERE name='projects'").get()) throw new Error('Not a Mysilo database.');
    await backup(origin, path);
  } finally { origin.close(); }
}
if (action === 'backup' && !await exists(path)) throw new Error('Database missing; run npm run db:init first.');
const db = new DatabaseSync(path);
await chmod(path, 0o600);
db.exec('PRAGMA busy_timeout=10000; PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL;');
try {
  if (action !== 'backup') {
    db.exec('CREATE TABLE IF NOT EXISTS mysilo_migrations(name TEXT PRIMARY KEY, checksum TEXT NOT NULL, applied_at TEXT NOT NULL)');
    const legacy = db.prepare("SELECT name FROM sqlite_master WHERE name='d1_migrations'").get()
      ? new Set(db.prepare('SELECT name FROM d1_migrations').all().map(row => row.name)) : new Set();
    for (const file of (await readdir('drizzle')).filter(file => file.endsWith('.sql')).sort()) {
      const sql = await readFile(join('drizzle', file), 'utf8');
      const checksum = createHash('sha256').update(sql).digest('hex');
      const applied = db.prepare('SELECT checksum FROM mysilo_migrations WHERE name=?').get(file);
      if (applied) { if (applied.checksum !== checksum) throw new Error('Applied migration was modified: ' + file); continue; }
      db.exec('BEGIN IMMEDIATE');
      try {
        if (!legacy.has(file)) db.exec(sql);
        db.prepare('INSERT INTO mysilo_migrations VALUES(?,?,?)').run(file, checksum, new Date().toISOString());
        db.exec('COMMIT');
      } catch (error) { db.exec('ROLLBACK'); throw error; }
    }
    if (!db.prepare('SELECT id FROM users LIMIT 1').get()) {
      const password = randomBytes(18).toString('base64url'), salt = randomBytes(16).toString('hex');
      const hash = `scrypt:32768:8:3:${salt}:${scryptSync(password, salt, 32, { N:32768, r:8, p:3, maxmem:64*1024*1024 }).toString('hex')}`;
      const id = randomUUID(), time = new Date().toISOString();
      const email = process.env.MYSILO_ADMIN_EMAIL || 'admin@mysilo.local';
      const credentials = join(dirname(path), 'ilk-giris.txt');
      await writeFile(credentials, `Mysilo yönetici erişimi\nE-posta: ${email}\nŞifre: ${password}\n\nHesabım menüsünden şifrenizi değiştirebilirsiniz.\n`, { mode:0o600, flag:'wx' });
      db.exec('BEGIN IMMEDIATE');
      try {
        db.prepare("INSERT INTO settings(key,value) VALUES('admin_initialized',?)").run(id);
        db.prepare('INSERT INTO users(id,email,name,password_hash,role,active,created_at) VALUES(?,?,?,?,?,1,?)').run(id,email,'Mysilo Yönetici',hash,'admin',time);
        db.prepare('INSERT INTO events(id,user_id,type,data,created_at) VALUES(?,?,?,?,?)').run(randomUUID(),id,'admin.created',JSON.stringify({source:'database-init'}),time);
        db.exec('COMMIT');
      } catch(error) { db.exec('ROLLBACK'); throw error; }
      console.log('Giriş bilgileri: '+credentials);
    }
  }
  if (db.prepare('PRAGMA integrity_check').get().integrity_check !== 'ok') throw new Error('Database integrity check failed.');
  await mkdir(backupDir, { recursive:true, mode:0o700 });
  const target = join(backupDir, 'mysilo-'+new Date().toISOString().replace(/[:.]/g,'-')+'.sqlite');
  await backup(db, target);
  await chmod(target, 0o600);
  console.log('Veritabanı hazır; tutarlı yedek: '+target);
} finally { db.close(); }

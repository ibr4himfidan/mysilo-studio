import { DatabaseSync, type SQLInputValue } from 'node:sqlite';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import type { DB, DBStatement, DBResult } from './store';

/** The query contract is shared with the original D1 implementation. */
export function sqliteDatabase(sqlite: DatabaseSync): DB {
  class Statement implements DBStatement {
    constructor(readonly sql: string, readonly values: SQLInputValue[] = []) {}
    bind(...values: unknown[]) { return new Statement(this.sql, values as SQLInputValue[]); }
    async first<T>() { return (sqlite.prepare(this.sql).get(...this.values) as T | undefined) ?? null; }
    async all<T>(): Promise<DBResult<T>> { return { results: sqlite.prepare(this.sql).all(...this.values) as T[], meta: { changes: 0 } }; }
    execute(): DBResult { const result = sqlite.prepare(this.sql).run(...this.values); return { results: [], meta: { changes: Number(result.changes) } }; }
    async run() { return this.execute(); }
  }
  return {
    prepare: (sql: string) => new Statement(sql),
    async batch(statements: DBStatement[]) {
      // No await inside the transaction: concurrent requests cannot interleave
      // between a revision guard and its changes()-guarded audit record.
      sqlite.exec('BEGIN IMMEDIATE');
      try {
        const result = statements.map(statement => {
          if (!(statement instanceof Statement)) throw new Error('Statement belongs to another database.');
          return statement.execute();
        });
        sqlite.exec('COMMIT');
        return result;
      } catch (error) { sqlite.exec('ROLLBACK'); throw error; }
    },
  };
}

const state = globalThis as typeof globalThis & { mysiloDatabase?: DB };
export function getDatabase(): DB {
  if (!state.mysiloDatabase) {
    const path = resolve(process.env.MYSILO_DATABASE_PATH || 'data/mysilo.sqlite');
    if (!existsSync(path)) throw new Error('Database missing. Run npm run db:init first.');
    const sqlite = new DatabaseSync(path);
    sqlite.exec('PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;');
    state.mysiloDatabase = sqliteDatabase(sqlite);
  }
  return state.mysiloDatabase;
}

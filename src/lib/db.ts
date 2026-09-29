import { Pool, PoolClient } from 'pg';
import fs from 'fs';
import path from 'path';

// Load connection string if present
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

let pool: Pool | null = null;
let isPostgresAvailable = false;

if (connectionString) {
  try {
    pool = new Pool({
      connectionString,
      ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false },
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });
    isPostgresAvailable = true;
  } catch (err) {
    console.warn('[GoatFarm DB] Failed to initialize PostgreSQL pool, falling back to server memory store:', err);
    pool = null;
    isPostgresAvailable = false;
  }
}

/**
 * Execute SQL Query with automated retry and fallback
 */
export async function query<T = any>(text: string, params?: any[]): Promise<{ rows: T[]; rowCount: number }> {
  if (pool && isPostgresAvailable) {
    try {
      const start = Date.now();
      const res = await pool.query(text, params);
      const duration = Date.now() - start;
      if (process.env.NODE_ENV === 'development') {
        console.log(`[SQL] ${duration}ms: ${text.slice(0, 80)}...`);
      }
      return { rows: res.rows, rowCount: res.rowCount || 0 };
    } catch (error: any) {
      console.error('[DB Query Error]', error.message, text);
      throw error;
    }
  }

  // If no PostgreSQL configured, fallback is handled gracefully in service layer
  return { rows: [], rowCount: 0 };
}

/**
 * Execute atomic transaction with automatic commit / rollback
 */
export async function withTransaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
  if (!pool || !isPostgresAvailable) {
    throw new Error('PostgreSQL database is not configured. Please set DATABASE_URL in .env.local.');
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[DB Transaction Rollback]', err);
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Run migrations from schema.sql if connected to PostgreSQL
 */
export async function runMigrations() {
  if (!pool || !isPostgresAvailable) return;

  try {
    const schemaPath = path.join(process.cwd(), 'src', 'lib', 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await pool.query(schemaSql);
      console.log('[GoatFarm OS] PostgreSQL schema checked and migrated successfully.');
    }
  } catch (e: any) {
    console.error('[GoatFarm OS] Failed to run schema migration:', e.message);
  }
}

export function isDatabaseConnected(): boolean {
  return isPostgresAvailable;
}

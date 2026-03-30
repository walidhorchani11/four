import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { normalizeDatabaseUrlForPg } from '@/lib/database-url'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  pgPool: Pool | undefined
}

function getPool(): Pool {
  const raw = process.env.DATABASE_URL
  if (!raw) {
    throw new Error('DATABASE_URL is not set')
  }
  const connectionString = normalizeDatabaseUrlForPg(raw)
  if (!globalForPrisma.pgPool) {
    const connectionTimeoutMillis = Number(
      process.env.PG_CONNECTION_TIMEOUT_MS ?? 60_000
    )
    globalForPrisma.pgPool = new Pool({
      connectionString,
      max: Number(process.env.PG_POOL_MAX ?? 10),
      /** Doit être ≥ au délai TCP/TLS vers l’hôte (Neon, etc.) ; aligné avec connect_timeout dans l’URL */
      connectionTimeoutMillis,
      idleTimeoutMillis: Number(process.env.PG_IDLE_TIMEOUT_MS ?? 30_000),
      keepAlive: true,
      keepAliveInitialDelayMillis: 10_000,
    })
  }
  return globalForPrisma.pgPool
}

function createPrismaClient() {
  const pool = getPool()
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

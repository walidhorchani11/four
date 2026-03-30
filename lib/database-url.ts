/**
 * pg v8+ warns when sslmode is require/prefer/verify-ca (today they map to verify-full).
 * Set verify-full explicitly so behavior stays strict and the warning goes away.
 *
 * connect_timeout (secondes, libpq) : évite d’attendre indéfiniment ; aligné avec PG_CONNECTION_TIMEOUT_MS côté pool.
 */
export function normalizeDatabaseUrlForPg(connectionString: string): string {
  try {
    const u = new URL(connectionString)
    const mode = u.searchParams.get('sslmode')
    if (mode === 'require' || mode === 'prefer' || mode === 'verify-ca') {
      u.searchParams.set('sslmode', 'verify-full')
    }
    // Neon copie parfois channel_binding=require ; node-postgres gère mal → timeouts.
    u.searchParams.delete('channel_binding')
    if (!u.searchParams.has('connect_timeout')) {
      const sec = process.env.PG_CONNECT_TIMEOUT_SEC ?? '60'
      u.searchParams.set('connect_timeout', sec)
    }
    return u.toString()
  } catch {
    return connectionString
  }
}

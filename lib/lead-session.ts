const LEAD_SESSION_KEY = 'four_lead_session_id'

export function getLeadSessionId(): string {
  if (typeof window === 'undefined') return ''
  let id = sessionStorage.getItem(LEAD_SESSION_KEY)
  if (!id) {
    id = crypto.randomUUID()
    sessionStorage.setItem(LEAD_SESSION_KEY, id)
  }
  return id
}

export function rotateLeadSessionId(): void {
  if (typeof window === 'undefined') return
  sessionStorage.setItem(LEAD_SESSION_KEY, crypto.randomUUID())
}

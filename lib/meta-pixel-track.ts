/**
 * Envoi d'événements Meta Pixel côté client (après chargement de fbevents.js).
 * @see https://developers.facebook.com/docs/meta-pixel/reference
 */

function getFbq(): ((...args: unknown[]) => void) | undefined {
  if (typeof window === 'undefined') return undefined
  const fbq = (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq
  return typeof fbq === 'function' ? fbq : undefined
}

export type MetaLeadParams = {
  content_name?: string
  content_ids?: string[]
  /** Montant commande (DT) pour optimisation */
  value?: number
  currency?: string
}

/** Conversion : commande / formulaire validé avec succès. */
export function trackMetaLead(params?: MetaLeadParams): void {
  const fbq = getFbq()
  if (!fbq) return

  const p = params
  if (!p) {
    fbq('track', 'Lead')
    return
  }

  const payload: Record<string, unknown> = {}
  if (p.content_name) payload.content_name = p.content_name
  if (p.content_ids?.length) payload.content_ids = p.content_ids
  if (p.value != null && !Number.isNaN(p.value)) {
    payload.value = p.value
    payload.currency = p.currency ?? 'TND'
  }

  if (Object.keys(payload).length > 0) {
    fbq('track', 'Lead', payload)
  } else {
    fbq('track', 'Lead')
  }
}

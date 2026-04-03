import { productsCatalog } from '@/components/landing/products-catalog'

const STORAGE_KEY = 'four_order_form_draft'

export type OrderFormDraft = {
  nom: string
  telephone: string
  adresse: string
  chosenProductId: string
}

const emptyForm = (): OrderFormDraft => ({
  nom: '',
  telephone: '',
  adresse: '',
  chosenProductId: '',
})

const validProductIds = new Set(productsCatalog.map((p) => p.id))

function normalizeDraft(raw: unknown): OrderFormDraft | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  const chosen =
    typeof o.chosenProductId === 'string' && validProductIds.has(o.chosenProductId)
      ? o.chosenProductId
      : ''
  return {
    nom: typeof o.nom === 'string' ? o.nom : '',
    telephone: typeof o.telephone === 'string' ? o.telephone : '',
    adresse: typeof o.adresse === 'string' ? o.adresse : '',
    chosenProductId: chosen,
  }
}

export function loadOrderFormDraft(): OrderFormDraft | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return normalizeDraft(JSON.parse(raw))
  } catch {
    return null
  }
}

export function saveOrderFormDraft(draft: OrderFormDraft): void {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
  } catch {
    /* quota / private mode */
  }
}

export function clearOrderFormDraft(): void {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
}

export { emptyForm }

'use client'

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { productsCatalog } from './products-catalog'
import { getLeadSessionId, rotateLeadSessionId } from '@/lib/lead-session'
import {
  loadOrderFormDraft,
  saveOrderFormDraft,
  clearOrderFormDraft,
  emptyForm,
} from '@/lib/order-form-draft'
import { isValidTunisianPhone, tunisianPhoneToE164 } from '@/lib/tunisian-phone'

export const ORDER_FORM_PRIMARY_ID = 'order-form-primary'

export type OrderFormInstanceId = 'primary' | 'secondary'

type OrderFieldErrorKey = 'nom' | 'telephone' | 'adresse' | 'product' | 'form'

export function fieldIds(instanceId: OrderFormInstanceId) {
  const s = instanceId
  return {
    nom: `nom-input-${s}`,
    tel: `tel-input-${s}`,
    adresse: `adresse-input-${s}`,
    produit: `produit-input-${s}`,
  }
}

function focusFirstInvalidField(
  errors: Partial<Record<OrderFieldErrorKey, string>>,
  instanceId: OrderFormInstanceId
) {
  const ids = fieldIds(instanceId)
  const order: { key: OrderFieldErrorKey; id: string }[] = [
    { key: 'product', id: ids.produit },
    { key: 'nom', id: ids.nom },
    { key: 'telephone', id: ids.tel },
    { key: 'adresse', id: ids.adresse },
  ]
  for (const { key, id } of order) {
    if (errors[key]) {
      requestAnimationFrame(() => document.getElementById(id)?.focus())
      return
    }
  }
}

function hasMeaningfulLeadData(params: {
  nom: string
  telephone: string
  adresse: string
  productId: string | null
}) {
  const phoneDigits = params.telephone.replace(/\D/g, '').length
  if (phoneDigits >= 8) return true
  if (params.nom.trim().length >= 2) return true
  if (params.adresse.trim().length >= 8) return true
  if (params.productId && params.productId.length > 0) return true
  return false
}

type OrderContextValue = {
  selectedProductId: string | null
  openOrder: (productId?: string) => void
  formData: { nom: string; telephone: string; adresse: string }
  chosenProductId: string
  isSubmitted: boolean
  isSubmitting: boolean
  fieldErrors: Partial<Record<OrderFieldErrorKey, string>>
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  /** Sélection produit (cartes ou select legacy) */
  selectProduct: (productId: string) => void
  handleSubmit: (e: React.FormEvent, instanceId: OrderFormInstanceId) => Promise<void>
  finalProduct: (typeof productsCatalog)[number] | null
  isProductPreselected: boolean
  productFromContext: (typeof productsCatalog)[number] | null
}

const OrderContext = createContext<OrderContextValue | undefined>(undefined)

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const tOrder = useTranslations('order')

  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [chosenProductId, setChosenProductId] = useState<string>('')
  const [formData, setFormData] = useState({
    nom: '',
    telephone: '',
    adresse: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sessionId, setSessionId] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<OrderFieldErrorKey, string>>>({})

  const formSnapshotRef = useRef(formData)
  formSnapshotRef.current = formData
  const chosenProductIdRef = useRef(chosenProductId)
  chosenProductIdRef.current = chosenProductId
  const selectedProductIdRef = useRef(selectedProductId)
  selectedProductIdRef.current = selectedProductId

  const orderJustCompletedRef = useRef(false)
  const [draftReady, setDraftReady] = useState(false)

  const productFromContext =
    selectedProductId ? productsCatalog.find((p) => p.id === selectedProductId) ?? null : null
  const productFromChoice =
    chosenProductId ? productsCatalog.find((p) => p.id === chosenProductId) ?? null : null
  const finalProduct = productFromContext ?? productFromChoice
  const isProductPreselected = Boolean(productFromContext)

  useEffect(() => {
    setSessionId(getLeadSessionId())
  }, [])

  useEffect(() => {
    const draft = loadOrderFormDraft()
    const base = draft ?? emptyForm()
    setFormData({
      nom: base.nom,
      telephone: base.telephone,
      adresse: base.adresse,
    })
    setChosenProductId(base.chosenProductId)
    setDraftReady(true)
  }, [])

  useEffect(() => {
    if (!draftReady || isSubmitted) return
    saveOrderFormDraft({
      ...formData,
      chosenProductId,
    })
  }, [formData, chosenProductId, isSubmitted, draftReady])

  const openOrder = useCallback((productId?: string) => {
    setSelectedProductId(productId ?? null)
    if (productId) {
      setChosenProductId(productId)
    }
    requestAnimationFrame(() => {
      document.getElementById(ORDER_FORM_PRIMARY_ID)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    })
  }, [])

  const saveLeadDraft = useCallback(() => {
    if (!sessionId || isSubmitted) return
    const productId = finalProduct?.id ?? null
    if (!hasMeaningfulLeadData({ ...formData, productId })) return
    void fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientSessionId: sessionId,
        nom: formData.nom,
        telephone: formData.telephone,
        adresse: formData.adresse,
        commentaire: null,
        productId,
        status: 'draft',
      }),
    })
  }, [sessionId, isSubmitted, formData, finalProduct])

  useEffect(() => {
    if (!sessionId || isSubmitted) return
    const productId = finalProduct?.id ?? null
    if (!hasMeaningfulLeadData({ ...formData, productId })) return
    const timer = window.setTimeout(() => {
      saveLeadDraft()
    }, 1500)
    return () => window.clearTimeout(timer)
  }, [formData, finalProduct, sessionId, isSubmitted, saveLeadDraft])

  useEffect(() => {
    const onPageHide = () => {
      if (orderJustCompletedRef.current) return
      const snap = formSnapshotRef.current
      const chosen = chosenProductIdRef.current
      const sel = selectedProductIdRef.current
      const productId = sel ?? (chosen || null)
      if (
        !hasMeaningfulLeadData({
          nom: snap.nom,
          telephone: snap.telephone,
          adresse: snap.adresse,
          productId,
        })
      ) {
        return
      }
      const sid = getLeadSessionId()
      void fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientSessionId: sid,
          nom: snap.nom,
          telephone: snap.telephone,
          adresse: snap.adresse,
          commentaire: null,
          productId,
          status: 'dropped',
        }),
      })
    }
    window.addEventListener('pagehide', onPageHide)
    return () => window.removeEventListener('pagehide', onPageHide)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (name === 'nom' || name === 'telephone' || name === 'adresse') {
      setFieldErrors((prev) => {
        const next = { ...prev }
        delete next[name as 'nom' | 'telephone' | 'adresse']
        delete next.form
        return next
      })
    }
  }

  const selectProduct = useCallback((productId: string) => {
    setChosenProductId(productId)
    setFieldErrors((prev) => {
      if (!prev.product) return prev
      const { product: _p, ...rest } = prev
      return rest
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent, instanceId: OrderFormInstanceId) => {
    e.preventDefault()

    const errors: Partial<Record<OrderFieldErrorKey, string>> = {}

    if (!formData.nom.trim()) errors.nom = tOrder('fieldRequired')
    if (!formData.telephone.trim()) errors.telephone = tOrder('fieldRequired')
    else if (!isValidTunisianPhone(formData.telephone)) errors.telephone = tOrder('phoneInvalid')
    if (!formData.adresse.trim()) errors.adresse = tOrder('fieldRequired')
    if (!finalProduct) errors.product = tOrder('alertProduct')

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      focusFirstInvalidField(errors, instanceId)
      return
    }

    const orderProduct = finalProduct!
    const telephoneE164 = tunisianPhoneToE164(formData.telephone)!

    setIsSubmitting(true)
    try {
      const sid = sessionId || getLeadSessionId()
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: formData.nom,
          telephone: telephoneE164,
          adresse: formData.adresse,
          commentaire: null,
          productId: orderProduct.id,
          clientSessionId: sid,
        }),
      })

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string }
        if (data.error === 'PHONE_INVALID') {
          setFieldErrors({ telephone: tOrder('phoneInvalid') })
          requestAnimationFrame(() =>
            document.getElementById(fieldIds(instanceId).tel)?.focus()
          )
          return
        }
        setFieldErrors({
          form: typeof data.error === 'string' ? data.error : tOrder('alertOrderError'),
        })
        return
      }

      orderJustCompletedRef.current = true
      setIsSubmitted(true)
      toast.success(tOrder('successTitle'))

      rotateLeadSessionId()
      setSessionId(getLeadSessionId())
      clearOrderFormDraft()

      setTimeout(() => {
        orderJustCompletedRef.current = false
        setIsSubmitted(false)
        setFormData({ nom: '', telephone: '', adresse: '' })
        setChosenProductId('')
        setSelectedProductId(null)
        setFieldErrors({})
      }, 3000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const value: OrderContextValue = {
    selectedProductId,
    openOrder,
    formData,
    chosenProductId,
    isSubmitted,
    isSubmitting,
    fieldErrors,
    handleInputChange,
    selectProduct,
    handleSubmit,
    finalProduct,
    isProductPreselected,
    productFromContext,
  }

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
}

export function useOrder() {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error('useOrder must be used within OrderProvider')
  }
  return context
}

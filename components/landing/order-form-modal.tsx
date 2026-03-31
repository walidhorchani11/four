'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { useOrder } from './order-context'
import { X } from 'lucide-react'
import { productsCatalog } from './products-catalog'
import { getLeadSessionId, rotateLeadSessionId } from '@/lib/lead-session'
import {
  loadOrderFormDraft,
  saveOrderFormDraft,
  clearOrderFormDraft,
  emptyForm,
} from '@/lib/order-form-draft'
import { isValidTunisianPhone, tunisianPhoneToE164 } from '@/lib/tunisian-phone'
import { cn } from '@/lib/utils'

type OrderFieldErrorKey = 'nom' | 'telephone' | 'adresse' | 'product' | 'form'

function focusFirstInvalidField(errors: Partial<Record<OrderFieldErrorKey, string>>) {
  const order: { key: OrderFieldErrorKey; id: string }[] = [
    { key: 'nom', id: 'nom-input' },
    { key: 'telephone', id: 'tel-input' },
    { key: 'adresse', id: 'adresse-input' },
    { key: 'product', id: 'produit-input' },
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

export function OrderFormModal() {
  const tOrder = useTranslations('order')
  const tProducts = useTranslations('products')
  const { isOpen, closeOrder, selectedProductId } = useOrder()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [chosenProductId, setChosenProductId] = useState<string>('')
  const [formData, setFormData] = useState({
    nom: '',
    telephone: '',
    adresse: '',
    commentaire: '',
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
  const prevIsOpenRef = useRef(false)
  /** Évite d'écraser sessionStorage avec un formulaire vide au 1er rendu avant restauration. */
  const skipPersistAfterOpenRef = useRef(false)

  const productLabel = (id: string) => tProducts(`items.${id}.name`)

  useEffect(() => {
    setSessionId(getLeadSessionId())
  }, [])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        const input = document.getElementById('nom-input') as HTMLInputElement
        input?.focus()
      }, 100)
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {
      skipPersistAfterOpenRef.current = true
      const draft = loadOrderFormDraft()
      const base = draft ?? emptyForm()
      setFormData({
        nom: base.nom,
        telephone: base.telephone,
        adresse: base.adresse,
        commentaire: base.commentaire,
      })
      setIsSubmitted(false)
      setFieldErrors({})
      if (selectedProductId) {
        setChosenProductId(selectedProductId)
      } else {
        setChosenProductId(base.chosenProductId)
      }
    }
    if (!isOpen && prevIsOpenRef.current) {
      const snap = formSnapshotRef.current
      const chosen = chosenProductIdRef.current
      const sel = selectedProductIdRef.current
      const productId = sel ?? (chosen || null)
      if (
        !orderJustCompletedRef.current &&
        hasMeaningfulLeadData({
          nom: snap.nom,
          telephone: snap.telephone,
          adresse: snap.adresse,
          productId,
        })
      ) {
        const sid = getLeadSessionId()
        void fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clientSessionId: sid,
            nom: snap.nom,
            telephone: snap.telephone,
            adresse: snap.adresse,
            commentaire: snap.commentaire || null,
            productId,
            status: 'dropped',
          }),
        })
      }
      if (orderJustCompletedRef.current) {
        orderJustCompletedRef.current = false
      }
    }
    prevIsOpenRef.current = isOpen
  }, [isOpen, selectedProductId])

  useEffect(() => {
    if (!isOpen || isSubmitted) return
    if (skipPersistAfterOpenRef.current) {
      skipPersistAfterOpenRef.current = false
      return
    }
    saveOrderFormDraft({
      ...formData,
      chosenProductId,
    })
  }, [formData, chosenProductId, isOpen, isSubmitted])

  const productFromContext =
    selectedProductId ? productsCatalog.find((p) => p.id === selectedProductId) ?? null : null
  const productFromChoice =
    chosenProductId ? productsCatalog.find((p) => p.id === chosenProductId) ?? null : null
  const finalProduct = productFromContext ?? productFromChoice
  const isProductPreselected = Boolean(productFromContext)

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
        commentaire: formData.commentaire || null,
        productId,
        status: 'draft',
      }),
    })
  }, [sessionId, isSubmitted, formData, finalProduct])

  useEffect(() => {
    if (!isOpen || !sessionId || isSubmitted) return
    const productId = finalProduct?.id ?? null
    if (!hasMeaningfulLeadData({ ...formData, productId })) return
    const timer = window.setTimeout(() => {
      saveLeadDraft()
    }, 1500)
    return () => window.clearTimeout(timer)
  }, [formData, finalProduct, isOpen, sessionId, isSubmitted, saveLeadDraft])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (name === 'nom' || name === 'telephone' || name === 'adresse') {
      setFieldErrors((prev) => {
        const next = { ...prev }
        delete next[name as 'nom' | 'telephone' | 'adresse']
        delete next.form
        return next
      })
    } else if (name === 'commentaire') {
      setFieldErrors((prev) => {
        if (!prev.form) return prev
        const { form, ...rest } = prev
        return rest
      })
    }
  }

  const handleProductSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setChosenProductId(e.target.value)
    setFieldErrors((prev) => {
      if (!prev.product) return prev
      const { product, ...rest } = prev
      return rest
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const errors: Partial<Record<OrderFieldErrorKey, string>> = {}

    if (!formData.nom.trim()) errors.nom = tOrder('fieldRequired')
    if (!formData.telephone.trim()) errors.telephone = tOrder('fieldRequired')
    else if (!isValidTunisianPhone(formData.telephone)) errors.telephone = tOrder('phoneInvalid')
    if (!formData.adresse.trim()) errors.adresse = tOrder('fieldRequired')
    if (!finalProduct) errors.product = tOrder('alertProduct')

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      focusFirstInvalidField(errors)
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
          commentaire: formData.commentaire || null,
          productId: orderProduct.id,
          clientSessionId: sid,
        }),
      })

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string }
        if (data.error === 'PHONE_INVALID') {
          setFieldErrors({ telephone: tOrder('phoneInvalid') })
          requestAnimationFrame(() => document.getElementById('tel-input')?.focus())
          return
        }
        setFieldErrors({ form: typeof data.error === 'string' ? data.error : tOrder('alertOrderError') })
        return
      }

      orderJustCompletedRef.current = true
      setIsSubmitted(true)
      toast.success(tOrder('successTitle'))

      rotateLeadSessionId()
      setSessionId(getLeadSessionId())
      clearOrderFormDraft()

      setTimeout(() => {
        closeOrder()
        setIsSubmitted(false)
        setFormData({ nom: '', telephone: '', adresse: '', commentaire: '' })
        setChosenProductId('')
        setFieldErrors({})
      }, 3000)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 transition-opacity duration-300"
      onClick={closeOrder}
      role="presentation"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-modal-title"
      >
          <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 bg-white rounded-t-2xl">
            <h2 id="order-modal-title" className="text-2xl font-bold text-gray-900">
              {isSubmitted ? tOrder('titleThanks') : tOrder('title')}
            </h2>
            <button
              type="button"
              onClick={closeOrder}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
              aria-label={tOrder('close')}
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6">
            {!isSubmitted ? (
              <>
                <p className="text-gray-600 mb-6 font-medium">
                  {tOrder('intro')}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="nom-input" className="block text-sm font-semibold text-gray-700 mb-2">
                      {tOrder('name')} *
                    </label>
                    <input
                      id="nom-input"
                      type="text"
                      name="nom"
                      placeholder={tOrder('namePh')}
                      value={formData.nom}
                      onChange={handleInputChange}
                      autoComplete="name"
                      aria-invalid={Boolean(fieldErrors.nom)}
                      aria-describedby={fieldErrors.nom ? 'nom-error' : undefined}
                      className={cn(
                        'w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors bg-gray-50 text-gray-900',
                        fieldErrors.nom
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-200 focus:border-orange-500'
                      )}
                    />
                    {fieldErrors.nom ? (
                      <p id="nom-error" role="alert" className="mt-1.5 text-sm text-red-600">
                        {fieldErrors.nom}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <label htmlFor="tel-input" className="block text-sm font-semibold text-gray-700 mb-2">
                      {tOrder('phone')} *
                    </label>
                    <input
                      id="tel-input"
                      type="tel"
                      name="telephone"
                      placeholder={tOrder('phonePh')}
                      value={formData.telephone}
                      onChange={handleInputChange}
                      autoComplete="tel"
                      inputMode="tel"
                      aria-invalid={Boolean(fieldErrors.telephone)}
                      aria-describedby={fieldErrors.telephone ? 'tel-error' : undefined}
                      className={cn(
                        'w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors bg-gray-50 text-gray-900',
                        fieldErrors.telephone
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-200 focus:border-orange-500'
                      )}
                    />
                    {fieldErrors.telephone ? (
                      <p id="tel-error" role="alert" className="mt-1.5 text-sm text-red-600">
                        {fieldErrors.telephone}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <label htmlFor="adresse-input" className="block text-sm font-semibold text-gray-700 mb-2">
                      {tOrder('address')} *
                    </label>
                    <input
                      id="adresse-input"
                      type="text"
                      name="adresse"
                      placeholder={tOrder('addressPh')}
                      value={formData.adresse}
                      onChange={handleInputChange}
                      autoComplete="street-address"
                      aria-invalid={Boolean(fieldErrors.adresse)}
                      aria-describedby={fieldErrors.adresse ? 'adresse-error' : undefined}
                      className={cn(
                        'w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors bg-gray-50 text-gray-900',
                        fieldErrors.adresse
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-200 focus:border-orange-500'
                      )}
                    />
                    {fieldErrors.adresse ? (
                      <p id="adresse-error" role="alert" className="mt-1.5 text-sm text-red-600">
                        {fieldErrors.adresse}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <label htmlFor="produit-input" className="block text-sm font-semibold text-gray-700 mb-2">
                      {tOrder('product')} *
                    </label>
                    {isProductPreselected && productFromContext ? (
                      <>
                        <input
                          id="produit-input"
                          type="text"
                          value={productLabel(productFromContext.id)}
                          readOnly
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
                        />
                        <p className="mt-2 text-sm text-gray-700 font-semibold">
                          {tOrder('price', { price: productFromContext.price })}
                        </p>
                      </>
                    ) : (
                      <>
                        <select
                          id="produit-input"
                          value={chosenProductId}
                          onChange={handleProductSelectChange}
                          aria-invalid={Boolean(fieldErrors.product)}
                          aria-describedby={fieldErrors.product ? 'product-error' : undefined}
                          className={cn(
                            'w-full px-4 py-3 border-2 rounded-lg bg-gray-50 text-gray-900 focus:outline-none transition-colors',
                            fieldErrors.product
                              ? 'border-red-500 focus:border-red-500'
                              : 'border-gray-200 focus:border-orange-500'
                          )}
                        >
                          <option value="">{tOrder('productPlaceholder')}</option>
                          {productsCatalog.map((p) => (
                            <option key={p.id} value={p.id}>
                              {productLabel(p.id)} — {p.price} DT
                            </option>
                          ))}
                        </select>
                        {finalProduct ? (
                          <p className="mt-2 text-sm text-gray-700 font-semibold">
                            {tOrder('price', { price: finalProduct.price })}
                          </p>
                        ) : null}
                        {fieldErrors.product ? (
                          <p id="product-error" role="alert" className="mt-1.5 text-sm text-red-600">
                            {fieldErrors.product}
                          </p>
                        ) : null}
                      </>
                    )}
                  </div>

                  <div>
                    <label htmlFor="comment-input" className="block text-sm font-semibold text-gray-700 mb-2">
                      {tOrder('comment')}
                    </label>
                    <textarea
                      id="comment-input"
                      name="commentaire"
                      placeholder={tOrder('commentPh')}
                      value={formData.commentaire}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors bg-gray-50 text-gray-900 resize-none"
                    />
                  </div>

                  {fieldErrors.form ? (
                    <p id="form-error" role="alert" className="mt-4 text-sm text-red-600">
                      {fieldErrors.form}
                    </p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none text-white font-bold py-4 rounded-lg transition-all duration-200 mt-6 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    {isSubmitting ? tOrder('submitting') : tOrder('submit')}
                  </button>

                  <p className="text-center text-sm text-gray-600 mt-4">
                    {tOrder('trust')}
                  </p>
                </form>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {tOrder('successTitle')}
                </h3>
                <p className="text-gray-600 mb-2">
                  {tOrder('successBody')}
                </p>
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-green-800 font-semibold mb-2">{tOrder('successPay1')}</p>
                  <p className="text-green-800 font-semibold">{tOrder('successPay2')}</p>
                </div>
              </div>
            )}
          </div>
      </div>
    </div>
  )
}

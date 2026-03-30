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
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nom || !formData.telephone || !formData.adresse) {
      alert(tOrder('alertRequired'))
      return
    }

    if (!finalProduct) {
      alert(tOrder('alertProduct'))
      return
    }

    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
    if (!whatsappNumber) {
      alert(tOrder('alertWhatsapp'))
      return
    }

    setIsSubmitting(true)
    try {
      const sid = sessionId || getLeadSessionId()
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: formData.nom,
          telephone: formData.telephone,
          adresse: formData.adresse,
          commentaire: formData.commentaire || null,
          productId: finalProduct.id,
          clientSessionId: sid,
        }),
      })

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string }
        alert(data.error ?? tOrder('alertOrderError'))
        return
      }

      orderJustCompletedRef.current = true
      setIsSubmitted(true)
      toast.success(tOrder('successTitle'))

      const productDisplayName = productLabel(finalProduct.id)
      const message = tOrder('whatsappMessage', {
        nom: formData.nom,
        telephone: formData.telephone,
        adresse: formData.adresse,
        product: productDisplayName,
        price: finalProduct.price,
        commentaire: formData.commentaire?.trim() ? formData.commentaire : tOrder('none'),
      })

      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, '_blank')

      void fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientSessionId: sid,
          markWhatsappOpened: true,
        }),
      })

      rotateLeadSessionId()
      setSessionId(getLeadSessionId())
      clearOrderFormDraft()

      setTimeout(() => {
        closeOrder()
        setIsSubmitted(false)
        setFormData({ nom: '', telephone: '', adresse: '', commentaire: '' })
        setChosenProductId('')
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
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors bg-gray-50 text-gray-900"
                    />
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
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors bg-gray-50 text-gray-900"
                    />
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
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors bg-gray-50 text-gray-900"
                    />
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
                          onChange={(e) => setChosenProductId(e.target.value)}
                          required
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:border-orange-500 focus:outline-none transition-colors"
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

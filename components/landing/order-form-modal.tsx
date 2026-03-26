'use client'

import React, { useState, useEffect } from 'react'
import { useOrder } from './order-context'
import { X } from 'lucide-react'
import { productsCatalog } from './products-catalog'

export function OrderFormModal() {
  const { isOpen, closeOrder, selectedProductId } = useOrder()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [chosenProductId, setChosenProductId] = useState<string>('')
  const [formData, setFormData] = useState({
    nom: '',
    telephone: '',
    ville: '',
    commentaire: '',
  })

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        const input = document.getElementById('nom-input') as HTMLInputElement
        input?.focus()
      }, 100)
    }
  }, [isOpen])

  useEffect(() => {
    // If the order was opened from a product card, the context already has the product.
    // Otherwise, we let the user pick it in the modal.
    if (!isOpen) return
    setChosenProductId(selectedProductId ?? '')
  }, [isOpen, selectedProductId])

  const productFromContext =
    selectedProductId ? productsCatalog.find((p) => p.id === selectedProductId) ?? null : null
  const productFromChoice =
    chosenProductId ? productsCatalog.find((p) => p.id === chosenProductId) ?? null : null
  const finalProduct = productFromContext ?? productFromChoice
  const isProductPreselected = Boolean(productFromContext)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nom || !formData.telephone || !formData.ville) {
      alert('Veuillez remplir tous les champs obligatoires')
      return
    }

    if (!finalProduct) {
      alert('Veuillez choisir un produit')
      return
    }

    setIsSubmitted(true)
    
    // Send to WhatsApp or backend
    const message = `
Nouvelle commande:
Nom: ${formData.nom}
Téléphone: ${formData.telephone}
Ville: ${formData.ville}
Produit: ${finalProduct.name}
Prix: ${finalProduct.price} DT
Commentaire: ${formData.commentaire || 'Aucun'}
    `.trim()

    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
    if (!whatsappNumber) {
      alert("Numéro WhatsApp manquant. Veuillez configurer NEXT_PUBLIC_WHATSAPP_NUMBER.")
      setIsSubmitted(false)
      return
    }
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')

    setTimeout(() => {
      closeOrder()
      setIsSubmitted(false)
      setFormData({ nom: '', telephone: '', ville: '', commentaire: '' })
      setChosenProductId('')
    }, 3000)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={closeOrder}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-0">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-300">
          {/* Header */}
          <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 bg-white rounded-t-2xl">
            <h2 className="text-2xl font-bold text-gray-900">
              {isSubmitted ? '✅ Merci!' : '🛒 Finaliser votre commande'}
            </h2>
            <button
              onClick={closeOrder}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
              aria-label="Fermer"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {!isSubmitted ? (
              <>
                <p className="text-gray-600 mb-6 font-medium">
                  Remplissez ce formulaire en moins de 10 secondes
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Nom */}
                  <div>
                    <label htmlFor="nom-input" className="block text-sm font-semibold text-gray-700 mb-2">
                      Nom complet *
                    </label>
                    <input
                      id="nom-input"
                      type="text"
                      name="nom"
                      placeholder="Votre nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors bg-gray-50 text-gray-900"
                    />
                  </div>

                  {/* Téléphone */}
                  <div>
                    <label htmlFor="tel-input" className="block text-sm font-semibold text-gray-700 mb-2">
                      Numéro de téléphone *
                    </label>
                    <input
                      id="tel-input"
                      type="tel"
                      name="telephone"
                      placeholder="Ex: 20 123 456"
                      value={formData.telephone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors bg-gray-50 text-gray-900"
                    />
                  </div>

                  {/* Ville */}
                  <div>
                    <label htmlFor="ville-input" className="block text-sm font-semibold text-gray-700 mb-2">
                      Ville *
                    </label>
                    <input
                      id="ville-input"
                      type="text"
                      name="ville"
                      placeholder="Votre ville"
                      value={formData.ville}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors bg-gray-50 text-gray-900"
                    />
                  </div>

                  {/* Produit */}
                  <div>
                    <label htmlFor="produit-input" className="block text-sm font-semibold text-gray-700 mb-2">
                      Produit *
                    </label>
                    {isProductPreselected && productFromContext ? (
                      <>
                        <input
                          id="produit-input"
                          type="text"
                          value={productFromContext.name}
                          readOnly
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
                        />
                        <p className="mt-2 text-sm text-gray-700 font-semibold">
                          Prix: {productFromContext.price} DT
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
                          <option value="">Choisir un produit...</option>
                          {productsCatalog.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} - {p.price} DT
                            </option>
                          ))}
                        </select>
                        {finalProduct ? (
                          <p className="mt-2 text-sm text-gray-700 font-semibold">
                            Prix: {finalProduct.price} DT
                          </p>
                        ) : null}
                      </>
                    )}
                  </div>

                  {/* Commentaire */}
                  <div>
                    <label htmlFor="comment-input" className="block text-sm font-semibold text-gray-700 mb-2">
                      Commentaire (facultatif)
                    </label>
                    <textarea
                      id="comment-input"
                      name="commentaire"
                      placeholder="Détails supplémentaires (facultatif)"
                      value={formData.commentaire}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors bg-gray-50 text-gray-900 resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 rounded-lg transition-all duration-200 mt-6 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    👉 Confirmer ma commande
                  </button>

                  {/* Trust Text */}
                  <p className="text-center text-sm text-gray-600 mt-4">
                    🔒 Vos informations restent confidentielles
                  </p>
                </form>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Commande envoyée avec succès !
                </h3>
                <p className="text-gray-600 mb-2">
                  📞 Notre équipe vous contactera rapidement pour confirmer votre commande.
                </p>
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-green-800 font-semibold mb-2">✓ Paiement à la livraison</p>
                  <p className="text-green-800 font-semibold">✓ Aucun paiement en ligne requis</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

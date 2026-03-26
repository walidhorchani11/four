'use client'

import React, { createContext, useContext, useState } from 'react'

interface OrderContextType {
  isOpen: boolean
  selectedProductId: string | null
  openOrder: (productId?: string) => void
  closeOrder: () => void
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)

  const openOrder = (productId?: string) => {
    setSelectedProductId(productId ?? null)
    setIsOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeOrder = () => {
    setIsOpen(false)
    setSelectedProductId(null)
    document.body.style.overflow = 'unset'
  }

  return (
    <OrderContext.Provider value={{ isOpen, selectedProductId, openOrder, closeOrder }}>
      {children}
    </OrderContext.Provider>
  )
}

export function useOrder() {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error('useOrder must be used within OrderProvider')
  }
  return context
}

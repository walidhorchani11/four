'use client'

import React, { createContext, useContext, useState } from 'react'

interface OrderContextType {
  isOpen: boolean
  selectedProduct: string | null
  openOrder: (product: string) => void
  closeOrder: () => void
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)

  const openOrder = (product: string) => {
    setSelectedProduct(product)
    setIsOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeOrder = () => {
    setIsOpen(false)
    setSelectedProduct(null)
    document.body.style.overflow = 'unset'
  }

  return (
    <OrderContext.Provider value={{ isOpen, selectedProduct, openOrder, closeOrder }}>
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

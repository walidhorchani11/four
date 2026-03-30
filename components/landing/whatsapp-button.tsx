"use client"

import { useTranslations } from "next-intl"
import { MessageCircle, ShoppingCart } from "lucide-react"
import { getWhatsAppHref } from "@/lib/whatsapp"
import { useOrder } from "./order-context"

export function WhatsAppButton() {
  const t = useTranslations("whatsappFab")
  const tNav = useTranslations("nav")
  const { openOrder } = useOrder()
  const href = getWhatsAppHref()

  return (
    <div className="fixed bottom-6 start-4 end-4 z-50 flex items-center gap-3">
      <button
        type="button"
        onClick={() => openOrder()}
        className="md:hidden inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:scale-105 hover:shadow-xl"
      >
        <ShoppingCart className="h-4 w-4" />
        {tNav("order")}
      </button>

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-all hover:scale-110 hover:bg-green-600 hover:shadow-xl md:h-16 md:w-16"
        aria-label={t("aria")}
      >
        <MessageCircle className="h-7 w-7 md:h-8 md:w-8" />
      </a>
    </div>
  )
}

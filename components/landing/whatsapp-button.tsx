"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { MessageCircle, ShoppingCart } from "lucide-react"
import { getWhatsAppHref } from "@/lib/whatsapp"
import { useOrder, ORDER_FORM_PRIMARY_ID, ORDER_FORM_SECONDARY_ID } from "./order-context"
import { cn } from "@/lib/utils"

/** Mobile : masque le bouton Commander quand un bloc formulaire est déjà visible (évite doublon avec le CTA du formulaire). */
export function WhatsAppButton() {
  const t = useTranslations("whatsappFab")
  const tNav = useTranslations("nav")
  const { openOrder } = useOrder()
  const href = getWhatsAppHref()
  const [orderFormInView, setOrderFormInView] = useState(false)

  useEffect(() => {
    let observer: IntersectionObserver | null = null

    const attach = () => {
      observer?.disconnect()
      observer = null

      if (!window.matchMedia("(max-width: 767px)").matches) {
        setOrderFormInView(false)
        return
      }

      const primary = document.getElementById(ORDER_FORM_PRIMARY_ID)
      const secondary = document.getElementById(ORDER_FORM_SECONDARY_ID)
      const targets = [primary, secondary].filter(Boolean) as HTMLElement[]
      if (targets.length === 0) return

      const flags = new Map<Element, boolean>()
      targets.forEach((el) => flags.set(el, false))

      const sync = () => {
        setOrderFormInView([...flags.values()].some(Boolean))
      }

      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            flags.set(entry.target, entry.isIntersecting)
          }
          sync()
        },
        {
          root: null,
          threshold: [0, 0.05, 0.1],
          /** Réduit la zone utile en bas (bandeau sticky) pour déclencher un peu avant */
          rootMargin: "0px 0px -88px 0px",
        }
      )

      targets.forEach((el) => observer!.observe(el))
    }

    attach()

    const mq = window.matchMedia("(max-width: 767px)")
    const onViewportChange = () => attach()
    mq.addEventListener("change", onViewportChange)

    return () => {
      mq.removeEventListener("change", onViewportChange)
      observer?.disconnect()
    }
  }, [])

  return (
    <div
      className={cn(
        "fixed bottom-6 start-4 end-4 z-50 flex items-center gap-3",
        orderFormInView && "justify-end"
      )}
    >
      <button
        type="button"
        onClick={() => openOrder()}
        className={cn(
          "md:hidden inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:scale-105 hover:shadow-xl",
          orderFormInView && "hidden"
        )}
      >
        <ShoppingCart className="h-4 w-4" />
        {tNav("order")}
      </button>

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-all hover:scale-110 hover:bg-green-600 hover:shadow-xl md:h-16 md:w-16"
        aria-label={t("aria")}
      >
        <MessageCircle className="h-7 w-7 md:h-8 md:w-8" />
      </a>
    </div>
  )
}

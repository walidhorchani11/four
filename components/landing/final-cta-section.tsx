"use client"

import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Flame, ShoppingCart, MessageCircle } from "lucide-react"
import { useOrder } from "./order-context"
import { getWhatsAppHref } from "@/lib/whatsapp"

export function FinalCTASection() {
  const t = useTranslations("finalCta")
  const { openOrder } = useOrder()
  const waHref = getWhatsAppHref()

  return (
    <section className="py-20 bg-gradient-to-br from-foreground to-foreground/90 text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
              <Flame className="h-8 w-8 text-primary" />
            </div>
          </div>

          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            {t("title")}
          </h2>

          <p className="mb-8 text-lg text-primary-foreground/80">
            {t("subtitle")}
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button
              onClick={() => openOrder()}
              size="lg"
              className="group gap-2 text-lg bg-primary hover:bg-primary/90 text-primary-foreground"
              type="button"
            >
              <ShoppingCart className="h-5 w-5" />
              {t("orderNow")}
            </Button>
            <Button size="lg" variant="outline" className="group gap-2 text-lg border-2 border-green-500 bg-green-500 text-white hover:bg-green-600" asChild>
              <a href={waHref} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5" />
                {t("whatsapp")}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

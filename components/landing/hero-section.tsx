"use client"

import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, ShoppingCart } from "lucide-react"
import { useOrder } from "./order-context"
import { getWhatsAppHref } from "@/lib/whatsapp"
import { HeroMosaicImages } from "./hero-mosaic-images"

export function HeroSection() {
  const t = useTranslations("hero")
  const { openOrder } = useOrder()
  const waHref = getWhatsAppHref()

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-background via-background to-secondary/30 pt-16 md:pt-20">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -left-20 top-1/2 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 pb-12 pt-6 lg:py-20">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
          <div className="flex min-w-0 flex-1 flex-col items-center text-center lg:items-start lg:text-left">
            <Badge className="mb-6 bg-primary/10 text-primary hover:bg-primary/20">
              {t("badge")}
            </Badge>

            <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              {t.rich("title", {
                highlight: (chunks) => <span className="text-primary">{chunks}</span>,
              })}
            </h1>

            <p className="mb-8 max-w-xl text-pretty text-lg text-muted-foreground md:text-xl">
              {t("subtitle")}
            </p>

            <div className="mb-10 flex flex-col gap-4 sm:flex-row">
              <Button
                onClick={() => openOrder()}
                size="lg"
                className="group gap-2 text-lg shadow-lg transition-all hover:shadow-xl hover:shadow-primary/25"
                type="button"
              >
                <ShoppingCart className="h-5 w-5 transition-transform group-hover:scale-110" />
                {t("orderNow")}
              </Button>
              <Button size="lg" variant="outline" className="group gap-2 text-lg border-2 hover:bg-green-50 hover:border-green-500 hover:text-green-600" asChild>
                <a href={waHref} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5 text-green-500 transition-transform group-hover:scale-110" />
                  {t("contactWhatsApp")}
                </a>
              </Button>
            </div>
          </div>

          <div className="relative min-w-0 w-full shrink-0 basis-full lg:flex-1 lg:shrink">
            <div className="relative mx-auto aspect-square w-full max-w-lg lg:max-w-none">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 blur-2xl" />
              <div className="absolute inset-0 overflow-hidden rounded-3xl border border-border/50 bg-card shadow-2xl">
                <HeroMosaicImages
                  alt1={t("imageAlt")}
                  alt2={t("imageAlt2")}
                  alt3={t("imageAlt3")}
                />
              </div>
              <div className="absolute -bottom-4 -right-4 z-10 rounded-2xl bg-card p-4 shadow-xl border border-border/50 animate-float">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-2xl">🔥</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{t("floatingTitle")}</p>
                    <p className="text-sm text-muted-foreground">{t("floatingSubtitle")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

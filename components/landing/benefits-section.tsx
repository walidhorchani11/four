"use client"

import { useTranslations } from "next-intl"
import { Flame, Coins, Zap, Cookie, Wrench, ThumbsUp } from "lucide-react"

const benefitKeys = ["heat", "money", "noElectric", "even", "durable", "easy"] as const
const icons = [Flame, Coins, Zap, Cookie, Wrench, ThumbsUp]

export function BenefitsSection() {
  const t = useTranslations("benefits")

  return (
    <section id="avantages" className="py-20 bg-background scroll-mt-24 md:scroll-mt-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {t("title")}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefitKeys.map((key, index) => {
            const Icon = icons[index]
            return (
              <div
                key={key}
                className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">
                  {t(`items.${key}.title`)}
                </h3>
                <p className="text-muted-foreground">
                  {t(`items.${key}.desc`)}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

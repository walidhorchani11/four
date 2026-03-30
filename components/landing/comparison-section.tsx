"use client"

import { useTranslations } from "next-intl"
import { Check, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const ROW_KEYS = ["power", "consumption", "speed", "reliability", "cost"] as const

export function ComparisonSection() {
  const t = useTranslations("comparison")

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {t("title")}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
            <div className="grid grid-cols-3 border-b border-border bg-muted/50">
              <div className="p-4 md:p-6">
                <span className="font-semibold text-foreground">{t("colFeature")}</span>
              </div>
              <div className="border-l border-border p-4 md:p-6 text-center bg-primary/5">
                <Badge className="bg-primary text-primary-foreground">{t("colGas")}</Badge>
              </div>
              <div className="border-l border-border p-4 md:p-6 text-center">
                <span className="text-sm text-muted-foreground">{t("colElectric")}</span>
              </div>
            </div>

            {ROW_KEYS.map((key, index) => (
              <div
                key={key}
                className={`grid grid-cols-3 ${
                  index < ROW_KEYS.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <div className="p-4 md:p-6">
                  <span className="text-foreground">{t(`rows.${key}.feature`)}</span>
                </div>
                <div className="flex items-center justify-center gap-2 border-l border-border p-4 md:p-6 bg-primary/5">
                  <Check className="h-5 w-5 text-primary" />
                  <span className="font-medium text-primary">{t(`rows.${key}.gas`)}</span>
                </div>
                <div className="flex items-center justify-center gap-2 border-l border-border p-4 md:p-6">
                  <X className="h-5 w-5 text-destructive" />
                  <span className="text-muted-foreground">{t(`rows.${key}.electric`)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ShoppingCart } from "lucide-react"
import { useOrder } from "./order-context"
import { productsCatalog } from "./products-catalog"

const FEATURE_INDEX = [0, 1, 2] as const

export function ProductsSection() {
  const { openOrder } = useOrder()
  const t = useTranslations("products")

  return (
    <section className="py-20 bg-secondary/30" id="produits">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary">{t("badge")}</Badge>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {t("title")}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {productsCatalog.map((product) => (
            <div
              key={product.id}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/50 hover:shadow-xl"
            >
              {product.badge ? (
                <div className="absolute left-4 top-4 z-10">
                  <Badge className="bg-primary text-primary-foreground shadow-lg">
                    {t(`badges.${product.badge}`)}
                  </Badge>
                </div>
              ) : null}

              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <Image
                  src={product.image}
                  alt={t(`items.${product.id}.name`)}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-6">
                <h3 className="mb-2 text-xl font-bold text-foreground">
                  {t(`items.${product.id}.name`)}
                </h3>

                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
                    {t(`items.${product.id}.capacity`)}
                  </span>
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
                    {t(`items.${product.id}.usage`)}
                  </span>
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
                    {t(`items.${product.id}.gasType`)}
                  </span>
                </div>

                <ul className="mb-6 space-y-2">
                  {FEATURE_INDEX.map((fi) => (
                    <li key={fi} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      {t(`items.${product.id}.features.${fi}`)}
                    </li>
                  ))}
                </ul>

                <div className="mb-4 flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-foreground">{product.price} DT</span>
                  {product.oldPrice ? (
                    <span className="text-lg text-muted-foreground line-through">{product.oldPrice} DT</span>
                  ) : null}
                </div>

                <Button
                  onClick={() => openOrder(product.id)}
                  className="w-full gap-2 text-base"
                  size="lg"
                  type="button"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {t("orderNow")}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

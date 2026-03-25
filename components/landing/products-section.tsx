"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ShoppingCart } from "lucide-react"
import { useOrder } from "./order-context"

const products = [
  {
    name: "Four Compact",
    image: "/images/oven-compact.jpg",
    price: "450",
    oldPrice: "550",
    capacity: "35L",
    usage: "Usage domestique",
    gasType: "Butane/Propane",
    features: ["Chauffe rapide", "Compact", "Facile a installer"],
    badge: "Populaire"
  },
  {
    name: "Four Professionnel",
    image: "/images/oven-professional.jpg",
    price: "850",
    oldPrice: "1050",
    capacity: "60L",
    usage: "Maison & Commerce",
    gasType: "Butane/Propane",
    features: ["Grande capacite", "Multi-niveaux", "Usage intensif"],
    badge: "Meilleure vente"
  },
  {
    name: "Four Pizza",
    image: "/images/oven-pizza.jpg",
    price: "1200",
    oldPrice: "1500",
    capacity: "80L",
    usage: "Pizzeria & Boulangerie",
    gasType: "Propane",
    features: ["Pierre refractaire", "Haute temperature", "Pro"],
    badge: "Premium"
  }
]

export function ProductsSection() {
  const { openOrder } = useOrder()

  return (
    <section className="py-20 bg-secondary/30" id="produits">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary">Nos Produits</Badge>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Nos modeles disponibles
          </h2>
          <p className="text-lg text-muted-foreground">
            Choisissez le four qui correspond a vos besoins
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/50 hover:shadow-xl"
            >
              {/* Badge */}
              <div className="absolute left-4 top-4 z-10">
                <Badge className="bg-primary text-primary-foreground shadow-lg">
                  {product.badge}
                </Badge>
              </div>

              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="mb-2 text-xl font-bold text-foreground">
                  {product.name}
                </h3>

                {/* Specs */}
                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
                    {product.capacity}
                  </span>
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
                    {product.usage}
                  </span>
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
                    {product.gasType}
                  </span>
                </div>

                {/* Features */}
                <ul className="mb-6 space-y-2">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Price */}
                <div className="mb-4 flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-foreground">{product.price} DT</span>
                  <span className="text-lg text-muted-foreground line-through">{product.oldPrice} DT</span>
                </div>

                {/* CTA */}
                <Button 
                  onClick={() => openOrder(product.name)}
                  className="w-full gap-2 text-base" 
                  size="lg"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Commander maintenant
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

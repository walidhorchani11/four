"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, MessageCircle, ShoppingCart } from "lucide-react"
import { useOrder } from "./order-context"

export function HeroSection() {
  const { openOrder } = useOrder()
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-background via-background to-secondary/30">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -left-20 top-1/2 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 py-12 lg:py-20">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
          {/* Content */}
          <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left">
            <Badge className="mb-6 bg-primary/10 text-primary hover:bg-primary/20">
              Top vente en Tunisie
            </Badge>
            
            <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Cuisinez plus vite et{" "}
              <span className="text-primary">economisez</span> avec un four a gaz performant
            </h1>
            
            <p className="mb-8 max-w-xl text-pretty text-lg text-muted-foreground md:text-xl">
              Cuisson rapide, consommation economique et resultats parfaits. Ideal pour la maison et les petits commerces.
            </p>

            {/* CTAs */}
            <div className="mb-10 flex flex-col gap-4 sm:flex-row">
              <Button 
                onClick={() => openOrder('Four Compact')}
                size="lg" 
                className="group gap-2 text-lg shadow-lg transition-all hover:shadow-xl hover:shadow-primary/25"
              >
                <ShoppingCart className="h-5 w-5 transition-transform group-hover:scale-110" />
                Commander maintenant
              </Button>
              <Button size="lg" variant="outline" className="group gap-2 text-lg border-2 hover:bg-green-50 hover:border-green-500 hover:text-green-600">
                <MessageCircle className="h-5 w-5 text-green-500 transition-transform group-hover:scale-110" />
                Contacter sur WhatsApp
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>Livraison rapide en Tunisie</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>Paiement a la livraison</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>Garantie incluse</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative flex-1">
            <div className="relative aspect-square max-w-lg mx-auto lg:max-w-none">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 blur-2xl" />
              <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-card shadow-2xl">
                <Image
                  src="/images/oven-hero.jpg"
                  alt="Four a gaz professionnel"
                  width={600}
                  height={600}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 rounded-2xl bg-card p-4 shadow-xl border border-border/50 animate-float">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-2xl">🔥</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">+100 clients</p>
                    <p className="text-sm text-muted-foreground">satisfaits</p>
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

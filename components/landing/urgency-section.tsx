"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Clock, Truck, ShoppingCart, MessageCircle } from "lucide-react"

export function UrgencySection() {
  return (
    <section className="py-16 bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <Badge className="mb-6 gap-2 bg-destructive/10 text-destructive px-4 py-2">
            <AlertTriangle className="h-4 w-4" />
            Offre limitee
          </Badge>
          
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Stock limite cette semaine
          </h2>
          
          <p className="mb-8 text-lg text-muted-foreground">
            Commandez maintenant avant rupture. Profitez de nos prix exceptionnels !
          </p>

          <div className="mb-8 flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center gap-2 text-foreground">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <span className="font-medium">Livraison 24-48h</span>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <span className="font-medium">Commandez aujourd{"'"}hui</span>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="group gap-2 text-lg shadow-lg animate-pulse-glow">
              <ShoppingCart className="h-5 w-5" />
              Commander maintenant
            </Button>
            <Button size="lg" variant="outline" className="group gap-2 text-lg border-2 hover:bg-green-50 hover:border-green-500 hover:text-green-600">
              <MessageCircle className="h-5 w-5 text-green-500" />
              Contacter sur WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

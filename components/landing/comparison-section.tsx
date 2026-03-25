"use client"

import { Check, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const comparisons = [
  {
    feature: "Dependance electricite",
    gasOven: { value: "Non", positive: true },
    electricOven: { value: "Oui", positive: false }
  },
  {
    feature: "Consommation",
    gasOven: { value: "Economique", positive: true },
    electricOven: { value: "Elevee", positive: false }
  },
  {
    feature: "Vitesse de cuisson",
    gasOven: { value: "Rapide", positive: true },
    electricOven: { value: "Lente", positive: false }
  },
  {
    feature: "Fiabilite",
    gasOven: { value: "Excellente", positive: true },
    electricOven: { value: "Variable", positive: false }
  },
  {
    feature: "Cout sur le long terme",
    gasOven: { value: "Faible", positive: true },
    electricOven: { value: "Eleve", positive: false }
  }
]

export function ComparisonSection() {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Pourquoi notre four est meilleur ?
          </h2>
          <p className="text-lg text-muted-foreground">
            Comparez et voyez la difference
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
            {/* Header */}
            <div className="grid grid-cols-3 border-b border-border bg-muted/50">
              <div className="p-4 md:p-6">
                <span className="font-semibold text-foreground">Caracteristique</span>
              </div>
              <div className="border-l border-border p-4 md:p-6 text-center bg-primary/5">
                <Badge className="bg-primary text-primary-foreground">Notre Four a Gaz</Badge>
              </div>
              <div className="border-l border-border p-4 md:p-6 text-center">
                <span className="text-sm text-muted-foreground">Four Electrique</span>
              </div>
            </div>

            {/* Rows */}
            {comparisons.map((row, index) => (
              <div
                key={index}
                className={`grid grid-cols-3 ${
                  index < comparisons.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <div className="p-4 md:p-6">
                  <span className="text-foreground">{row.feature}</span>
                </div>
                <div className="flex items-center justify-center gap-2 border-l border-border p-4 md:p-6 bg-primary/5">
                  <Check className="h-5 w-5 text-primary" />
                  <span className="font-medium text-primary">{row.gasOven.value}</span>
                </div>
                <div className="flex items-center justify-center gap-2 border-l border-border p-4 md:p-6">
                  <X className="h-5 w-5 text-destructive" />
                  <span className="text-muted-foreground">{row.electricOven.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

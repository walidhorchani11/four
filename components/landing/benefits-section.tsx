"use client"

import { Flame, Coins, Zap, Cookie, Wrench, ThumbsUp } from "lucide-react"

const benefits = [
  {
    icon: Flame,
    title: "Chauffe rapide",
    description: "Puissance elevee pour une montee en temperature immediate"
  },
  {
    icon: Coins,
    title: "Economie d'argent",
    description: "Reduisez votre facture d'electricite de maniere significative"
  },
  {
    icon: Zap,
    title: "Sans electricite",
    description: "Fonctionne meme en cas de coupure de courant"
  },
  {
    icon: Cookie,
    title: "Cuisson uniforme",
    description: "Parfait pour pain, pizza, patisserie et plus encore"
  },
  {
    icon: Wrench,
    title: "Durable et robuste",
    description: "Construction solide pour une utilisation intensive"
  },
  {
    icon: ThumbsUp,
    title: "Facile a utiliser",
    description: "Prise en main simple et intuitive pour tous"
  }
]

export function BenefitsSection() {
  return (
    <section id="avantages" className="py-20 bg-background scroll-mt-24 md:scroll-mt-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Pourquoi choisir un four a gaz ?
          </h2>
          <p className="text-lg text-muted-foreground">
            Decouvrez tous les avantages qui font du four a gaz le choix ideal
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                <benefit.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

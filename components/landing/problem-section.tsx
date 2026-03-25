"use client"

import { XCircle, CheckCircle, Zap, AlertTriangle } from "lucide-react"

export function ProblemSection() {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Problem */}
            <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <h2 className="mb-4 text-2xl font-bold text-foreground">
                Fatigue des coupures d{"'"}electricite et des fours lents ?
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-muted-foreground">
                  <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                  <span>Les fours electriques consomment beaucoup</span>
                </li>
                <li className="flex items-start gap-3 text-muted-foreground">
                  <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                  <span>Dependent totalement de l{"'"}electricite</span>
                </li>
                <li className="flex items-start gap-3 text-muted-foreground">
                  <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                  <span>Temps de chauffe tres long</span>
                </li>
                <li className="flex items-start gap-3 text-muted-foreground">
                  <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                  <span>Facture d{"'"}electricite elevee</span>
                </li>
              </ul>
            </div>

            {/* Solution */}
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h2 className="mb-4 text-2xl font-bold text-foreground">
                Notre solution : le four a gaz
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-muted-foreground">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span>Cuisson rapide et puissante</span>
                </li>
                <li className="flex items-start gap-3 text-muted-foreground">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span>Fonctionne sans electricite</span>
                </li>
                <li className="flex items-start gap-3 text-muted-foreground">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span>Economies sur la facture</span>
                </li>
                <li className="flex items-start gap-3 text-muted-foreground">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span>Resultats professionnels</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

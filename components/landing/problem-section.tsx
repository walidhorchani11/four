"use client"

import { useTranslations } from "next-intl"
import { XCircle, CheckCircle, Zap, AlertTriangle } from "lucide-react"

export function ProblemSection() {
  const t = useTranslations("problem")

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <h2 className="mb-4 text-2xl font-bold text-foreground">
                {t("problemTitle")}
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-muted-foreground">
                  <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                  <span>{t("problem1")}</span>
                </li>
                <li className="flex items-start gap-3 text-muted-foreground">
                  <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                  <span>{t("problem2")}</span>
                </li>
                <li className="flex items-start gap-3 text-muted-foreground">
                  <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                  <span>{t("problem3")}</span>
                </li>
                <li className="flex items-start gap-3 text-muted-foreground">
                  <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                  <span>{t("problem4")}</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h2 className="mb-4 text-2xl font-bold text-foreground">
                {t("solutionTitle")}
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-muted-foreground">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span>{t("solution1")}</span>
                </li>
                <li className="flex items-start gap-3 text-muted-foreground">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span>{t("solution2")}</span>
                </li>
                <li className="flex items-start gap-3 text-muted-foreground">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span>{t("solution3")}</span>
                </li>
                <li className="flex items-start gap-3 text-muted-foreground">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span>{t("solution4")}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

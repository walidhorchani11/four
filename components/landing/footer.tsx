"use client"

import { useTranslations } from "next-intl"
import { Flame, Phone, MessageCircle, MapPin } from "lucide-react"

function digitsFromPhoneEnv(): string {
  const wa = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, "")
  if (wa) return wa
  return (process.env.NEXT_PUBLIC_PHONE ?? "").replace(/\D/g, "")
}

/** Libellé : NEXT_PUBLIC_PHONE tel quel si défini, sinon +216 XX XXX XXX depuis WhatsApp. */
function formatContactPhoneForFooter(): string | null {
  const explicit = process.env.NEXT_PUBLIC_PHONE?.trim()
  if (explicit) return explicit
  const digits = digitsFromPhoneEnv()
  if (!digits) return null
  let n = digits
  if (n.startsWith("216")) n = n.slice(3)
  if (n.length >= 8) {
    return `+216 ${n.slice(0, 2)} ${n.slice(2, 5)} ${n.slice(5)}`
  }
  return `+216 ${n}`
}

function telHrefFromEnv(): string | undefined {
  const d = digitsFromPhoneEnv()
  if (!d) return undefined
  const full = d.startsWith("216") ? d : `216${d}`
  return `tel:+${full}`
}

export function Footer() {
  const t = useTranslations("footer")
  const tCommon = useTranslations("common")
  const year = new Date().getFullYear()
  const phoneDisplay = formatContactPhoneForFooter() ?? tCommon("phonePlaceholder")
  const telHref = telHrefFromEnv()

  return (
    <footer className="border-t border-border bg-card py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Flame className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">{tCommon("brandFull")}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              {telHref ? (
                <a href={telHref} className="hover:text-foreground transition-colors">
                  {phoneDisplay}
                </a>
              ) : (
                <span>{phoneDisplay}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-green-500" />
              <span>{t("whatsappAvailable")}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{t("country")}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>{t("rights", { year })}</p>
        </div>
      </div>
    </footer>
  )
}

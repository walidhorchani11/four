"use client"

import { useTranslations } from "next-intl"
import { Flame, Phone, MessageCircle, MapPin, Facebook } from "lucide-react"

const DEFAULT_FACEBOOK_URL =
  "https://www.facebook.com/profile.php?id=61572707513694"

function digitsFromPhoneEnv(): string {
  return (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, "")
}

/** Libellé formaté à partir de NEXT_PUBLIC_WHATSAPP_NUMBER. */
function formatContactPhoneForFooter(): string | null {
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
  const facebookUrl =
    process.env.NEXT_PUBLIC_FACEBOOK_URL?.trim() || DEFAULT_FACEBOOK_URL

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
              {telHref ? (
                <a href={telHref} className="hover:text-foreground transition-colors">
                  {t("whatsapp")}: {phoneDisplay}
                </a>
              ) : (
                <span>{t("whatsapp")}: {phoneDisplay}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{t("country")}</span>
            </div>
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-foreground transition-colors"
            >
              <Facebook className="h-4 w-4 text-[#1877F2]" aria-hidden />
              <span>{t("facebook")}</span>
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>{t("rights", { year })}</p>
        </div>
      </div>
    </footer>
  )
}

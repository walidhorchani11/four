"use client"

import { useState, useEffect } from "react"
import { useLocale, useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Flame, Menu, X, ShoppingCart } from "lucide-react"
import { Link, usePathname } from "@/i18n/navigation"
import { useOrder } from "./order-context"

export function Header() {
  const t = useTranslations("nav")
  const tCommon = useTranslations("common")
  const tLang = useTranslations("lang")
  const locale = useLocale()
  const pathname = usePathname()
  const { openOrder } = useOrder()
  const otherLocale = locale === "ar" ? "fr" : "ar"

  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-md border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between md:h-20">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Flame className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">{tCommon("brand")}</span>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="/#produits"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {t("products")}
            </Link>
            <Link
              href="/#avantages"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {t("benefits")}
            </Link>
            <Link
              href="/#faq"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {t("faq")}
            </Link>
            <Link
              href={pathname}
              locale={otherLocale}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {tLang(otherLocale === "ar" ? "ar" : "fr")}
            </Link>
          </nav>

          <div className="hidden md:block">
            <Button className="gap-2" type="button" onClick={() => openOrder()}>
              <ShoppingCart className="h-4 w-4" />
              {t("order")}
            </Button>
          </div>

          <button
            className="md:hidden"
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={tCommon("toggleMenu")}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="border-t border-border bg-background py-4 md:hidden">
            <nav className="flex flex-col gap-4">
              <Link
                href="/#produits"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("products")}
              </Link>
              <Link
                href="/#avantages"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("benefits")}
              </Link>
              <Link
                href="/#faq"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("faq")}
              </Link>
              <Link
                href={pathname}
                locale={otherLocale}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {tLang(otherLocale === "ar" ? "ar" : "fr")}
              </Link>
              <Button className="mt-2 w-full gap-2" type="button" onClick={() => { setIsMobileMenuOpen(false); openOrder() }}>
                <ShoppingCart className="h-4 w-4" />
                {t("order")}
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

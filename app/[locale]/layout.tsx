import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Analytics } from '@vercel/analytics/next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { Noto_Sans, Noto_Sans_Arabic } from 'next/font/google'
import { OrderProvider } from '@/components/landing/order-context'
import { Toaster } from '@/components/ui/sonner'
import { routing } from '@/i18n/routing'
import { getSiteOrigin } from '@/lib/site-url'
import { MetaPixel } from '@/components/meta-pixel'
import '../globals.css'

const notoSans = Noto_Sans({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
})

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ['arabic', 'latin', 'latin-ext'],
  display: 'swap',
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'metadata' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })

  const pathname = locale === routing.defaultLocale ? '/' : `/${locale}`
  const siteOrigin = getSiteOrigin()

  return {
    metadataBase: new URL(siteOrigin),
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: pathname,
      languages: {
        ar: '/',
        fr: '/fr',
      },
    },
    openGraph: {
      type: 'website',
      siteName: tCommon('brandFull'),
      title: t('title'),
      description: t('description'),
      url: pathname,
      locale: locale === 'ar' ? 'ar_TN' : 'fr_FR',
      alternateLocale: locale === 'ar' ? ['fr_FR'] : ['ar_TN'],
      images: [
        {
          url: '/images/Fh.webp',
          alt: t('ogImageAlt'),
        },
      ],
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages()
  const dir = locale === 'ar' ? 'rtl' : 'ltr'

  const fontClassName = locale === 'ar' ? notoSansArabic.className : notoSans.className

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning className={fontClassName}>
      <body className="antialiased">
        <MetaPixel />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <OrderProvider>
            {children}
            <Toaster richColors position="top-center" />
            <Analytics />
          </OrderProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

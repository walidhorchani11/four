import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Analytics } from '@vercel/analytics/next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { Noto_Sans } from 'next/font/google'
import { OrderProvider } from '@/components/landing/order-context'
import { OrderFormModal } from '@/components/landing/order-form-modal'
import { Toaster } from '@/components/ui/sonner'
import { routing } from '@/i18n/routing'
import '../globals.css'

const notoSans = Noto_Sans({
  subsets: ['latin', 'arabic'],
  variable: '--font-sans',
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
  return {
    title: t('title'),
    description: t('description'),
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

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body className={`${notoSans.variable} font-sans antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <OrderProvider>
            {children}
            <OrderFormModal />
            <Toaster richColors position="top-center" />
            <Analytics />
          </OrderProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

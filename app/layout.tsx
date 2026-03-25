import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { OrderProvider } from '@/components/landing/order-context'
import { OrderFormModal } from '@/components/landing/order-form-modal'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: 'Fours a Gaz Tunisie | Cuisson Rapide et Economique',
  description: 'Decouvrez nos fours a gaz performants pour la maison et les petits commerces. Livraison rapide en Tunisie, paiement a la livraison, garantie incluse.',
  keywords: ['four a gaz', 'tunisie', 'cuisson', 'boulangerie', 'patisserie', 'economie energie'],
  authors: [{ name: 'Fours Gaz Tunisie' }],
  openGraph: {
    title: 'Fours a Gaz Tunisie | Cuisson Rapide et Economique',
    description: 'Cuisinez plus vite et economisez avec un four a gaz performant. Ideal pour la maison et les petits commerces.',
    type: 'website',
    locale: 'fr_TN',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ea580c',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} font-sans antialiased`}>
        <OrderProvider>
          {children}
          <OrderFormModal />
          <Analytics />
        </OrderProvider>
      </body>
    </html>
  )
}

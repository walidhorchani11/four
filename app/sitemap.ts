import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { getSiteOrigin } from '@/lib/site-url'

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = getSiteOrigin()
  const lastModified = new Date()

  return routing.locales.map((locale) => ({
    url:
      locale === routing.defaultLocale ? origin : `${origin}/${locale}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 1,
  }))
}

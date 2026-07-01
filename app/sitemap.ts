import type { MetadataRoute } from 'next'
import { BOOKS } from '@/lib/data'
import { SITE_URL } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_URL

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: 'monthly', priority: 1 },
    { url: `${base}/about`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/instructions`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
  ]

  const notebookPages: MetadataRoute.Sitemap = BOOKS.flatMap(book =>
    book.chapters.map((ch) => ({
      url: `${base}/notebook/${book.id}/${ch.ch}`,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }))
  )

  return [...staticPages, ...notebookPages]
}

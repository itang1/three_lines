import type { MetadataRoute } from 'next'
import { BOOKS } from '@/lib/data'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://threelines.app'

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: 'monthly', priority: 1 },
    { url: `${base}/about`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/instructions`, changeFrequency: 'monthly', priority: 0.8 },
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

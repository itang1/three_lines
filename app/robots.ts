import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://three-lines-sepia.vercel.app'
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/profile'],
    },
    sitemap: `${base}/sitemap.xml`,
  }
}

import { BASE_URL } from '@/constants'

export default function robots() {
  return {
    rules: [
      {
        userAgent: ['Googlebot', '*'],
        allow: ['/'],
        disallow: ['/forms/', '/orders/'],
      }
    ],
    sitemap: `${BASE_URL}/sitemap.xml`
  }
}

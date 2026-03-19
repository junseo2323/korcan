
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/admin/', '/my/', '/login', '/register', '/community/write', '/market/sell'],
        },
        sitemap: 'https://korcan.cc/sitemap.xml',
    }
}

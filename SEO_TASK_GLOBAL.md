# SEO Task: Global Layout Updates

Please update `src/app/layout.tsx` for better SEO.

**1. Viewport Migration (Next.js 14+)**
- Remove the `viewport` property from the `metadata` object.
- Create a new named export:
  ```typescript
  import type { Metadata, Viewport } from 'next' // Update import

  export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  }
  ```

**2. Canonical URL**
- In the `metadata` object, add:
  ```typescript
  alternates: {
    canonical: './',
  },
  ```
- Keep `metadataBase: new URL('https://korcan.cc')` as is.

**3. Organization Schema**
- Currently, there is a `WebSite` schema.
- Please add an `Organization` schema.
- Use `@graph` to combine them in a single JSON-LD block if possible, or just add another object to the list if it's an array, or a separate script tag.
- Organization Data:
  ```json
  {
    "@type": "Organization",
    "name": "KorCan",
    "url": "https://korcan.cc",
    "logo": "https://korcan.cc/logo.png",
    "description": "캐나다 한인 커뮤니티"
  }
  ```

**4. Robots**
- Add `robots: { index: true, follow: true }` to the `metadata` object to be explicit.

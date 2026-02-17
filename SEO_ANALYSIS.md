# KorCan Advanced SEO Analysis & Improvement Plan

> Analyzed: 2026-02-17
> Project: Next.js 14+ App Router — `https://korcan.cc`
> Current baseline: sitemap.ts, robots.ts, generateMetadata on community/[id] and market/[id], basic JSON-LD.

---

## Executive Summary

The project has a solid structural foundation but several high-impact SEO gaps remain before it can be considered production-ready. The most critical issues are: (1) most pages are fully client-rendered with no server-side metadata, (2) canonical tags are absent everywhere, (3) the `<html lang>` attribute targets the wrong language, and (4) real-estate listings — arguably the highest-value content — have zero SEO coverage.

---

## 1. Semantic HTML Structure

### Findings

| Page | Issues |
|---|---|
| `src/app/page.tsx` (Home) | `<h1>` contains personalized greeting ("안녕하세요, 방문자님") — meaningless to crawlers. No `<main>`, `<section>`, or landmark roles. |
| `src/app/community/page.tsx` | `'use client'` — **fully client-rendered**. Crawlers see an empty shell. `<h1>커뮤니티</h1>` exists but the post list is invisible to bots. `PostCard` uses `<div onClick>` instead of `<a>` links — not crawlable. |
| `src/app/market/page.tsx` | `'use client'` — same issue as community. Post cards are `<div onClick>` wrappers with no `<a>` href. |
| `src/app/real-estate/[id]/page.tsx` | `'use client'` — **no `generateMetadata` at all**. Uses raw `<img>` instead of `next/image`. No landmark semantics. |
| `src/app/community/[id]/PostClient.tsx` | `'use client'` — content is fetched client-side via `fetch('/api/posts/[id]')`. Although the parent server component injects JSON-LD, the actual `<article>` body is not present in the server HTML. |
| `src/app/market/[id]/ProductClient.tsx` | Same pattern as above. |
| All pages | Missing `<main>` landmark element. Missing `<nav>` on BottomNavigation shell. |

### Recommendations

1. **Convert listing pages to server components** (`/community`, `/market`) or use a hybrid: render the initial page of posts on the server, hydrate client interactions.
2. **Replace `<div onClick>` post/product cards** with `<a href="/community/{id}">` elements (use `next/link`). This is the single highest-impact change for crawlability.
3. **Fix `<html lang="en">`** → `<html lang="ko">` (or `lang="ko-KR"`). The site's primary language is Korean; this affects voice search, accessibility, and language-specific ranking signals.
4. **Add `<main>` wrapper** inside the `Shell` component that wraps page content.
5. **Make the Home page `<h1>` static**: Use a fixed `<h1>` like "캐나다 한인 커뮤니티 KorCan" and move the personalized greeting to a `<p>` or `<span>`.
6. **Add `<article>` around post/product detail content** in the client components for semantic clarity even post-hydration.
7. **Use proper heading hierarchy**: Most pages jump from `<h1>` to `<h3>` (e.g., `BlockTitle` in HomeWidgets). Insert `<h2>` for section headers (Popular Posts, Meetups, Properties).

---

## 2. Structured Data (JSON-LD)

### Current State

- `WebSite` + `SearchAction` on root layout ✓
- `BlogPosting` on `/community/[id]` ✓
- `Product` + `Offer` on `/market/[id]` ✓

### Missing Schemas

#### 2.1 `Organization` — Root Layout
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "KorCan",
  "url": "https://korcan.cc",
  "logo": "https://korcan.cc/logo.png",
  "sameAs": [],
  "description": "캐나다 한인 커뮤니티 플랫폼"
}
```

#### 2.2 `BreadcrumbList` — All Detail Pages
All detail pages (`/community/[id]`, `/market/[id]`, `/real-estate/[id]`) lack breadcrumb schema. This enables breadcrumb display in Google SERPs.

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://korcan.cc" },
    { "@type": "ListItem", "position": 2, "name": "커뮤니티", "item": "https://korcan.cc/community" },
    { "@type": "ListItem", "position": 3, "name": "[POST TITLE]" }
  ]
}
```

#### 2.3 `RealEstateListing` / `Apartment` — `/real-estate/[id]`
The highest-value content has **no JSON-LD at all**. The `RealEstateListing` type (or `Apartment`/`House` under `Accommodation`) maps directly to property listings.

```json
{
  "@context": "https://schema.org",
  "@type": "RealEstateListing",
  "name": "[title]",
  "description": "[description]",
  "url": "https://korcan.cc/real-estate/[id]",
  "datePosted": "[createdAt]",
  "image": ["[image urls]"],
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "[city]",
    "addressCountry": "CA"
  },
  "offers": {
    "@type": "Offer",
    "price": "[price]",
    "priceCurrency": "CAD"
  }
}
```

#### 2.4 `Event` — Meetup posts
Posts with `category === '모임'` map naturally to `Event` schema.

```json
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "[meetup title]",
  "startDate": "[meetup.date]",
  "location": {
    "@type": "Place",
    "name": "[meetup.region]",
    "address": { "@type": "PostalAddress", "addressCountry": "CA" }
  },
  "organizer": { "@type": "Person", "name": "[organizer name]" }
}
```

#### 2.5 `BlogPosting` — Missing `url` and `mainEntityOfPage`
Current BlogPosting schema omits `url` and `mainEntityOfPage`, which are important for Google News and Discover signals:
```json
{
  "url": "https://korcan.cc/community/[id]",
  "mainEntityOfPage": { "@type": "WebPage", "@id": "https://korcan.cc/community/[id]" },
  "publisher": {
    "@type": "Organization",
    "name": "KorCan",
    "logo": { "@type": "ImageObject", "url": "https://korcan.cc/logo.png" }
  }
}
```

#### 2.6 `ItemList` — Listing pages
Add `ItemList` schema to `/community` and `/market` index pages (server-rendered) to help Google understand the list structure.

---

## 3. Performance & Core Web Vitals

### Findings

| Issue | Location | Impact |
|---|---|---|
| Raw `<img>` tags everywhere | `PostClient.tsx:254,369,381`, `ProductClient.tsx:298`, `real-estate/[id]:284` | No lazy loading, no size hints → CLS & LCP regression |
| `next/image` not used for any user content | All client components | Missing automatic WebP conversion, blur placeholder, priority hints |
| `viewport` set in `metadata` export (deprecated) | `layout.tsx:30` | Next.js 14+ requires `viewport` in separate `export const viewport` export |
| `SearchAction` targets `/search?q=` but no `/search` route exists | `layout.tsx:59` | Google may deindex the sitelinks search box if the endpoint 404s |
| Styled-components (CSS-in-JS) | All components | Causes FOUC on first load; no critical CSS extraction for SSR paths |
| No `<link rel="preconnect">` for external origins | layout.tsx | Missing preconnect for Kakao OAuth, S3/CDN image origin, Google Maps |
| Google Maps API loaded synchronously via `APIProvider` | `real-estate/[id]` | Blocks main thread; no `loading="lazy"` equivalent |
| No font optimization | layout.tsx | If using system fonts it's fine, but if adding Google Fonts, must use `next/font` |

### Recommendations

1. **Replace all `<img>` with `next/image`** in client components, passing `width`, `height`, and `alt`. For dynamic user images, use `fill` with a sized wrapper.
2. **Move `viewport` to a separate export**:
   ```ts
   // layout.tsx
   export const viewport: Viewport = {
     width: 'device-width',
     initialScale: 1,
     maximumScale: 1,
   }
   ```
3. **Add `<link rel="preconnect">` in the layout** for known external origins (Kakao CDN, your image storage bucket, `maps.googleapis.com`).
4. **Mark above-the-fold images with `priority`** on `next/image` (e.g., hero images in property listings).
5. **Either implement `/search` route or remove the `SearchAction` JSON-LD** from the root layout.
6. **Lazy-load Google Maps** — only initialize `APIProvider` when the map section scrolls into view (use Intersection Observer).

---

## 4. Canonical Tags

### Findings

**Canonical tags are completely absent** across the entire project. `metadataBase` is set in the root layout, but no page exports `alternates.canonical`.

High-risk duplicate content scenarios:
- `/community?tab=meetup` and `/community` render the same page component — Google may treat them as duplicates.
- `/market` with query params (filters) could generate duplicate URLs.
- `/` (home) has no canonical, risking indexation of `https://korcan.cc/?ref=...` variants.

### Recommendations

1. **Add canonical to root layout** (covers the homepage):
   ```ts
   // layout.tsx metadata
   alternates: {
     canonical: 'https://korcan.cc',
   }
   ```
2. **Add canonical to each static page** (`/community`, `/market`, `/real-estate`):
   ```ts
   export const metadata: Metadata = {
     alternates: { canonical: 'https://korcan.cc/community' }
   }
   ```
3. **Add self-referencing canonical in `generateMetadata`** for all dynamic routes:
   ```ts
   // community/[id]/page.tsx
   alternates: {
     canonical: `https://korcan.cc/community/${id}`
   }
   ```
4. **Handle query param canonicalization**: For `/community?tab=meetup`, either add a `noindex` to meetup tab or ensure the canonical points to `/community`.

---

## 5. Social Sharing (OpenGraph / Twitter Cards)

### Findings

| Page | OG Title | OG Description | OG Image | Twitter Card |
|---|---|---|---|---|
| Root layout | ✓ | ✓ | ✗ Missing | ✓ (no image) |
| `/community/[id]` | ✓ | ✓ | ✓ (conditional) | ✗ Not set |
| `/market/[id]` | ✓ | ✓ | ✓ (conditional) | ✗ Not set |
| `/real-estate/[id]` | ✗ | ✗ | ✗ | ✗ |
| `/community` (list) | ✗ | ✗ | ✗ | ✗ |
| `/market` (list) | ✗ | ✗ | ✗ | ✗ |

**Critical gaps:**
1. No `og:image` on the root layout. When the homepage is shared, no image appears.
2. Twitter card metadata is missing on detail pages (only set in root layout).
3. Market product page OG type is `'website'` — should be `'product'` or at minimum include product-specific OG tags (`og:price:amount`, `og:price:currency`).
4. No `og:locale:alternate` — the site serves Korean content but OG locale is `ko_KR` (good), however no alternate locale is declared.

### Recommendations

1. **Create a default OG image** (1200×630px) at `/public/og-default.jpg` and add to root metadata:
   ```ts
   openGraph: {
     images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'KorCan' }]
   }
   ```
2. **Add Twitter card metadata to `generateMetadata`** in community/[id] and market/[id]:
   ```ts
   twitter: {
     card: 'summary_large_image',
     images: imageUrl ? [imageUrl] : ['/og-default.jpg'],
   }
   ```
3. **Implement dynamic OG image generation** via `next/og` (App Router image route):
   - Create `src/app/api/og/route.tsx` using `ImageResponse`
   - Generate custom cards for posts (title + category + site branding)
   - Generate custom cards for products (product image + price overlay)
   - Reference via `og:image` URL: `https://korcan.cc/api/og?type=post&id={id}`
4. **Fix Market OG type** from `'website'` to `'product'` and add `og:price:amount`, `og:price:currency`.
5. **Add OG metadata to `/real-estate/[id]`** once the page is converted to a server component.
6. **Add `og:site_name`** to all `generateMetadata` returns (it's only in the root layout currently).

---

## 6. Accessibility (A11y) — SEO-Relevant Checks

### Findings

| Issue | Location | SEO Impact |
|---|---|---|
| `<img>` tags missing `alt` text | `PostClient.tsx:256` (`alt="Meetup Thumbnail"` — generic), `ProductClient.tsx:298` (no alt) | Image indexing, accessibility |
| Interactive `<div>` instead of `<button>` or `<a>` | Post cards in community/page.tsx | Not keyboard-navigable; crawlers can't follow |
| `<img src={p.image || '/placeholder-user.svg'}>` missing alt | `PostClient.tsx:369` | Participant avatars have no alt |
| `CarouselImage` in real-estate has no `alt` | `real-estate/[id]/page.tsx:284` | Property images not indexed |
| `ProductImage` has no `alt` | `ProductClient.tsx:298` | Product images not indexed |
| `BottomNavigation` lacks `<nav aria-label>` | `BottomNavigation.tsx` | Crawlers can't identify navigation landmark |
| Loading states use plain `<div>Loading...</div>` | Multiple pages | Should use `role="status"` and `aria-live` |
| `FloatingWriteButton` has no accessible label | `community/page.tsx` | Icon-only FAB without `aria-label` |

### Recommendations

1. **Add descriptive `alt` text to all `<img>` tags**:
   - Post images: `alt={post.title}` or `alt="게시글 이미지"`
   - Product image: `alt={product.title}`
   - Property images: `alt={`${property.title} - 이미지 ${index + 1}`}`
   - User avatars: `alt={`${user.name} 프로필 이미지`}`
2. **Convert post/product list item `<div onClick>` to `<Link href>` or `<a href>`** — this is critical for both SEO crawlability and keyboard navigation.
3. **Add `aria-label` to icon-only buttons**: back buttons, share buttons, floating write button.
4. **Wrap BottomNavigation in `<nav aria-label="주요 메뉴">`**.
5. **Add `role="status"` and `aria-live="polite"`** to loading indicators.

---

## 7. Additional Gaps Not in Original Focus Areas

### 7.1 `robots.ts` — Missing Routes
The current `disallow` list is minimal. Consider:
- `/login` and `/register` pages should be disallowed (no SEO value, wastes crawl budget).
- `/community/write` should be disallowed.
- `/market/sell` should be disallowed.

```ts
disallow: ['/api/', '/admin/', '/my/', '/login', '/register', '/community/write', '/market/sell'],
```

### 7.2 `sitemap.ts` — Missing Routes & Priorities
- `/real-estate` and `/real-estate/[id]` are completely absent from the sitemap.
- `/login` and `/register` are in the sitemap but should not be.
- All static routes have `priority: 1` — priority should be graduated (home: 1.0, listing pages: 0.9, detail pages: 0.7-0.8).
- `lastModified: new Date()` on all static routes is inaccurate; use a fixed date or the deployment date.

### 7.3 Locale / hreflang
The site targets Korean speakers in Canada. Consider adding `hreflang` if ever supporting English:
```ts
alternates: {
  languages: { 'ko': 'https://korcan.cc', 'ko-CA': 'https://korcan.cc' }
}
```

### 7.4 Missing `metadata` Exports on Most Pages
Pages with no SEO metadata at all (they inherit only the root layout defaults):
- `/community` — needs title "커뮤니티 | KorCan", description about the board
- `/market` — needs title "중고거래 | KorCan"
- `/real-estate` — needs title "부동산 | KorCan"
- `/login`, `/register` — should have `robots: { index: false }`

---

## Priority Implementation Order

### P0 — Critical (Immediate, High Impact)
1. Fix `<html lang="ko">` in `layout.tsx`
2. Convert post/product list cards from `<div onClick>` to `<Link href>` (crawlability)
3. Add `generateMetadata` + `alternates.canonical` to `/real-estate/[id]` (server component conversion required)
4. Add canonical to all pages
5. Add real-estate routes to `sitemap.ts`; remove `/login`, `/register`

### P1 — High (This Sprint)
6. Add OG default image to root layout
7. Add Twitter card metadata to `generateMetadata` on community/[id] and market/[id]
8. Add `BreadcrumbList` JSON-LD to all detail pages
9. Add `Organization` JSON-LD to root layout
10. Add `metadata` exports to `/community`, `/market`, `/real-estate` list pages
11. Fix `viewport` export (separate from `metadata`)
12. Add descriptive `alt` text to all images

### P2 — Medium (Next Sprint)
13. Convert community and market listing pages to server-rendered (hybrid RSC)
14. Replace all raw `<img>` with `next/image`
15. Add `Event` JSON-LD for meetup posts
16. Add `RealEstateListing` JSON-LD to property detail pages
17. Implement dynamic OG image generation (`/api/og`)
18. Add `<main>` landmark to Shell layout
19. Fix Home page `<h1>` content

### P3 — Low (Backlog)
20. Add `ItemList` JSON-LD to listing index pages
21. Add `hreflang` if multi-language is planned
22. Lazy-load Google Maps component
23. Remove or implement `/search` route (related to SearchAction JSON-LD)
24. Add `role="status"` to loading states
25. Tighten `robots.ts` disallow rules

---

*This analysis is based on a static review of source files. Dynamic rendering behavior (e.g., whether Googlebot can execute JavaScript) should be verified with Google Search Console's URL Inspection tool after deployment.*

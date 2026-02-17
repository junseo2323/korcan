# SEO Task: Breadcrumbs & Listing Metadata

Please implement Breadcrumb JSON-LD and Listing Metadata.

## 1. Breadcrumbs
**Files**:
- `src/app/community/[id]/page.tsx`
- `src/app/market/[id]/page.tsx`
- `src/app/real-estate/[id]/page.tsx`

**Task**:
- In each file, add a `BreadcrumbList` JSON-LD schema.
- If a JSON-LD script already exists, use `@graph` to combine schemas or add a second script.
- Structure:
    1. Home (`/`)
    2. Section (`/community`, `/market`, or `/real-estate`)
    3. Item (The current page, using its title and url)

**Example (Community Post)**:
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://korcan.cc"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Community",
      "item": "https://korcan.cc/community"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Post Title",
      "item": "https://korcan.cc/community/123"
    }
  ]
}
```

## 2. Listing Page Metadata
**Files**:
- `src/app/community/page.tsx`
- `src/app/market/page.tsx`
- `src/app/real-estate/page.tsx`

**Task**:
- Ensure each of these pages exports a `metadata` object (Server Component).
- If the page is currently a Client Component (`'use client'`), refactor it:
    - Rename the existing component to `[Name]Client.tsx` (e.g. `CommunityClient.tsx`).
    - Make `page.tsx` a Server Component that exports `metadata` and renders `<[Name]Client />`.
- **Metadata Content**:
    - **Community**: Title: "커뮤니티 | KorCan", Description: "캐나다 한인들의 자유로운 소통 공간"
    - **Market**: Title: "중고장터 | KorCan", Description: "캐나다 한인 중고 직거래 장터"
    - **Real Estate**: Title: "부동산 | KorCan", Description: "캐나다 한인 부동산 매물 정보"

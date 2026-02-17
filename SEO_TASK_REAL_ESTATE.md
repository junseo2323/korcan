# SEO Task: Real Estate & Sitemap

Please implement SEO improvements for the Real Estate section.

## 1. Real Estate Detail Page
**File**: `src/app/real-estate/[id]/page.tsx`

**Tasks**:
- Implement `generateMetadata({ params })`:
    - Fetch the property using `prisma.property.findUnique` (include `images` relation).
    - Return `title`, `description`, and `openGraph` (images, type='website').
    - Handle 404 case (if property not found).
- Implement `JSON-LD` (Structured Data):
    - Create a `RealEstateListing` (or `Product` if easier) schema object.
    - Include: `name` (title), `description`, `image` (first image url), `offers` (price, currency), `address`.
    - Inject it via `<script type="application/ld+json">`.
    - Ensure you handle the `await params` correctly.

## 2. Sitemap Update
**File**: `src/app/sitemap.ts`

**Tasks**:
- Add `/real-estate` to the static routes list.
- Add dynamic routes for Real Estate properties:
    - Fetch all properties using `prisma.property.findMany` (select `id`, `updatedAt`).
    - Map them to the sitemap format (`url`, `lastModified`, `changeFrequency: 'weekly'`, `priority: 0.8`).
    - Append to the returned sitemap array.

**Context**:
- `prisma` client is imported from `@/lib/prisma`.
- `Property` model has `title`, `description`, `price`, `currency`, `address`, `images` (relation to `PropertyImage` which has `url`).

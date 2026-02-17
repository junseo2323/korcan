# SEO Task: Image Optimization

Please configure `next/image` and replace `<img>` tags.

## 1. Configure `next.config.ts`
**File**: `next.config.ts`

**Task**:
- Add `images` configuration to allow external domains.
- Remote Patterns:
    - `{ protocol: 'https', hostname: 'placehold.co' }`
    - `{ protocol: 'https', hostname: '*.s3.*.amazonaws.com' }` (or just `hostname: '*.amazonaws.com'`)

## 2. Replace `<img>` with `next/image`
**Files**:
1.  `src/app/real-estate/[id]/PropertyClient.tsx`
2.  `src/app/market/MarketClient.tsx`
3.  `src/app/market/[id]/ProductClient.tsx`
4.  `src/components/home/PropertyRecommendationBlock.tsx`

**Task**:
- Convert `styled.img` to `styled(Image)`.
    - **Import**: `import Image from 'next/image'`.
    - **Definition**: `const StyledImage = styled(Image)`.
    - **Usage**:
        - You MUST provide `width` and `height` OR `fill={true}`.
        - If using `fill`, ensure the parent container has `position: relative`.
        - If using `fill`, add `sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"` (adjust as needed).
        - Add `alt` text (use title/name).

**Specifics**:
- **PropertyClient.tsx**: `CarouselImage` -> `styled(Image)` with `fill` and `object-fit: cover` (via style or styled-component prop, note: `next/image` handles object-fit differently in older versions, but in recent next/image `style={{ objectFit: 'cover' }}` works with `fill`).
- **MarketClient.tsx**: `ProductImage` -> `styled(Image)` with `fill` (parent `ImageWrapper` has `aspect-ratio: 1` and `position: relative`).
- **ProductClient.tsx**: `ProductImage` -> `styled(Image)` with `fill`.
- **PropertyRecommendationBlock.tsx**: `PropertyImage` -> `styled(Image)` with `fill`.

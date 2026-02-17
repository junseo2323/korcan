# SEO Analysis & Improvement Plan Request

Please analyze the current repository (`/Users/seojuno/dev/korcan`) focusing on SEO (Search Engine Optimization) for a Next.js App Router project.

**Current State:**
- Basic `sitemap.ts` and `robots.ts` implemented.
- Dynamic metadata (`generateMetadata`) added to `/community/[id]` and `/market/[id]`.
- JSON-LD implemented for simple BlogPosting/Product schemas.

**Goal:**
Create a comprehensive **Advanced SEO Plan** to take this project to a production-ready level. Identify gaps and propose specific improvements.

**Focus Areas:**
1.  **Semantic HTML Structure**: Analyze page components for proper semantic tags (`<article>`, `<section>`, headings structure).
2.  **Structured Data (JSON-LD)**: Identify missing schemas (e.g., BreadcrumbList, Organization, LocalBusiness for localized content, specific schemas for Market listings).
3.  **Performance & Core Web Vitals**: Suggest image optimizations (`next/image` usage), font loading, and script loading strategies.
4.  **Canonical Tags**: Ensure proper canonical URL implementation to avoid duplicate content issues.
5.  **Social Sharing (OpenGraph/Twitter Cards)**: Verify coverage and suggest enhancements (e.g., image generation dynamically).
6.  **Accessibility (A11y)**: Basic accessibility checks relevant to SEO.

**Output Format:**
Please write your analysis and proposed plan to a new file named `SEO_ANALYSIS.md` in the project root.
Do NOT modify any other files yet. I will review this plan first.

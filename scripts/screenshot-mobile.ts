import { chromium, devices } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://korcan.cc';
const OUTPUT_DIR = path.resolve('./screenshots/mobile');
const DEVICE = devices['iPhone 12'];

const staticRoutes = [
  { path: '/', name: '01_home' },
  { path: '/login', name: '02_login' },
  { path: '/register', name: '03_register' },
  { path: '/community', name: '04_community_list' },
  { path: '/community/write', name: '05_community_write' },
  { path: '/market', name: '07_market_list' },
  { path: '/market/sell', name: '08_market_sell' },
  { path: '/jobs', name: '09_jobs' },
  { path: '/real-estate', name: '10_realestate_list' },
  { path: '/real-estate/create', name: '11_realestate_create' },
  { path: '/planner', name: '12_planner' },
  { path: '/search', name: '13_search' },
  { path: '/privacy', name: '14_privacy' },
  { path: '/terms', name: '15_terms' },
];

// 목록 페이지에서 첫 번째 아이템 링크를 자동 추출해 상세 스크린샷 찍기
const dynamicRoutes = [
  {
    listPath: '/community',
    selector: 'a[href^="/community/"]:not([href="/community/write"])',
    name: '06_community_detail',
  },
  {
    listPath: '/market',
    selector: 'a[href^="/market/"]:not([href="/market/sell"])',
    name: '06b_market_detail',
  },
  {
    listPath: '/real-estate',
    selector: 'a[href^="/real-estate/"]:not([href="/real-estate/create"])',
    name: '10b_realestate_detail',
  },
];

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    ...DEVICE,
    locale: 'ko-KR',
  });

  const page = await context.newPage();

  // 정적 라우트 스크린샷
  for (const route of staticRoutes) {
    const url = `${BASE_URL}${route.path}`;
    console.log(`📸 ${route.name} → ${url}`);
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 });
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `${route.name}.png`),
        fullPage: true,
      });
      console.log(`   ✅ saved`);
    } catch (e) {
      console.error(`   ❌ failed: ${e}`);
    }
  }

  // 동적 라우트 — 목록에서 첫 번째 링크 href 추출
  for (const route of dynamicRoutes) {
    const listUrl = `${BASE_URL}${route.listPath}`;
    console.log(`🔍 ${route.name} — 목록에서 첫 아이템 추출 중...`);
    try {
      await page.goto(listUrl, { waitUntil: 'networkidle', timeout: 20000 });
      const href = await page.locator(route.selector).first().getAttribute('href');
      if (!href) {
        console.log(`   ⚠️  링크를 찾지 못했습니다 (${route.selector})`);
        continue;
      }
      const detailUrl = `${BASE_URL}${href}`;
      console.log(`📸 ${route.name} → ${detailUrl}`);
      await page.goto(detailUrl, { waitUntil: 'networkidle', timeout: 20000 });
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `${route.name}.png`),
        fullPage: true,
      });
      console.log(`   ✅ saved`);
    } catch (e) {
      console.error(`   ❌ failed: ${e}`);
    }
  }

  await browser.close();
  console.log(`\n✨ 완료! 스크린샷 저장 위치: ${OUTPUT_DIR}`);
}

main();
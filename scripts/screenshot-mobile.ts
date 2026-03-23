import { chromium, devices } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://korcan.cc';
const OUTPUT_DIR = path.resolve('./screenshots/mobile');
const DEVICE = devices['iPhone 12'];

// 홈 등 로그인 필요 페이지용: SESSION_COOKIE 환경변수로 주입
// 사용법: SESSION_COOKIE="eyJ..." npx tsx scripts/screenshot-mobile.ts
const SESSION_COOKIE = process.env.SESSION_COOKIE;

// 로그인이 필요한 라우트
const authRoutes = [
  { path: '/', name: '01_home' },
  { path: '/planner', name: '12_planner' },
  { path: '/search', name: '13_search' },
];

// 로그인 불필요 라우트
const publicRoutes = [
  { path: '/login', name: '02_login' },
  { path: '/register', name: '03_register' },
  { path: '/community', name: '04_community_list' },
  { path: '/community/write', name: '05_community_write' },
  { path: '/market', name: '07_market_list' },
  { path: '/market/sell', name: '08_market_sell' },
  { path: '/jobs', name: '09_jobs' },
  { path: '/real-estate', name: '10_realestate_list' },
  { path: '/real-estate/create', name: '11_realestate_create' },
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

// 뷰포트 2장 촬영 (상단 + 스크롤 후)
async function takeViewportShots(page: Awaited<ReturnType<typeof import('@playwright/test').chromium.launch>>['newPage'] extends (...args: any[]) => Promise<infer P> ? P : never, name: string) {
  const viewportHeight = DEVICE.viewport!.height;
  const scrollStep = viewportHeight - 90; // 하단 nav 높이 제외

  // 1번 — 최상단
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(200);
  await page.screenshot({
    path: path.join(OUTPUT_DIR, `${name}_1.png`),
    fullPage: false,
  });

  // 2번 — 한 화면 아래
  await page.evaluate((step) => window.scrollBy(0, step), scrollStep);
  await page.waitForTimeout(200);
  await page.screenshot({
    path: path.join(OUTPUT_DIR, `${name}_2.png`),
    fullPage: false,
  });
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });

  // ── 공개 컨텍스트 ──────────────────────────────────────────────
  const publicCtx = await browser.newContext({ ...DEVICE, locale: 'ko-KR' });
  await publicCtx.addInitScript(() => {
    sessionStorage.setItem('hasSeenSplash', 'true');
    sessionStorage.setItem('inapp-banner-dismissed', '1');
    localStorage.setItem('push-prompt-dismissed', '1');
    localStorage.setItem('install-prompt-dismissed', '1');
  });
  const publicPage = await publicCtx.newPage();

  for (const route of publicRoutes) {
    const url = `${BASE_URL}${route.path}`;
    console.log(`📸 ${route.name} → ${url}`);
    try {
      await publicPage.goto(url, { waitUntil: 'networkidle', timeout: 20000 });
      await publicPage.waitForTimeout(800);
      await takeViewportShots(publicPage, route.name);
      console.log(`   ✅ saved (_1, _2)`);
    } catch (e) {
      console.error(`   ❌ failed: ${e}`);
    }
  }

  // 동적 라우트
  for (const route of dynamicRoutes) {
    const listUrl = `${BASE_URL}${route.listPath}`;
    console.log(`🔍 ${route.name} — 첫 아이템 추출 중...`);
    try {
      await publicPage.goto(listUrl, { waitUntil: 'networkidle', timeout: 20000 });
      const href = await publicPage.locator(route.selector).first().getAttribute('href');
      if (!href) {
        console.log(`   ⚠️  링크를 찾지 못했습니다 (${route.selector})`);
        continue;
      }
      const detailUrl = `${BASE_URL}${href}`;
      console.log(`📸 ${route.name} → ${detailUrl}`);
      await publicPage.goto(detailUrl, { waitUntil: 'networkidle', timeout: 20000 });
      await publicPage.waitForTimeout(800);
      await takeViewportShots(publicPage, route.name);
      console.log(`   ✅ saved (_1, _2)`);
    } catch (e) {
      console.error(`   ❌ failed: ${e}`);
    }
  }

  await publicCtx.close();

  // ── 인증 컨텍스트 (SESSION_COOKIE 있을 때만) ──────────────────
  if (SESSION_COOKIE) {
    console.log('\n🔐 세션 쿠키 감지 — 로그인 필요 페이지 촬영 시작');
    const authCtx = await browser.newContext({ ...DEVICE, locale: 'ko-KR' });
    await authCtx.addInitScript(() => {
      sessionStorage.setItem('hasSeenSplash', 'true');
      sessionStorage.setItem('inapp-banner-dismissed', '1');
      localStorage.setItem('push-prompt-dismissed', '1');
      localStorage.setItem('install-prompt-dismissed', '1');
    });
    await authCtx.addCookies([{
      name: '__Secure-next-auth.session-token',
      value: SESSION_COOKIE,
      domain: 'korcan.cc',
      path: '/',
      secure: true,
      httpOnly: true,
    }]);
    const authPage = await authCtx.newPage();

    for (const route of authRoutes) {
      const url = `${BASE_URL}${route.path}`;
      console.log(`📸 ${route.name} → ${url}`);
      try {
        await authPage.goto(url, { waitUntil: 'networkidle', timeout: 20000 });
        await authPage.waitForTimeout(800);
        // 로그인 리다이렉트됐는지 확인
        if (authPage.url().includes('/login')) {
          console.log(`   ⚠️  세션 만료 또는 쿠키 불일치 — 로그인 페이지로 리다이렉트됨`);
          continue;
        }
        await takeViewportShots(authPage, route.name);
        console.log(`   ✅ saved (_1, _2)`);
      } catch (e) {
        console.error(`   ❌ failed: ${e}`);
      }
    }

    await authCtx.close();
  } else {
    console.log('\n⚠️  SESSION_COOKIE 미설정 — 홈/플래너/검색은 스킵됨');
    console.log('   사용법: SESSION_COOKIE="쿠키값" npx tsx scripts/screenshot-mobile.ts');
  }

  await browser.close();
  console.log(`\n✨ 완료! 스크린샷 저장 위치: ${OUTPUT_DIR}`);
}

main();

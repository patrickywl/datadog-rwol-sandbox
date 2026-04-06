/**
 * Datadog RUM 자동화 테스트 스크립트
 * 실제 사용자처럼 동작하여 RUM 데이터를 생성합니다.
 */

import { chromium } from 'playwright';

// ============================================================
// 기본 설정
// ============================================================
const BASE_URL = 'http://localhost:5173';
const ITERATIONS = 10; // 전체 사이클 반복 횟수

// ============================================================
// 타이밍 설정 (밀리초 단위, 1000ms = 1초)
// ============================================================
const TIMING = {
  // Performance Test 페이지 타이밍
  AFTER_PAGE_LOAD: 10000,        // 페이지 로드 후 버튼 누르기 전 대기 (10초)
  BETWEEN_ACTIONS: 3000,          // 각 버튼 액션 사이 대기 (3초)
  AFTER_ALL_ACTIONS: 10000,       // 모든 버튼 작업 완료 후 대기 (10초)

  // 각 버튼별 완료 대기 타임아웃 (버튼이 완료될 때까지 최대 대기 시간)
  LCP_TIMEOUT: 15000,             // LCP 버튼 완료 최대 대기 (15초)
  INP_TIMEOUT: 10000,             // INP 버튼 완료 최대 대기 (10초)
  CLS_TIMEOUT: 3000,              // CLS 버튼 완료 최대 대기 (3초)

  // 기타 페이지 타이밍
  BLOG_PAGE_DELAY: 2000,          // 블로그 페이지 대기 (2초)
  SCROLL_DELAY: 1000,             // 스크롤 간 대기 (1초)
  RESET_SESSION_DELAY: 3000,      // Reset Session 후 대기 (3초)
  HOME_PAGE_DELAY: 2000,          // 홈 페이지 대기 (2초)
  INITIAL_PAGE_DELAY: 2000,       // 초기 페이지 로드 후 대기 (2초)
  BETWEEN_CYCLES: 3000,           // 사이클 간 대기 (3초)
};

// ============================================================
// 브라우저 설정
// ============================================================
const BROWSER_CONFIG = {
  HEADLESS: false,                // 브라우저 창 표시 여부 (true: 숨김, false: 표시)
  SLOW_MO: 1000,                  // 동작 속도 지연 (밀리초, 0 = 최대 속도)
};

// 블로그 페이지 목록
const BLOG_PAGES = [
  // 'web-development',
  // 'app-development',
  'deployment',
  'management',
  // 'hosting'
];

// 랜덤 딜레이 함수 (실제 사용자처럼)
const randomDelay = (min = 1000, max = 3000) => {
  return new Promise(resolve =>
    setTimeout(resolve, Math.random() * (max - min) + min)
  );
};

// 페이지 스크롤 함수
const scrollPage = async (page) => {
  await page.evaluate(() => {
    window.scrollTo({
      top: document.body.scrollHeight / 2,
      behavior: 'smooth'
    });
  });
  await new Promise(resolve => setTimeout(resolve, TIMING.SCROLL_DELAY));

  await page.evaluate(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
  });
  await new Promise(resolve => setTimeout(resolve, TIMING.SCROLL_DELAY));
};

// Performance Test 페이지의 모든 버튼 클릭
const clickPerformanceButtons = async (page, pageName) => {
  console.log(`\n  🎯 ${pageName} 페이지에서 버튼 클릭 시작...`);

  // 페이지의 기본 DOM이 로드될 때까지만 대기 (느린 리소스 무시)
  await page.waitForLoadState('domcontentloaded');

  // 버튼 누르기 전 대기
  console.log(`    ⏳ 페이지 로딩 완료 후 ${TIMING.AFTER_PAGE_LOAD / 1000}초 대기...`);
  await new Promise(resolve => setTimeout(resolve, TIMING.AFTER_PAGE_LOAD));

  // 페이지 스크롤
  await scrollPage(page);

  try {
    // 1. Trigger Bad LCP 버튼 클릭
    console.log('    ├─ "Trigger Bad LCP" 버튼 클릭');
    const lcpButton = page.locator('button:has-text("Trigger Bad LCP")').first();
    await lcpButton.waitFor({ state: 'visible', timeout: 10000 });
    await lcpButton.click();

    // 버튼이 완료될 때까지 대기 (버튼 텍스트가 원래대로 돌아올 때까지)
    console.log('    │  ⏳ LCP 작업 완료 대기 중...');
    await page.waitForSelector('button:has-text("Trigger Bad LCP"):not(:disabled)', {
      timeout: TIMING.LCP_TIMEOUT,
      state: 'visible'
    });
    console.log('    │  ✓ LCP 트리거 완료');

    // 다음 작업 전 대기
    console.log(`    │  ⏳ ${TIMING.BETWEEN_ACTIONS / 1000}초 대기...`);
    await new Promise(resolve => setTimeout(resolve, TIMING.BETWEEN_ACTIONS));
  } catch (e) {
    console.log('    │  ⚠ LCP 버튼 처리 실패:', e.message);
  }

  try {
    // 2. Trigger Bad INP 버튼 클릭
    console.log('    ├─ "Trigger Bad INP" 버튼 클릭');
    const inpButton = page.locator('button:has-text("Trigger Bad INP")').first();
    await inpButton.waitFor({ state: 'visible', timeout: 10000 });
    await inpButton.click();

    // 버튼이 완료될 때까지 대기 (버튼 텍스트가 원래대로 돌아올 때까지)
    console.log('    │  ⏳ INP 작업 완료 대기 중... (UI가 6초간 멈춤)');
    await page.waitForSelector('button:has-text("Trigger Bad INP"):not(:disabled)', {
      timeout: TIMING.INP_TIMEOUT,
      state: 'visible'
    });
    console.log('    │  ✓ INP 트리거 완료');

    // 다음 작업 전 대기
    console.log(`    │  ⏳ ${TIMING.BETWEEN_ACTIONS / 1000}초 대기...`);
    await new Promise(resolve => setTimeout(resolve, TIMING.BETWEEN_ACTIONS));
  } catch (e) {
    console.log('    │  ⚠ INP 버튼 처리 실패:', e.message);
  }

  try {
    // 3. Trigger Layout Shift 버튼 클릭
    console.log('    └─ "Trigger Layout Shift" 버튼 클릭');
    const clsButton = page.locator('button:has-text("Trigger Layout Shift")').first();
    await clsButton.waitFor({ state: 'visible', timeout: 10000 });
    await clsButton.click();

    // CLS는 즉시 완료되므로 짧은 대기만
    await new Promise(resolve => setTimeout(resolve, TIMING.CLS_TIMEOUT));
    console.log('       ✓ Layout Shift 트리거 완료');
  } catch (e) {
    console.log('       ⚠ Layout Shift 버튼 처리 실패:', e.message);
  }

  // 모든 작업 완료 후 대기
  console.log(`    ⏳ 모든 버튼 작업 완료 후 ${TIMING.AFTER_ALL_ACTIONS / 1000}초 대기...`);
  await new Promise(resolve => setTimeout(resolve, TIMING.AFTER_ALL_ACTIONS));
};

// Reset Session 버튼 클릭
const resetSession = async (page) => {
  console.log('\n  🔄 Reset Session 버튼 클릭...');

  try {
    // 헤더의 Reset Session 버튼 찾기
    const resetButton = page.locator('button:has-text("Reset Session")').first();
    await resetButton.waitFor({ state: 'visible', timeout: 10000 });

    // 대화상자 처리 (once 사용 - 한 번만 실행)
    page.once('dialog', async dialog => {
      console.log(`    ├─ Alert: ${dialog.message()}`);
      await dialog.accept();
    });

    await resetButton.click();
    console.log('    └─ ✓ 세션 리셋 완료 (페이지 새로고침 대기)');

    // 페이지 리로드 대기 (기본 DOM만 대기)
    await page.waitForLoadState('domcontentloaded');
    await new Promise(resolve => setTimeout(resolve, TIMING.RESET_SESSION_DELAY));
  } catch (e) {
    console.log('    └─ ⚠ Reset Session 버튼을 찾을 수 없습니다:', e.message);
  }
};

// 블로그 페이지 방문
const visitBlogPages = async (page) => {
  console.log('\n  📝 블로그 페이지 방문 시작...');

  // 랜덤하게 2-3개의 블로그 페이지 방문
  const numPagesToVisit = 1
  const shuffledBlogs = [...BLOG_PAGES].sort(() => Math.random() - 0.5);
  const blogsToVisit = shuffledBlogs.slice(0, numPagesToVisit);

  for (const blog of blogsToVisit) {
    const url = `${BASE_URL}/blogs/${blog}`;
    console.log(`    ├─ 방문: /blogs/${blog}`);

    await page.goto(url, { timeout: 60000 });
    await page.waitForLoadState('domcontentloaded');
    await new Promise(resolve => setTimeout(resolve, TIMING.BLOG_PAGE_DELAY));

    // 페이지 스크롤
    await scrollPage(page);
    await new Promise(resolve => setTimeout(resolve, TIMING.BLOG_PAGE_DELAY));
  }

  console.log('    └─ ✓ 블로그 페이지 방문 완료');
};

// 한 사이클 실행
const runCycle = async (page, cycleNum) => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🔄 사이클 ${cycleNum} 시작`);
  console.log('='.repeat(60));

  // 1. Investigate 페이지 방문
  console.log('\n📍 Step 1: /performance-test/investigate 페이지 방문');
  await page.goto(`${BASE_URL}/performance-test/investigate`, { timeout: 60000 });
  await clickPerformanceButtons(page, 'Investigate');

  // 2. Measure 페이지 방문
  console.log('\n📍 Step 2: /performance-test/measure 페이지 방문');
  await page.goto(`${BASE_URL}/performance-test/measure`, { timeout: 60000 });
  await clickPerformanceButtons(page, 'Measure');

  // 3. 블로그 페이지들 방문
  console.log('\n📍 Step 3: 블로그 페이지 탐색');
  await visitBlogPages(page);

  // 4. 홈 페이지로 이동
  console.log('\n📍 Step 4: 홈 페이지로 이동');
  await page.goto(BASE_URL, { timeout: 60000 });
  await page.waitForLoadState('domcontentloaded');
  await new Promise(resolve => setTimeout(resolve, TIMING.HOME_PAGE_DELAY));

  // 5. Reset Session
  await resetSession(page);
};

// 메인 함수
const main = async () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║     🚀 Datadog RUM 자동화 테스트 스크립트 시작           ║
║                                                           ║
║  - Base URL: ${BASE_URL}                    ║
║  - 반복 횟수: ${ITERATIONS}회                                     ║
║  - 실제 사용자 동작 시뮬레이션                            ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);

  // 브라우저 실행
  const browser = await chromium.launch({
    headless: BROWSER_CONFIG.HEADLESS,
    slowMo: BROWSER_CONFIG.SLOW_MO
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  });

  const page = await context.newPage();

  try {
    // 홈 페이지로 먼저 이동하여 초기화
    console.log('\n🏠 초기 페이지 로드...');
    await page.goto(BASE_URL, { timeout: 60000 });
    await page.waitForLoadState('domcontentloaded');
    await new Promise(resolve => setTimeout(resolve, TIMING.INITIAL_PAGE_DELAY));

    // 사이클 반복 실행
    for (let i = 1; i <= ITERATIONS; i++) {
      await runCycle(page, i);

      if (i < ITERATIONS) {
        console.log(`\n⏳ 다음 사이클까지 ${TIMING.BETWEEN_CYCLES / 1000}초 대기 중...\n`);
        await new Promise(resolve => setTimeout(resolve, TIMING.BETWEEN_CYCLES));
      }
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log('✅ 모든 테스트 완료!');
    console.log('='.repeat(60));
    console.log('\n📊 Datadog RUM에서 데이터를 확인하세요.');
    console.log('   브라우저를 5초 후에 닫습니다...\n');

    await randomDelay(5000, 5000);

  } catch (error) {
    console.error('\n❌ 오류 발생:', error);
  } finally {
    await browser.close();
    console.log('\n👋 브라우저 종료. 스크립트 완료.\n');
  }
};

// 스크립트 실행
main().catch(console.error);

const { chromium } = require('C:/Users/Lenovo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');
(async () => {
  const browser = await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
  const ctx = await browser.newContext({ viewport:{width:1440,height:1000},colorScheme:'light',permissions:['clipboard-read','clipboard-write'] });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  const routes=['','research/','research/option-pricing/','research/quant-investment/','experience/','about/','cv/'];
  for (const lang of ['en','zh']) for(const route of routes){
    const res=await page.goto(`http://localhost:1313/${lang}/${route}`,{waitUntil:'networkidle'});
    assert.equal(res.status(),200,lang+route);
    assert.equal(await page.locator('h1').count(),1,lang+route);
    assert.equal(await page.locator('html').getAttribute('lang'),lang==='zh'?'zh-CN':'en');
    assert(await page.locator('.languages a:not([aria-current])').getAttribute('href').then(h=>h.includes(route)), 'translation retains page');
    await page.locator('img').evaluateAll(async imgs=>{await Promise.all(imgs.map(i=>{i.loading='eager';return i.decode()}))});
    const broken=await page.locator('img').evaluateAll(imgs=>imgs.filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src));
    assert.deepEqual(broken,[]);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'desktop overflow '+lang+route);
  }
  fs.mkdirSync('tmp/qa',{recursive:true});
  await page.goto('http://localhost:1313/zh/',{waitUntil:'networkidle'});
  await page.screenshot({path:'tmp/qa/home-desktop.png',fullPage:true});
  await page.locator('.theme-toggle').click();
  assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
  await page.reload();
  assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
  await page.screenshot({path:'tmp/qa/home-dark.png',fullPage:true});
  await page.locator('.theme-toggle').click();
  await page.goto('http://localhost:1313/zh/research/option-pricing/',{waitUntil:'networkidle'});
  await page.screenshot({path:'tmp/qa/research-desktop.png',fullPage:true});
  await page.locator('.copy-citation').click();
  await page.waitForFunction(()=>document.getElementById('copy-status').textContent.length>0);
  assert((await page.locator('#copy-status').textContent()).length>0);
  fs.mkdirSync('static/files',{recursive:true});
  for(const lang of ['en','zh']){
    await page.goto(`http://localhost:1313/${lang}/cv/`,{waitUntil:'networkidle'});
    assert.equal(await page.locator('a[download]').count(),1);
    if (process.env.SKIP_PDF) continue;
    await page.emulateMedia({media:'print'});
    await page.pdf({path:`static/files/lixing-tan-cv-${lang}.pdf`,format:'A4',printBackground:true,preferCSSPageSize:true});
    await page.emulateMedia({media:'print'});
    await page.screenshot({path:`tmp/qa/cv-${lang}.png`,fullPage:true});
    await page.emulateMedia({media:'screen'});
  }
  await page.setViewportSize({width:390,height:844});
  for(const lang of ['en','zh']) for(const route of routes){
    await page.goto(`http://localhost:1313/${lang}/${route}`,{waitUntil:'networkidle'});
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'mobile overflow '+lang+route);
    assert(await page.locator('.menu-toggle').isVisible());
  }
  await page.goto('http://localhost:1313/zh/',{waitUntil:'networkidle'});
  await page.screenshot({path:'tmp/qa/home-mobile.png',fullPage:true});
  await page.locator('.menu-toggle').click();
  assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');
  assert(await page.locator('#main-nav').isVisible());
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
  assert.deepEqual(errors,[]);
  await browser.close();
  console.log('PASS: 14 bilingual routes, desktop/mobile overflow, images, language routes, theme persistence, menu, citation feedback, and CV exports.');
})().catch(e=>{console.error(e);process.exit(1)});

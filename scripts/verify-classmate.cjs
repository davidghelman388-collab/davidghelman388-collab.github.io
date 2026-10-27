const {chromium}=require('C:/Users/Lenovo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('assert/strict');const fs=require('fs');
(async()=>{
 const b=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
 const context=await b.newContext({viewport:{width:1440,height:1000},permissions:['clipboard-read','clipboard-write']});
 const p=await context.newPage();const errors=[],failed=[];
 p.on('pageerror',e=>errors.push(e.message));p.on('requestfailed',r=>failed.push(r.url()));
 const routes=['','projects/','projects/option-pricing/','projects/quant-investment/','experience/','about/','research/publications/','cv/'];
 await p.addInitScript(()=>document.addEventListener('DOMContentLoaded',()=>document.querySelectorAll('img').forEach(i=>{i.loading='eager'})));
 fs.mkdirSync('tmp/qa',{recursive:true});
 for(const lang of ['zh','en'])for(const route of routes){
   const r=await p.goto(`http://localhost:1313/${lang}/${route}`,{waitUntil:'networkidle'});assert.equal(r.status(),200);
   assert.equal(await p.locator('h1').count(),1,lang+route);
   assert(await p.locator('body').innerText().then(t=>!t.includes('华中科技大学')&&!t.includes('Hao Xiong')&&!t.includes('xionghao_research@')));
   await p.locator('img').evaluateAll(async imgs=>Promise.all(imgs.map(i=>i.decode())));
   assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'desktop overflow '+lang+route);
 }
 await p.goto('http://localhost:1313/zh/',{waitUntil:'networkidle'});await p.waitForTimeout(1300);
 assert.equal(await p.locator('.diagonal-line').count(),4);assert.equal(await p.locator('.spline-curve').count(),3);
 const before=await p.locator('.diagonal-line').first().getAttribute('style');await p.waitForTimeout(200);
 assert.notEqual(await p.locator('.diagonal-line').first().getAttribute('style'),before,'upstream GSAP animates');
 await p.locator('.motion-control').click();
 const stopped=await p.locator('.diagonal-line').first().getAttribute('style');await p.waitForTimeout(200);
 assert.equal(await p.locator('.diagonal-line').first().getAttribute('style'),stopped,'pause holds');
 assert.equal(await p.locator('.hero-profile-ring').evaluate(e=>getComputedStyle(e).borderRadius),'9999px');
 await p.screenshot({path:'tmp/qa/classmate-first.png'});
 for(const section of await p.locator('main > section').all()){await section.scrollIntoViewIfNeeded();await p.waitForTimeout(100)}
 await p.evaluate(()=>scrollTo(0,0));await p.screenshot({path:'tmp/qa/classmate-home.png',fullPage:true});
 await p.locator('#darkModeToggle').click();assert(await p.locator('html').evaluate(e=>e.classList.contains('dark')));
 await p.reload({waitUntil:'networkidle'});assert(await p.locator('html').evaluate(e=>e.classList.contains('dark')));
 await p.screenshot({path:'tmp/qa/classmate-dark.png'});
 await p.goto('http://localhost:1313/zh/projects/option-pricing/',{waitUntil:'networkidle'});
 await p.locator('.copy-citation').click();await p.waitForFunction(()=>document.querySelector('#copy-status').textContent.length>0);
 await p.locator('[aria-label="Language switcher"]').click();
 assert(await p.locator('.submenu a[href="/en/projects/option-pricing/"]').isVisible());
 await p.locator('.submenu a[href="/en/projects/option-pricing/"]').click();assert(p.url().includes('/en/projects/option-pricing/'));
 for(const width of [320,390,768]){
  await p.setViewportSize({width,height:900});
  for(const lang of ['zh','en'])for(const route of routes){
   await p.goto(`http://localhost:1313/${lang}/${route}`,{waitUntil:'networkidle'});
   assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'mobile overflow '+width+lang+route);
  }
 }
 await p.setViewportSize({width:390,height:844});await p.goto('http://localhost:1313/zh/',{waitUntil:'networkidle'});await p.waitForTimeout(1300);
 await p.locator('#menu-btn').click();assert(await p.locator('#mobile-menu').isVisible());await p.locator('#menu-btn').click();
 await p.screenshot({path:'tmp/qa/classmate-mobile.png'});
 await p.emulateMedia({reducedMotion:'reduce'});await p.reload({waitUntil:'networkidle'});
 assert.equal(await p.locator('.motion-control').getAttribute('aria-pressed'),'true');
 assert.equal(await p.locator('img').first().evaluate(e=>e.getBoundingClientRect().width>0),true);
 assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
 await b.close();console.log('PASS: 16 bilingual routes; original GSAP animation, pause, reduced motion, portrait, language, theme, menus, images, and 3 mobile/tablet widths; no browser or network failures.');
})().catch(e=>{console.error(e);process.exit(1)});

const { chromium } = require('C:/Users/Lenovo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert = require('assert/strict');
const fs = require('fs');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
 const context=await browser.newContext({viewport:{width:1440,height:1000},colorScheme:'light'});
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>document.addEventListener('DOMContentLoaded',()=>document.querySelectorAll('img').forEach(i=>{i.loading='eager'})));
 fs.mkdirSync('tmp/qa',{recursive:true});
 await page.goto('http://localhost:1313/zh/',{waitUntil:'networkidle'});
 const sample=()=>page.locator('canvas').evaluate(c=>c.toDataURL());
 const a=await sample();await page.waitForTimeout(150);assert.notEqual(await sample(),a,'background animates');
 await page.locator('.motion-toggle').click();
 const frozen=await sample();await page.waitForTimeout(150);assert.equal(await sample(),frozen,'pause freezes canvas');
 assert.equal(await page.locator('.motion-toggle').getAttribute('aria-pressed'),'true');
 assert.equal(await page.locator('.portrait-image').evaluate(e=>getComputedStyle(e).borderRadius),'50%');
 await page.screenshot({path:'tmp/qa/atelier-desktop.png',fullPage:true});
 await page.screenshot({path:'tmp/qa/atelier-first-screen.png'});
 await page.locator('.theme-toggle').click();await page.waitForTimeout(250);
 await page.screenshot({path:'tmp/qa/atelier-dark.png',fullPage:true});
 for(const width of [320,390,768,1024,1440]){
  await page.setViewportSize({width,height:900});
  for(const lang of ['zh','en']){
   await page.goto(`http://localhost:1313/${lang}/`,{waitUntil:'networkidle'});
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'overflow '+lang+width);
   const bounds=await page.locator('.portrait-image').boundingBox();assert.equal(bounds.width,bounds.height,'circular frame');
   assert(await page.locator('.portrait img').evaluate(i=>i.naturalHeight>i.naturalWidth),'one inch portrait asset');
   if(width===390&&lang==='zh') await page.screenshot({path:'tmp/qa/atelier-mobile.png',fullPage:true});
  }
 }
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('http://localhost:1313/zh/',{waitUntil:'networkidle'});
 assert.equal(await page.locator('.motion-toggle').getAttribute('aria-pressed'),'true');
 const reduced=await sample();await page.waitForTimeout(150);assert.equal(await sample(),reduced,'reduced motion stays static');
 assert.deepEqual(errors,[]);
 await browser.close();console.log('PASS: live canvas, pause, reduced motion, circular one-inch portrait, both languages at five widths, and no browser errors.');
})().catch(e=>{console.error(e);process.exit(1)});

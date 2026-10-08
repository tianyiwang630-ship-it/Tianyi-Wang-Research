// 本地浏览器验收：页面加载、资源链接、筛选、图表、移动端和 file://。
const {chromium} = require('C:/Users/20157/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {pathToFileURL} = require('node:url');
const out = path.join(__dirname,'qa');
fs.mkdirSync(out,{recursive:true});
const context={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'assets/data.js'),'utf8'),context);
const data=context.window.portfolio;
(async()=>{
  const browser=await chromium.launch({headless:true,channel:'msedge'});
  const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('response',response=>{if(response.status()>=400)errors.push(`${response.status()} ${response.url()}`);});
  const pages=['index.html','projects.html','experience.html','education.html','writing.html','contact.html',...data.projects.map(p=>`projects/${p.id}.html`),...data.experience.map(e=>`experiences/${e.id}.html`)];
  await page.goto('http://127.0.0.1:4173/');
  if(await page.locator('html').getAttribute('lang')!=='en')errors.push('English is not the default');
  await page.locator('[data-language="zh"]').click();
  await page.waitForURL('**/?lang=zh');
  if(await page.locator('html').getAttribute('lang')!=='zh-CN')errors.push('Chinese switch failed');
  if(!(await page.locator('.hero h1').innerText()).includes('王天一'))errors.push('Chinese home missing');
  await page.screenshot({path:path.join(out,'home-zh-first-screen.png')});
  await page.locator('.hero-links a').first().click();
  if(await page.locator('html').getAttribute('lang')!=='zh-CN')errors.push('Language not retained during navigation');
  await page.locator('[data-language="en"]').click();
  await page.waitForURL('**/projects.html?lang=en');
  for(const route of pages){
    await page.goto('http://127.0.0.1:4173/'+route+'?lang=en');
    await page.waitForSelector('main h1');
    if(await page.locator('h1').count()!==1)errors.push('Heading count '+route);
    const untranslated=await page.locator('body').evaluate(body=>{
      const walker=document.createTreeWalker(body,NodeFilter.SHOW_TEXT);
      const found=[];
      while(walker.nextNode()){
        const node=walker.currentNode;
        if(['SCRIPT','STYLE','NOSCRIPT'].includes(node.parentElement?.tagName))continue;
        const text=node.nodeValue.replace(/王天一|中文/g,'').trim();
        if(/[\u4e00-\u9fff]/.test(text))found.push(text.slice(0,140));
      }
      return found;
    });
    if(untranslated.length)errors.push(`Untranslated ${route}: ${untranslated.join(' | ')}`);
    if((await page.locator('main').innerText()).match(/腾讯|Tencent/i))errors.push('Tencent still visible '+route);
    const localLinks=await page.locator('a[href]').evaluateAll(links=>links.map(a=>a.href).filter(url=>url.startsWith(location.origin)&&!url.includes('#')));
    for(const url of new Set(localLinks)){const response=await page.request.get(url);if(!response.ok())errors.push(`Broken local link ${route}: ${url}`);}
  }
  for(const route of pages){
    await page.goto('http://127.0.0.1:4173/'+route+'?lang=zh');
    if(await page.locator('html').getAttribute('lang')!=='zh-CN')errors.push('Chinese locale mismatch '+route);
  }
  await page.goto('http://127.0.0.1:4173/projects/jute-pest.html?lang=zh');
  if(await page.locator('.detail-actions .primary').evaluate(a=>a.firstChild.textContent.trim())!=='GitHub 链接')errors.push('Chinese GitHub label mismatch');
  await page.goto('http://127.0.0.1:4173/projects/jute-pest.html?lang=en');
  if(!(await page.locator('.detail-actions .primary').innerText()).startsWith('GitHub link'))errors.push('English GitHub label mismatch');
  await page.goto('http://127.0.0.1:4173/projects.html');
  const total=await page.locator('.project-card:visible').count();
  if(total!==data.projects.length)errors.push('Project total mismatch');
  await page.locator('[data-filter="量化金融"]').click();
  if(await page.locator('.project-card:visible').count()!==3)errors.push('Finance filter mismatch');
  await page.locator('[data-filter="全部"]').click();
  if(await page.locator('.project-card:visible').count()!==total)errors.push('Reset filter mismatch');
  await page.goto('http://127.0.0.1:4173/projects/jute-pest.html');
  await page.locator('#metric-select').selectOption('auc');
  if(!(await page.locator('#model-chart').innerText()).includes('0.9989'))errors.push('Chart selection mismatch');
  await page.screenshot({path:path.join(out,'project-desktop.png'),fullPage:true});
  await page.goto('http://127.0.0.1:4173/');
  const image=await page.locator('.portrait-frame img').evaluate(i=>({loaded:i.complete&&i.naturalWidth>0}));
  if(!image.loaded)errors.push('Avatar failed');
  await page.screenshot({path:path.join(out,'home-desktop.png'),fullPage:true});
  await page.screenshot({path:path.join(out,'home-desktop-first-screen.png')});
  for(const width of [390,768,1024,1440]){
    await page.setViewportSize({width,height:900});
    for(const route of width===390?pages:['index.html','projects.html','projects/jute-pest.html','experience.html','education.html','writing.html','contact.html']){
      await page.goto('http://127.0.0.1:4173/'+route+'?lang=en');
      if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))errors.push(`Overflow ${width} ${route}`);
    }
  }
  await page.setViewportSize({width:390,height:844});
  await page.goto('http://127.0.0.1:4173/');
  await page.locator('.menu-toggle').click();
  if(await page.locator('.menu-toggle').getAttribute('aria-expanded')!=='true')errors.push('Mobile menu failed');
  await page.keyboard.press('Escape');
  if(await page.locator('.menu-toggle').getAttribute('aria-expanded')!=='false')errors.push('Escape menu failed');
  await page.screenshot({path:path.join(out,'home-mobile.png'),fullPage:true});
  await page.screenshot({path:path.join(out,'home-mobile-first-screen.png')});
  await page.goto('http://127.0.0.1:4173/projects/jute-pest.html');
  await page.screenshot({path:path.join(out,'project-mobile.png'),fullPage:true});
  await page.goto('http://127.0.0.1:4173/projects.html');
  await page.screenshot({path:path.join(out,'projects-mobile.png'),fullPage:true});
  await page.goto(pathToFileURL(path.join(__dirname,'index.html')).href);
  await page.waitForSelector('main h1');
  if(await page.locator('.feature-project').count()!==1)errors.push('file:// rendering failed');
  // Verify root-relative paths also work when deployed under a GitHub Pages repository path.
  await browser.close();
  const report={pages:pages.length,projects:total,viewports:[390,768,1024,1440],errors:[...new Set(errors)]};
  fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));
  console.log(JSON.stringify(report,null,2));
  if(errors.length)process.exitCode=1;
})().catch(error=>{console.error(error);process.exitCode=1;});

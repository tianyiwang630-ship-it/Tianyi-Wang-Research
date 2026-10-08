// 生成独立 HTML 页面；运行一次即可，浏览站点不需要 Node.js。
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const site = __dirname;
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(site,'assets/data.js'),'utf8'),context);
vm.runInNewContext(fs.readFileSync(path.join(site,'assets/i18n.js'),'utf8'),context);
const data = context.window.portfolio;
const pages = [['index.html','home','总览'],['projects.html','projects','研究与项目'],['experience.html','experience','实习经历'],['education.html','education','教育背景'],['writing.html','writing','写作与思考'],['contact.html','contact','联系与简历']];
data.projects.forEach(p=>pages.push([`projects/${p.id}.html`,'project',p.title,p.id]));
data.experience.forEach(e=>pages.push([`experiences/${e.id}.html`,'experience-detail',`${e.org} · 实习经历`,e.id]));
const escape = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
for(const [file,page,title,id] of pages){
  const base = file.includes('/')?'../':'./';
  const englishTitle = page==='project'?context.window.portfolioEnglishProjects[id].title:page==='experience-detail'?context.window.portfolioEnglishExperience[id].org+' · Experience':context.window.portfolioI18n[title];
  const description = page==='project'?context.window.portfolioEnglishProjects[id].summary:'Tianyi Wang’s research portfolio: education, machine learning experiments, AI agents, quantitative finance, professional experience and writing.';
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${escape(description)}">
  <meta name="theme-color" content="#172331">
  <title>${escape(englishTitle)} | Tianyi Wang</title>
  <link rel="icon" type="image/svg+xml" href="${base}assets/favicon.svg">
  <link rel="stylesheet" href="${base}assets/style.css">
  <script defer src="${base}assets/data.js"></script>
  <script defer src="${base}assets/i18n.js"></script>
  <script defer src="${base}assets/language.js"></script>
  <script defer src="${base}assets/app.js"></script>
</head>
<body data-page="${page}" data-root="${base}"${id?` data-id="${id}"`:''}>
  <a class="skip-link" href="#app">跳到主要内容</a>
  <header id="site-header"></header>
  <main id="app" tabindex="-1"></main>
  <noscript><p>Please enable JavaScript to browse the full portfolio. You can also visit my <a href="https://github.com/number33550336-alt">machine learning and finance projects</a>, <a href="https://github.com/tianyiwang630-ship-it">AI projects</a>, or email <a href="mailto:twang121@usc.edu">twang121@usc.edu</a>.</p></noscript>
  <footer id="site-footer"></footer>
</body>
</html>
`;
  fs.mkdirSync(path.dirname(path.join(site,file)),{recursive:true});
  fs.writeFileSync(path.join(site,file),html,'utf8');
}
console.log(`Generated ${pages.length} HTML pages (${data.projects.length} projects, ${data.experience.length} experiences).`);

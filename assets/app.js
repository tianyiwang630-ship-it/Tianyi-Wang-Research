(() => {
  'use strict';
  const data = window.portfolio;
  const page = document.body.dataset.page || 'home';
  const root = document.body.dataset.root || './';
  const id = document.body.dataset.id;
  const app = document.getElementById('app');
  const locale = window.siteLocale || 'en';
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const href = path => root + path + (path.endsWith('.html') ? `?lang=${locale}` : '');
  const external = (url, label, cls = '') => `<a class="${cls}" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)}<span class="sr-only">（新窗口）</span></a>`;
  const link = (path, label, cls = '') => `<a class="${cls}" href="${href(path)}">${label}</a>`;
  const tags = values => `<div class="tags">${values.map(t => `<span>${esc(t)}</span>`).join('')}</div>`;
  const heroSkills = () => `<div class="hero-skills"><span>技能与方法</span><div class="hero-skill-groups"><div class="hero-skill-primary"><p>机器学习 · 深度学习 · 数据工程</p>${tags(['PyTorch','scikit-learn','pandas','NumPy','数据清洗','特征工程','数据处理流程','模型训练','超参数调优','交叉验证','模型评测'])}</div><div class="hero-skill-secondary"><p>系统与开发</p>${tags(['浏览器自动化','Agent 架构开发','前端开发','后端开发'])}</div></div></div>`;
  const sectionTitle = (num, title, text, path, label) => `<div class="section-head"><div><p class="eyebrow">${num}</p><h2>${title}</h2>${text ? `<p>${text}</p>` : ''}</div>${path ? link(path,label,'text-link') : ''}</div>`;
  const nav = [['home','index.html','总览'],['projects','projects.html','研究与项目'],['experience','experience.html','实习经历'],['education','education.html','教育背景'],['writing','writing.html','写作与思考']];
  const activePage = page === 'project' ? 'projects' : page === 'experience-detail' ? 'experience' : page;
  document.getElementById('site-header').innerHTML = `<div class="nav-shell"><a class="brand" href="${href('index.html')}" aria-label="王天一 首页"><span class="brand-mark">TW<span></span></span><span>王天一<span class="brand-sub">Tianyi Wang</span></span></a><button class="menu-toggle" aria-expanded="false" aria-controls="main-nav">菜单</button><nav id="main-nav" aria-label="主要导航">${nav.map(([key,path,label]) => `<a href="${href(path)}" ${activePage===key?'aria-current="page"':''}>${label}</a>`).join('')}${link('contact.html','联系 / 简历','nav-contact')}</nav></div>`;
  document.getElementById('site-footer').innerHTML = `<div class="footer-inner"><div><strong>王天一 <span>Tianyi Wang</span></strong><p>研究、实验与工程实践</p></div><div>${external('https://github.com/'+data.github[0],'GitHub · '+data.github[0])}${external('https://github.com/'+data.github[1],'GitHub · '+data.github[1])}<a href="mailto:${data.email}">${data.email}</a></div><small>© 2026 Tianyi Wang</small></div>`;
  document.querySelector('.nav-shell').insertAdjacentHTML('beforeend', `<div class="language-switch" role="group" aria-label="Language / 语言"><button type="button" data-language="en" lang="en" aria-pressed="${locale==='en'}">EN</button><span aria-hidden="true">/</span><button type="button" data-language="zh" lang="zh-CN" aria-pressed="${locale==='zh'}">中文</button></div>`);
  const schoolRows = () => data.education.map(e => `<a class="school-row" href="${href('education.html')}"><span class="school-mark">${e.mark}</span><div><strong>${e.school}</strong><span>${e.degree}</span></div><span class="school-date">${e.period}</span></a>`).join('');
  const chart = (compact = false, metric = 'f1') => {
    const models = [{name:'ResNet-101',f1:.9538,precision:.9555,recall:.9547,auc:.9989},{name:'ResNet-50',f1:.9425,precision:.9446,recall:.9437,auc:.9990},{name:'DenseNet-201',f1:.9207,precision:.9331,recall:.9182,auc:.9986},{name:'EfficientNet-B0',f1:.8795,precision:.8905,recall:.8802,auc:.9938},{name:'VGG16',f1:.8690,precision:.8852,recall:.8656,auc:.9919}];
    const names = {f1:'Macro-F1',precision:'Macro Precision',recall:'Macro Recall',auc:'OVR Macro-AUC'};
    return `<figure class="model-chart ${compact?'compact':''}"><figcaption><span>测试集 · ${names[metric]}</span><span>0 — 1</span></figcaption><div class="chart-rows">${models.map((m,i) => `<div class="bar-row"><span>${m.name}</span><div class="bar-track"><i class="${i===0?'best':''}" style="width:${m[metric]*100}%"></i></div><strong>${m[metric].toFixed(4)}</strong></div>`).join('')}</div><p class="chart-note">Jute Pest Dataset · 原始 Notebook 实验记录</p></figure>`;
  };
  const visual = p => {
    if(p.visual === 'agent') return `<div class="project-visual agent-visual" aria-label="多智能体与记忆结构示意"><span class="visual-caption">MULTI-AGENT RUNTIME</span><div class="agent-nodes"><span>主 Agent</span><span>独立 Agent A</span><span>独立 Agent B</span></div><div class="flow-line"></div><div class="memory-nodes"><span>共享工作区</span><span>记忆整理 / 审核</span></div><small>独立上下文 · 持续通信 · 可恢复执行</small></div>`;
    if(p.visual === 'asr') return `<div class="project-visual asr-visual"><span class="visual-caption">ASR · HOTWORD A/B</span><div class="asr-values"><div><span>基础 MER</span><strong>2.64<small>%</small></strong></div><div><span>开启热词 MER</span><strong>2.26<small>%</small></strong></div></div><div class="mini-bars"><span style="width:88%"></span><span style="width:75%"></span></div><small>Qwen3-ASR · 自建 10 条语音评测集</small></div>`;
    if(p.visual === 'quant') return `<div class="project-visual quant-visual"><span class="visual-caption">FACTOR RESEARCH PIPELINE</span><div class="quant-steps"><span><b>01</b>行情数据</span><span><b>02</b>滚动因子</span><span><b>03</b>交易信号</span><span><b>04</b>策略评估</span></div><code>position = signal.shift(1)</code><small>参数配置 · 次日开盘交易 · 结果比较</small></div>`;
    return `<div class="project-visual neutral-visual"><span class="visual-caption">${esc(p.en)}</span>${tags(p.tags.slice(0,3))}</div>`;
  };
  const projectCard = p => `<a class="project-card" href="${href('projects/'+p.id+'.html')}" data-category="${esc(p.category)}">${visual(p)}<div class="project-card-body"><p class="card-meta">${esc(p.category)}<span>${esc(p.type)}</span></p><h3>${esc(p.title)}</h3><p>${esc(p.summary)}</p>${tags(p.tags.slice(0,4))}<span class="card-action">查看研究过程与实现</span></div></a>`;
  const metricRow = p => p.metrics ? `<div class="metric-row">${p.metrics.map(([value,label])=>`<div><strong>${esc(value)}</strong><span>${esc(label)}</span></div>`).join('')}</div>` : '';
  const pageHeading = (en,title,intro) => `<div class="page-heading"><p class="eyebrow">${en}</p><h1>${title}</h1><p>${intro}</p></div>`;
  const crumbs = (category,path,title) => `<nav class="breadcrumbs" aria-label="面包屑">${link('index.html','首页')}<span>/</span>${link(path,category)}<span>/</span><span>${esc(title)}</span></nav>`;
  const experienceCard = e => `<a class="experience-card" href="${href('experiences/'+e.id+'.html')}"><div class="experience-logo">${esc(e.org)}</div><p class="company-en">${e.en}</p><p>${esc(e.role)}</p><span>${e.period}</span></a>`;
  const skills = [['模型与实验','PyTorch / scikit-learn','图像分类、特征工程、正则化、交叉验证与模型比较','projects/jute-pest.html'],['系统与编程','Python / Agent Runtime','工具接入、上下文管理、多智能体、权限与会话恢复','projects/sandrone.html'],['金融与数据','回测 / 统计分析','行情处理、滚动回归、可解释预测与行业研究','projects/quant-backtest.html']];
  const renderHome = () => {
    const primary = data.projects[0];
    return `<div class="hero"><div class="hero-main"><p class="eyebrow">RESEARCH & PRACTICE</p><h1>王天一<span>Tianyi Wang</span></h1><div class="education-overview">${schoolRows()}</div><p class="hero-intro">从问题出发，以数据、实验与代码展开研究。<br>在模型比较、智能体系统和金融分析中，连接方法、判断与实现。</p><div class="focus-line"><span>主要方向</span>${tags(['机器学习','AI 智能体','量化金融'])}</div>${heroSkills()}<div class="hero-links">${link('projects.html','浏览全部项目','button primary')}${link('contact.html','联系与简历','button secondary')}</div></div><aside class="profile-panel"><div class="portrait-frame"><img src="${href('assets/avatar.jpg')}" width="960" height="1440" alt="王天一的个人头像" fetchpriority="high"></div><div class="portrait-caption"><span>研究 · 实验 · 实现</span><span>01 / PROFILE</span></div><a class="profile-email" href="mailto:${data.email}">${data.email}</a></aside></div>
      <section class="selected-section">${sectionTitle('01 / SELECTED WORK','重点研究与项目','从具体问题、方法选择到实验结果与系统实现。','projects.html',`全部 ${data.projects.length} 个项目`)}<a class="feature-project" href="${href('projects/jute-pest.html')}"><div class="feature-copy"><p class="eyebrow">DEEP LEARNING · FINAL PROJECT</p><h3>用实验比较模型，<br>用代码完成验证。</h3><h4>${primary.title}</h4><p>${primary.summary}</p>${tags(primary.tags)}${metricRow(primary)}<span class="card-action">查看完整实验</span></div><div class="feature-figure">${chart(true)}</div></a><div class="project-grid home-projects">${data.projects.filter(p=>p.featured&&p.id!=='jute-pest').map(projectCard).join('')}</div></section>
      <section>${sectionTitle('02 / EXPERIENCE','真实业务中的研究与实践','互联网、金融科技与投资研究中的问题分析和成果落地。','experience.html','完整实习经历')}<div class="company-grid">${data.experience.map(experienceCard).join('')}</div></section>
      <section>${sectionTitle('03 / METHODS','能力建立在具体实践中','','projects.html','查看相关项目')}<div class="skills-grid">${skills.map(([title,tech,text,path])=>`<a href="${href(path)}"><h3>${title}</h3><strong>${tech}</strong><p>${text}</p></a>`).join('')}</div></section>
      <section class="home-connections"><div class="writing-preview"><p class="eyebrow">WRITING & REFLECTION</p><h2>天一的思考</h2><p>持续记录关于 AI、研究与阅读的思考。<br>让项目之外的判断与探索，也有迹可循。</p>${link('writing.html','阅读文章与项目思考','text-link')}</div><div class="github-preview"><p class="eyebrow">CODE & EXPERIMENTS</p><h2>代码与实验记录</h2>${data.github.map((g,i)=>external('https://github.com/'+g,`GitHub ${String(i+1).padStart(2,'0')} · ${g}`,'github-link')).join('')}<p>模型实验、金融工具与 AI 系统的公开实现。</p></div></section>`;
  };
  const renderProjects = () => {
    const categories = ['全部',...new Set(data.projects.map(p=>p.category))];
    return `${pageHeading('RESEARCH & PROJECTS','研究与项目','从机器学习实验到智能体系统，从金融建模到商业研究。每个项目记录具体的问题、方法与实现。')}<div class="project-filters" role="group" aria-label="项目分类">${categories.map((c,i)=>`<button type="button" data-filter="${esc(c)}" aria-pressed="${i===0}">${c}<span>${i===0?data.projects.length:data.projects.filter(p=>p.category===c).length}</span></button>`).join('')}</div><p id="project-count" class="list-count" aria-live="polite">共 ${data.projects.length} 个项目</p><div class="project-grid all-projects">${data.projects.map(projectCard).join('')}</div>`;
  };
  const renderTable = table => `<div class="table-wrap"><table><caption>${esc(table.caption)}</caption><thead><tr>${table.columns.map(c=>`<th scope="col">${esc(c)}</th>`).join('')}</tr></thead><tbody>${table.rows.map(row=>`<tr>${row.map((c,i)=>i===0?`<th scope="row">${esc(c)}</th>`:`<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  const renderProject = () => {
    const p = data.projects.find(p=>p.id===id);
    if(!p) return pageHeading('PROJECT','项目暂未找到','请从全部项目页面重新选择。')+link('projects.html','查看全部项目','button primary');
    document.title = `${p.title} | 王天一`;
    document.querySelector('meta[name="description"]').content = p.summary;
    const related = data.projects.filter(q=>q.id!==p.id&&q.category===p.category).slice(0,3);
    return `${crumbs('研究与项目','projects.html',p.title)}<div class="detail-heading"><p class="eyebrow">${esc(p.en)}</p><p class="detail-type">${esc(p.type)}</p><h1>${esc(p.title)}</h1><p class="detail-summary">${esc(p.summary)}</p>${tags(p.tags)}<div class="detail-actions">${p.repo?external(p.repo,'GitHub 链接','button primary'):''}${link('projects.html','全部项目','button secondary')}</div></div>${metricRow(p)}<div class="detail-layout"><aside class="detail-toc"><p>项目目录</p><a href="#research-question">研究问题</a><a href="#contribution">我的工作</a>${p.sections.map((s,i)=>`<a href="#section-${i}">${esc(s[0])}</a>`).join('')}${p.table?'<a href="#results">实验数据</a>':''}<a href="#sources">相关资料</a></aside><article class="detail-content"><section id="research-question" class="question-box"><p class="eyebrow">THE QUESTION</p><h2>${esc(p.question)}</h2></section><section id="contribution"><h2>我的工作</h2><p>${esc(p.contribution)}</p></section>${p.sections.map(([heading,text],i)=>`<section id="section-${i}"><span class="section-number">${String(i+1).padStart(2,'0')}</span><h2>${esc(heading)}</h2><p>${esc(text)}</p></section>`).join('')}${p.id==='sandrone'?`<section><h2>系统结构</h2>${visual(p)}</section>`:''}${p.id==='jute-pest'?'<section class="chart-section"><div class="chart-control"><h2>模型比较</h2><label>评测指标 <select id="metric-select"><option value="f1">Macro-F1</option><option value="precision">Macro Precision</option><option value="recall">Macro Recall</option><option value="auc">OVR Macro-AUC</option></select></label></div><div id="model-chart">'+chart()+'</div></section>':''}${p.table?`<section id="results"><h2>实验数据</h2>${renderTable(p.table)}</section>`:''}<section id="sources"><h2>相关资料</h2><div class="source-links">${p.repo?external(p.repo,'项目仓库与说明'):''}${(p.sources||[]).map(([title,url])=>external(url,title)).join('')}${!p.repo?'<p>项目经历见个人简历。</p>'+link('contact.html','查看简历'):''}</div></section></article></div>${related.length?`<section>${sectionTitle('CONTINUE EXPLORING','相关项目','','projects.html','全部项目')}<div class="project-grid">${related.map(projectCard).join('')}</div></section>`:''}`;
  };
  const renderExperience = () => `${pageHeading('PROFESSIONAL EXPERIENCE','实习经历','在互联网与金融场景中，参与问题分析、数据研究、AI 评测与产品落地。')}<div class="experience-list">${data.experience.map((e,i)=>`<a href="${href('experiences/'+e.id+'.html')}" class="experience-entry"><div class="timeline-index">${String(i+1).padStart(2,'0')}</div><div><p class="eyebrow">${e.en} · ${e.sector}</p><h2>${e.org}</h2><h3>${e.role}</h3><p>${e.summary}</p><span class="card-action">查看工作内容与成果</span></div><span class="experience-period">${e.period}</span></a>`).join('')}</div>`;
  const renderExperienceDetail = () => {
    const e = data.experience.find(e=>e.id===id);
    if(!e) return renderExperience();
    document.title = `${e.org} · 实习经历 | 王天一`;
    return `${crumbs('实习经历','experience.html',e.org)}<div class="detail-heading"><p class="eyebrow">${e.en} · ${e.sector}</p><h1>${e.org}</h1><h2 class="experience-role">${e.role}</h2><p class="detail-type">${e.period}</p><p class="detail-summary">${e.summary}</p></div><div class="narrow-content">${e.points.map(([heading,text],i)=>`<section class="experience-point"><span class="section-number">${String(i+1).padStart(2,'0')}</span><h2>${heading}</h2><p>${text}</p></section>`).join('')}<div class="detail-actions">${link('experience.html','返回全部经历','button primary')}${link('projects.html','查看研究项目','button secondary')}</div></div>`;
  };
  const renderEducation = () => `${pageHeading('EDUCATION & FOUNDATION','教育背景','以数学、统计、金融与数据科学为基础，持续通过项目与实验深化理解。')}<div class="education-list">${data.education.map(e=>`<section class="education-detail"><div class="school-mark large">${e.mark}</div><div><p class="eyebrow">${e.en}</p><h2>${e.school}</h2><h3>${e.degree}</h3><span class="education-period">${e.period}</span><p>${e.text}</p><h4>${e.mark==='USC'?'相关项目实践':'本科课程基础'}</h4>${tags(e.courses)}</div></section>`).join('')}</div><section>${sectionTitle('LEARNING THROUGH PRACTICE','学习与实验相互推进','','projects.html','查看全部项目')}<div class="skills-grid">${skills.map(([t,tech,text,path])=>`<a href="${href(path)}"><h3>${t}</h3><strong>${tech}</strong><p>${text}</p></a>`).join('')}</div></section>`;
  const renderWriting = () => `${pageHeading('WRITING & REFLECTION','写作与思考','通过写作梳理问题、记录探索，并将技术实践中的判断继续展开。')}<div class="channel-banner"><span class="channel-mark">思</span><div><p class="eyebrow">WECHAT PUBLIC ACCOUNT</p><h2>天一的思考</h2><p>关于 AI、阅读与生活的长期记录。</p></div></div><div class="article-list">${data.articles.map((a,i)=>`<a href="${esc(a.url)}" target="_blank" rel="noopener noreferrer"><span class="article-index">${String(i+1).padStart(2,'0')}</span><div><span class="article-tag">${a.tag}</span><h2>${a.title}</h2><p>${a.subtitle}</p></div><span class="article-action">阅读文章<span class="sr-only">（新窗口）</span></span></a>`).join('')}</div>`;
  const renderContact = () => `${pageHeading('CONTACT & CV','联系与简历','欢迎围绕研究问题、算法实践、智能体系统与金融应用交流。')}<div class="contact-grid"><section class="contact-card"><p class="eyebrow">GET IN TOUCH</p><h2>王天一</h2><a class="contact-email" href="mailto:${data.email}">${data.email}</a><p>公众号：天一的思考</p>${link('writing.html','查看公众号文章','text-link')}</section><section class="contact-card"><p class="eyebrow">CURRICULUM VITAE</p><h2>个人简历</h2><p>教育背景、实习经历与代表项目。</p><div class="resume-links"><a class="button primary" href="${href('assets/resume-ai.pdf')}" target="_blank" rel="noopener">AI 项目简历 · 0927</a><a class="button secondary" href="${href('assets/resume-finance.pdf')}" target="_blank" rel="noopener">金融简历 · 0912</a></div></section><section class="contact-card github-contact"><p class="eyebrow">GITHUB</p><h2>两个账号，同一份探索</h2>${data.github.map(g=>external('https://github.com/'+g,g,'github-link')).join('')}</section></div>`;
  const renders = {home:renderHome,projects:renderProjects,project:renderProject,experience:renderExperience,'experience-detail':renderExperienceDetail,education:renderEducation,writing:renderWriting,contact:renderContact};
  app.innerHTML = (renders[page] || renderHome)();
  if (page === 'project') {
    const notebookProjects = ['jute-pest','time-series','interpretable-models','aps-failure','frog-calls','active-learning','quant-backtest'];
    const sourceExtension = notebookProjects.includes(id) ? 'ipynb' : ['bitcoin-backtest','stock-series'].includes(id) ? 'py' : null;
    if (sourceExtension) {
      const sourceLink = document.createElement('a');
      sourceLink.href = href(`assets/notebooks/${id}.${sourceExtension}`);
      sourceLink.download = `${id}.${sourceExtension}`;
      sourceLink.textContent = sourceExtension === 'ipynb' ? '下载原始 Notebook（含实验输出）' : '下载 Python 源码';
      document.querySelector('.source-links').appendChild(sourceLink);
    }
  }
  window.translateSite?.();
  document.querySelector('.brand > span:last-child').textContent='Tianyi Wang';
  document.querySelector('.brand').setAttribute('aria-label',`Tianyi Wang ${locale==='en'?'home':'首页'}`);
  const heroTitle=document.querySelector('.hero h1');
  if(heroTitle)heroTitle.textContent='Tianyi Wang';
  document.querySelector('.footer-inner strong').textContent='Tianyi Wang';
  const contactName=document.querySelector('.contact-card h2');
  if(contactName)contactName.textContent='Tianyi Wang';
  if(locale==='en') {
    document.title=window.translateText(document.title).replaceAll('王天一','Tianyi Wang');
    const description=document.querySelector('meta[name="description"]');
    description.content=page==='project'?window.portfolioEnglishProjects[id]?.summary||description.content:'Tianyi Wang’s research portfolio: education, machine learning experiments, AI agents, quantitative finance, professional experience and writing.';
  } else {
    const pageTitles={home:'总览',projects:'研究与项目',experience:'实习经历',education:'教育背景',writing:'写作与思考',contact:'联系与简历'};
    if(pageTitles[page])document.title=`${pageTitles[page]} | Tianyi Wang`;
    if(page!=='project')document.querySelector('meta[name="description"]').content='王天一的研究与技术实践作品集：教育背景、机器学习实验、AI 智能体、量化金融、实习经历与公众号文章。';
  }
  document.title=document.title.replaceAll('王天一','Tianyi Wang');
  document.querySelectorAll('[data-language]').forEach(button=>button.addEventListener('click',()=>{
    const next=button.dataset.language;
    try{localStorage.setItem('tianyi-portfolio-language',next);}catch(_){}
    const url=new URL(location.href);
    url.searchParams.set('lang',next);
    location.assign(url.href);
  }));
  const menu = document.querySelector('.menu-toggle');
  const navigation = document.getElementById('main-nav');
  menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));navigation.classList.toggle('is-open',open);});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){menu.setAttribute('aria-expanded','false');navigation.classList.remove('is-open');menu.focus();}});
  document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
    const filter=button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    let count=0;
    document.querySelectorAll('.all-projects .project-card').forEach(card=>{card.hidden=filter!=='全部'&&card.dataset.category!==filter;if(!card.hidden)count++;});
    document.getElementById('project-count').textContent=`${filter==='全部'?'全部项目':filter} · ${count} 个项目`;
    window.translateSite?.(document.getElementById('project-count'));
  }));
  document.getElementById('metric-select')?.addEventListener('change',event=>{document.getElementById('model-chart').innerHTML=chart(false,event.target.value);window.translateSite?.(document.getElementById('model-chart'));});
})();

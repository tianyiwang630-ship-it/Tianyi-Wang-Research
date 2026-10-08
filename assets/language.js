(() => {
  const params = new URLSearchParams(location.search);
  let saved;
  try { saved = localStorage.getItem('tianyi-portfolio-language'); } catch (_) { /* file access may block storage */ }
  const requested = params.get('lang');
  const locale = ['en','zh'].includes(requested) ? requested : ['en','zh'].includes(saved) ? saved : 'en';
  try { localStorage.setItem('tianyi-portfolio-language',locale); } catch (_) { /* URL preserves language without storage */ }
  window.siteLocale = locale;
  document.documentElement.lang = locale === 'en' ? 'en' : 'zh-CN';
  const translations = {...window.portfolioI18n};
  const pair = (chinese,english) => {
    if(typeof chinese==='string'&&typeof english==='string')translations[chinese]=english;
    else if(Array.isArray(chinese)&&Array.isArray(english))chinese.forEach((value,i)=>pair(value,english[i]));
    else if(chinese&&english&&typeof chinese==='object'&&typeof english==='object')Object.keys(english).forEach(key=>pair(chinese[key],english[key]));
  };
  window.portfolio.projects.forEach(project=>pair(project,window.portfolioEnglishProjects[project.id]));
  window.portfolio.experience.forEach(experience=>pair(experience,window.portfolioEnglishExperience[experience.id]));
  const keys = Object.keys(translations).sort((a,b)=>b.length-a.length);
  const translateText = text => {
    if(locale !== 'en')return text;
    const trimmed=text.trim();
    if(translations[trimmed])return text.replace(trimmed,translations[trimmed]);
    // Dynamic counts stay numbers in either language.
    const countPatterns=[[/^全部 (\d+) 个项目$/,'All $1 projects'],[/^共 (\d+) 个项目$/,'$1 projects'],[/^全部项目 · (\d+) 个项目$/,'All projects · $1 projects']];
    for(const [pattern,replacement] of countPatterns)if(pattern.test(trimmed))return trimmed.replace(pattern,replacement);
    let result=text;
    for(const key of keys){if(result.includes(key))result=result.split(key).join(translations[key]);}
    return result.replace(/(\d+) 个项目/g,'$1 projects').replace('公众号：','WeChat: ');
  };
  window.translateText = translateText;
  window.translateSite = (element=document.body) => {
    if(locale !== 'en')return;
    const walker=document.createTreeWalker(element,NodeFilter.SHOW_TEXT,{acceptNode:node=>['SCRIPT','STYLE','NOSCRIPT'].includes(node.parentElement?.tagName)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT});
    while(walker.nextNode()){const node=walker.currentNode;node.nodeValue=translateText(node.nodeValue);}
    element.querySelectorAll('[alt],[aria-label],[title]').forEach(node=>{
      for(const attribute of ['alt','aria-label','title'])if(node.hasAttribute(attribute))node.setAttribute(attribute,translateText(node.getAttribute(attribute)));
    });
  };
})();

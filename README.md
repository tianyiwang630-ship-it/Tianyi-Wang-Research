# 王天一研究作品集

纯 HTML、CSS 和 JavaScript 的多页面个人网站。直接打开 index.html 即可浏览；所有资源使用相对路径，可以部署到 GitHub Pages 的子路径。

首页以教育背景开篇，展示重点项目、实习公司、公众号和两个 GitHub 账号。projects.html 收录全部研究与实践项目，每个项目都有独立详情页。experience.html、education.html、writing.html、contact.html 分别展示实习、教育、写作和联系信息。

内容依据本地项目、最新 AI 与金融简历、总简历，以及用户两个 GitHub 账号的公开项目说明。实验指标沿用原始 Notebook 和评测报告，未重新训练模型。机器人公司信息尚待用户补充。

维护项目内容：assets/data.js；页面渲染和交互：assets/app.js；样式：assets/style.css。

默认英文。顶部 EN / 中文切换作用于所有页面，语言选择保存在浏览器中，并通过页面链接的 lang 参数传递。英文内容位于 assets/i18n.js；本地翻译机制位于 assets/language.js。共 19 个项目、5 段实习经历，不含腾讯实习。

本地预览：使用 Python 执行 `python -m http.server 4173 --bind 127.0.0.1 --directory research-site`，然后打开 http://127.0.0.1:4173。

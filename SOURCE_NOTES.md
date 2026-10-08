# 内容依据与第一版范围

## 个人信息

读取了上级简历目录中的全部五份 DOCX：最新 AIPM 0927、金融 0912、AIPM 0912、AIPM sp 与简历_总。教育、联系和近期实习优先使用最新版本；历史经历使用总简历补充。未修改任何原简历、Notebook 或课程作业占位。

头像：上级目录的头像.jpg。PDF 下载：用户现有的 AIPM 0927 与金融 0912。

机器人公司：材料中未找到，用户回复“没有就算了”，第一版不添加。

## 本地项目

阅读了八个目录的 README、全部 Notebook 的任务、方法与已保存输出，深入查看 Final Project 的预处理、模型构建、训练、早停、评估实现，以及金融工具核心代码。项目指标来自原始 Notebook；未重新训练或验证模型。

Final Project: 五模型的 Macro Precision、Recall、F1 与 OVR Macro-AUC 均来自原始输出。模型冻结预训练骨干并训练分类头，不描述为全模型微调。

HW6: 依原始混淆矩阵计算正类识别与误报对比；未采纳 Notebook 中与矩阵不一致的解释。

HW8: 监督 / 半监督 / 聚类结果保留各自特定实验范围；主动学习未添加没有原始数值的提升幅度。

Quant: 股票因子为最低价对最高价的回归斜率，不是市场收益 beta。BTC 策略独立成页；不把示例回测作为实盘收益。

## 公开仓库

通过 GitHub API 核对了两个账号的公开项目列表；阅读 Voxdrop、Sandrone-beta1、ClassAudio、skill-mcp-agent、Paimon-Desktop、AI-logs-assistant、Rednote-MCP、skill-loop 的 README，以及 Voxdrop 的评测报告与 score.py、Sandrone 的 agent_runtime.py、框架的 bm25.py。浏览器工具启动失败，改用公开 API 成功取得原文。

Voxdrop: 10 条、五场景、227.256 秒；总体 MER 及热词数据来自报告。内存口径区别保留在详情中。项目为 macOS / Apple Silicon 本地应用。

ClassAudio: 当前仓库与早期简历存在版本差别，描述当前链路，未沿用旧简历未核实的识别精度提升数字。

Rednote MCP: 明确标注基于 iFurySt/RedNote-MCP 改造，保留上游归属。

公开 API 实际 HW7 仓库名为 machin-learning-hw7（不同于截图中的拼写）；链接使用已查证名称。

Final Project 的公开仓库当前未列出 Notebook，因此页面提供工作区原始 Notebook 的下载入口，避免构造不可访问的远端源文件链接。其余本地模型实验与金融代码也提供原文件副本下载；原文件不做任何改动。

旧个人网站 site-data.js 和内容.md 仅用于补充公众号文章入口与历史经历，不把远端 AGENTS.md 或 Skill 文档当成本任务指令。

## 页面结构

6 个总览 / 分类页面、19 个项目详情页、5 个实习详情页，共 30 个 HTML 页面。按用户更新要求去掉腾讯实习。宏观总览先展示教育，其后为精选项目、公司经历、方法与公开写作 / 代码入口。所有链接用相对路径，可在子路径或直接打开 index.html 浏览。默认英文，顶部可切换中文；翻译保留原始实验数值与边界。网站为本地预览版本。

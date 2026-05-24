# AI Knowledge Base QA Platform

一个面向科研文献与实验资料的 AI 知识库问答前端项目。项目模拟了从文档上传、知识库管理、AI 流式问答、引用溯源到数据看板的完整产品流程，适合作为前端简历项目或 AI 应用前端 Demo 展示。

当前版本默认使用前端 mock 数据运行，不依赖真实后端；也预留了 Axios 接口层和 SSE 流式输出接入点，后续可以无缝连接 FastAPI / Flask / RAG 后端服务。

## 项目亮点

- 基于 `Vue3 + TypeScript + Vite` 搭建现代前端工程
- 使用 `Vue Router` 拆分登录页、问答页、知识库页和数据看板页
- 使用 `Pinia` 管理登录态、知识库、会话、文档解析状态和流式回答状态
- 使用 `Axios` 封装登录、文档上传、文档解析、问答等接口
- 使用 `SSE` 模拟大模型流式输出，支持后续接入真实 LLM 服务
- 接入 `Element Plus` 完成表单、上传、表格、标签、按钮和消息提示
- 使用 `ECharts` 展示文献分类、问答趋势和知识库统计指标
- mock 知识库基于 NV 色心、量子传感、Rydberg 原子传感等科研文献主题构建
- 提供 Node 本地大模型代理，可接入 OpenAI-compatible Chat Completions API

## 技术栈

```text
Vue3
TypeScript
Vite
Vue Router
Pinia
Axios
Element Plus
ECharts
SSE
```

## 功能模块

| 模块 | 功能 |
| --- | --- |
| 登录 | 模拟账号登录、Token 存储、路由守卫 |
| 智能问答 | 类 ChatGPT 对话界面、SSE 流式回答、重新生成 |
| 引用溯源 | 展示回答关联文献、片段摘要和主题标签 |
| 知识库管理 | 文档上传、解析状态、文档表格、批量解析 |
| 数据看板 | 文献数量、PDF 数量、主题分类、解析片段统计 |
| API 封装 | 登录、上传、解析、问答、SSE 流接口预留 |
| 组内百科 | 实验 SOP、故障排查、仪器通信、数据归档、软件部署、安全 checklist |
| AI/ML 百科 | Agent 架构、ReAct、Tool Calling、RAG、Embedding、PyTorch、谱线处理、模型评估 |

## 知识库内容

前端 mock 数据已根据一批 NV 色心与量子传感文献做了演示级扩充。项目只记录代表性文献标题、主题分类和统计信息，没有复制原始论文文件，适合公开上传到 GitHub。

资料概况：

```text
文件总数：848
PDF：836
CAJ：4
PPTX：3
RAR：3
XLSX：1
ZIP：1
```

主题分类：

```text
磁测量/磁力计：338
量子控制/相干：370
ODMR/微波/RF：109
宽场/成像/扫描：107
温度/热测量：66
光纤/集成传感：54
Rydberg/原子传感：34
生物/医学应用：30
AI/反演重建：18
实验 SOP/故障排查：42
软件部署/数据规范：27
```

## 目录结构

```text
ai-knowledge-frontend
├─ src
│  ├─ api                 # Axios 请求封装、mock 后端、SSE 客户端
│  ├─ components          # 页面组件
│  ├─ pages               # 路由页面
│  ├─ router              # Vue Router 配置和路由守卫
│  ├─ stores              # Pinia 状态管理
│  ├─ mockData.ts         # 知识库 mock 数据
│  ├─ styles.css          # 全局样式
│  └─ types.ts            # TypeScript 类型定义
├─ index.html
├─ package.json
├─ vite.config.ts
└─ README.md
```

## 快速开始

安装依赖：

```bash
npm install
```

启动开发服务：

```bash
npm run dev
```

构建生产版本：

```bash
npm run build
```

预览生产构建：

```bash
npm run preview
```

Windows 下如果新终端暂时识别不到 `node` / `npm`，可以运行：

```powershell
.\start-dev.ps1
```

## 接入真实大模型 API

浏览器端不能直接保存大模型 API Key，因此项目提供了本地代理服务：

```bash
npm run server
```

复制环境变量模板：

```bash
copy .env.example .env
```

填写 `.env`：

```text
LLM_API_KEY=你的大模型 API Key
LLM_BASE_URL=https://api.deepseek.com
LLM_MODEL=deepseek-chat
LLM_PROXY_PORT=8787
```

注意：不要把真实 API Key 提交到 GitHub。`.env` 已经在 `.gitignore` 中，只应保存在本机或服务器。

前端根目录新建 `.env.local`：

```text
VITE_USE_MOCK=false
VITE_API_BASE_URL=http://127.0.0.1:8787/api
```

然后同时启动：

```bash
npm run server
npm run dev
```

代理支持 OpenAI-compatible `/chat/completions` 接口。没有填写 `LLM_API_KEY` 时，会自动使用本地兜底回答，方便调试前端流程。

## 环境变量

项目默认使用 mock 数据，可以直接运行。需要接真实后端时，在项目根目录新建 `.env.local`：

```text
VITE_USE_MOCK=false
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

## 后端接口约定

前端已封装以下接口：

```text
POST /auth/login
GET  /libraries
POST /libraries/:libraryId/documents
POST /libraries/:libraryId/documents/:documentId/parse
POST /chat/ask
GET  /chat/stream?libraryId=xxx&conversationId=xxx&question=xxx
```

SSE 流式接口支持以下消息格式：

```text
data: {"delta":"本次增量文本"}
data: [DONE]
```

也支持直接返回纯文本增量：

```text
data: 本次增量文本
```

## 部署说明

项目已配置 GitHub Pages 自动部署。推送到 `main` 分支后，GitHub Actions 会自动构建并发布 `dist` 目录。

部署完成后的访问地址：

```text
https://waou121.github.io/ai-knowledge-frontend/
```

也可以部署到 Vercel、Netlify 或其他静态托管平台。

构建命令：

```bash
npm run build
```

输出目录：

```text
dist
```

## 简历描述

```text
AI 知识库问答与数据分析平台 | 前端开发

1. 基于 Vue3 + TypeScript + Vite 构建 AI 知识库问答平台，使用 Vue Router 拆分登录、问答、知识库和数据看板页面。
2. 使用 Pinia 管理用户、知识库、会话、文档解析状态和流式回答状态，并通过 Axios 封装登录、上传、问答和文档管理接口。
3. 设计类 ChatGPT 对话交互界面，接入 SSE 流式输出机制，支持 AI 回复加载态、重新生成、会话切换和引用溯源展示。
4. 接入 Element Plus 完成表单、上传、表格、按钮、标签和消息提示等基础交互组件，提升后台系统使用体验。
5. 使用 ECharts 构建问答趋势折线图和问题分类环形图，展示文档数量、问答次数、命中率和引用覆盖率等关键指标。
```

## 后续计划

- 接入 FastAPI 后端，实现真实文档解析、分块、向量检索和 RAG 问答
- 增加会话持久化、用户权限和知识库权限管理
- 增加问答评价、引用片段高亮和文档预览能力
- 对 Element Plus 和 ECharts 做按需加载，进一步优化首屏体积

## 本地论文 RAG

论文可以做成 RAG。当前项目已经支持把本地 PDF / Markdown / TXT 资料解析成 `server/rag-index.json`，后端启动时会自动读取该索引，并在问答时把命中的论文片段放进大模型上下文。

生成论文索引：

```powershell
Set-Location "D:\新python上位机\ai-knowledge-frontend"
npm run rag:build -- --source "D:\论文\NV centers" --output server\rag-index.json --limit 80 --max-pages 8
```

启动后端和前端：

```powershell
npm run server
npm run dev
```

检查 RAG 是否加载成功：

```text
http://127.0.0.1:8787/api/rag/status
```

说明：

- `server/rag-index.json` 已加入 `.gitignore`，不会上传到 GitHub，避免公开论文内容。
- GitHub Pages 只能部署静态前端，不能直接运行本地 RAG 后端。给项目组使用时，需要在实验室电脑、内网服务器或云服务器上运行 `npm run server`。
- 当前 RAG 检索是轻量关键词召回，适合演示和小型知识库。后续可以升级为 Embedding + 向量数据库 + rerank，以获得更稳定的语义检索效果。

## 在线问答部署

GitHub Pages 只能托管前端静态文件。要让在线链接也能问答，需要再部署一个 Node.js 后端服务，用来保存 DeepSeek API Key、调用模型并提供 RAG 检索接口。

推荐结构：

```text
GitHub Pages 前端
  -> VITE_API_BASE_URL=https://你的后端域名/api
  -> Node.js 后端
  -> DeepSeek API
```

后端可部署到 Render、Railway、Fly.io、Vercel Serverless 或实验室服务器。项目已包含 `render.yaml`，可以直接在 Render 创建 Web Service：

```text
Build Command: npm install
Start Command: node server/llm-proxy.mjs
Environment:
  LLM_API_KEY=你的 DeepSeek API Key
  LLM_BASE_URL=https://api.deepseek.com
  LLM_MODEL=deepseek-chat
```

线上没有本地 `server/rag-index.json` 时，后端会自动加载 `server/rag-index.demo.json` 作为公开演示索引。完整论文 RAG 仍建议只在本地或内网服务器运行，避免公开论文原文和内部资料。

部署好后端后，在 GitHub 仓库的 Actions/Pages 构建环境中设置：

```text
VITE_USE_MOCK=false
VITE_API_BASE_URL=https://你的后端域名/api
```

重新触发 GitHub Pages 部署后，在线页面就可以调用线上后端进行问答。

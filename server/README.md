# LLM Proxy

这个目录提供一个本地大模型 API 代理，用于把前端项目接入真实大模型，同时避免把 API Key 暴露在浏览器源码中。

## 启动方式

复制环境变量示例：

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

不要把真实 API Key 提交到 GitHub。`.env` 已经被 `.gitignore` 排除。

启动代理：

```bash
npm run server
```

前端 `.env.local`：

```text
VITE_USE_MOCK=false
VITE_API_BASE_URL=http://127.0.0.1:8787/api
```

再启动前端：

```bash
npm run dev
```

## 接口

```text
GET  /api/health
POST /api/auth/login
GET  /api/libraries
POST /api/chat/ask
GET  /api/chat/stream?question=...
```

`/api/chat/stream` 使用 SSE 返回：

```text
data: {"delta":"增量文本"}
data: [DONE]
```

import http from "node:http";
import { readFileSync, existsSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const envPath = new URL("../.env", import.meta.url);
if (existsSync(envPath)) {
  const envText = readFileSync(envPath, "utf-8");
  for (const line of envText.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const [key, ...valueParts] = trimmed.split("=");
    if (!process.env[key]) {
      process.env[key] = valueParts.join("=").trim();
    }
  }
}

const port = Number(process.env.PORT || process.env.LLM_PROXY_PORT || 8787);
const apiKey = process.env.LLM_API_KEY || "";
const baseUrl = (process.env.LLM_BASE_URL || "https://api.deepseek.com").replace(/\/$/, "");
const model = process.env.LLM_MODEL || "deepseek-chat";
const ragIndexPath = new URL("./rag-index.json", import.meta.url);
const demoRagIndexPath = new URL("./rag-index.demo.json", import.meta.url);
const activeRagIndexPath = existsSync(ragIndexPath) ? ragIndexPath : demoRagIndexPath;
const serverDir = path.dirname(fileURLToPath(import.meta.url));
const ragDataDir = process.env.RAG_DATA_DIR || path.join(serverDir, "data");
const uploadedRagPath = path.join(ragDataDir, "uploaded-rag.json");

let ragChunks = [];
let ragIndexName = "none";
const uploadedDocuments = new Map();
let ragRetrieval = {
  embeddingModel: "keyword-only",
  embeddingDim: 384,
  vectorSearch: "none",
  rerank: "keyword-score",
};
if (existsSync(activeRagIndexPath)) {
  try {
    const ragPayload = JSON.parse(readFileSync(activeRagIndexPath, "utf-8"));
    ragChunks = Array.isArray(ragPayload.chunks) ? ragPayload.chunks : [];
    ragRetrieval = { ...ragRetrieval, ...(ragPayload.retrieval || {}) };
    ragIndexName = activeRagIndexPath.pathname.endsWith("rag-index.demo.json") ? "demo" : "local";
  } catch (error) {
    console.warn(`Failed to load local RAG index: ${error instanceof Error ? error.message : error}`);
  }
}

function loadUploadedRagStore() {
  if (!existsSync(uploadedRagPath)) return;
  try {
    const payload = JSON.parse(readFileSync(uploadedRagPath, "utf-8"));
    const uploadedChunks = Array.isArray(payload.chunks) ? payload.chunks : [];
    const documents = Array.isArray(payload.documents) ? payload.documents : [];
    ragChunks.push(...uploadedChunks);
    for (const document of documents) {
      uploadedDocuments.set(String(document.id), document);
    }
    if (uploadedChunks.length) {
      ragIndexName = ragIndexName === "none" ? "uploaded" : `${ragIndexName}+uploaded`;
      ragRetrieval = { ...ragRetrieval, ...(payload.retrieval || {}) };
    }
  } catch (error) {
    console.warn(`Failed to load uploaded RAG store: ${error instanceof Error ? error.message : error}`);
  }
}

function saveUploadedRagStore() {
  mkdirSync(ragDataDir, { recursive: true });
  const uploadedChunks = ragChunks.filter((chunk) => String(chunk.path || "").startsWith("uploaded://"));
  const payload = {
    updatedAt: new Date().toISOString(),
    documents: [...uploadedDocuments.values()],
    chunkCount: uploadedChunks.length,
    retrieval: ragRetrieval,
    chunks: uploadedChunks,
  };
  writeFileSync(uploadedRagPath, JSON.stringify(payload, null, 2), "utf-8");
}

loadUploadedRagStore();

const libraries = [
  {
    id: "lab-wiki",
    name: "项目组百科与实验 SOP",
    docs: [
      { id: 401, name: "NV 色心入门术语表.md", type: "Markdown", size: "96 KB", status: "已解析", chunks: 42 },
      { id: 402, name: "ODMR 实验 SOP：从开机到寻峰.md", type: "Markdown", size: "188 KB", status: "已解析", chunks: 86 },
      { id: 405, name: "仪器连接与 Serial / SCPI 地址表.md", type: "Markdown", size: "128 KB", status: "已解析", chunks: 61 },
      { id: 406, name: "常见故障排查手册：无峰、低信噪比、漂移.md", type: "Markdown", size: "214 KB", status: "已解析", chunks: 104 },
      { id: 407, name: "实验数据命名、归档与复现实验规范.md", type: "Markdown", size: "118 KB", status: "已解析", chunks: 56 },
      { id: 408, name: "上位机软件部署与 PyInstaller 打包说明.md", type: "Markdown", size: "136 KB", status: "已解析", chunks: 64 },
    ],
  },
  {
    id: "ai",
    name: "AI Agent 与机器学习百科库",
    docs: [
      { id: 308, name: "LLM Agent 基础：Planning、Memory、Tools、Reflection.md", type: "Markdown", size: "196 KB", status: "已解析", chunks: 88 },
      { id: 309, name: "ReAct 工作流：Thought、Action、Observation 设计.md", type: "Markdown", size: "174 KB", status: "已解析", chunks: 79 },
      { id: 310, name: "Tool Calling 工具注册、参数校验与错误恢复.md", type: "Markdown", size: "168 KB", status: "已解析", chunks: 73 },
      { id: 311, name: "RAG 知识库：文本切分、Embedding、向量检索、重排序.md", type: "Markdown", size: "232 KB", status: "已解析", chunks: 105 },
      { id: 315, name: "PyTorch 入门：Dataset、DataLoader、Module、训练循环.md", type: "Markdown", size: "211 KB", status: "已解析", chunks: 94 },
      { id: 316, name: "实验信号处理：滤波、降噪、峰值检测与曲线拟合.md", type: "Markdown", size: "189 KB", status: "已解析", chunks: 83 },
    ],
  },
  {
    id: "nv",
    name: "NV 色心量子传感文献库",
    docs: [
      { id: 1, name: "The nitrogen-vacancy colour centre in diamond.pdf", type: "PDF", size: "1.8 MB", status: "已解析", chunks: 164 },
      { id: 6, name: "Avoiding power broadening in optically detected magnetic resonance of single NV defects.pdf", type: "PDF", size: "1.4 MB", status: "已解析", chunks: 118 },
      { id: 9, name: "Wide-field magnetometry using nitrogen-vacancy color centers with randomly oriented micro-diamonds.pdf", type: "PDF", size: "3.0 MB", status: "已解析", chunks: 232 },
      { id: 30, name: "金刚石NV色心磁力计极限灵敏度优化方法.pdf", type: "PDF", size: "2.9 MB", status: "已解析", chunks: 219 },
    ],
  },
];

function restoreUploadedDocumentsIntoLibraries() {
  for (const document of uploadedDocuments.values()) {
    const library = libraries.find((item) => item.id === document.libraryId) || libraries[0];
    if (!library.docs.some((item) => String(item.id) === String(document.id))) {
      library.docs.unshift(document);
    }
  }
}

restoreUploadedDocumentsIntoLibraries();

const references = [
  {
    title: "ODMR 实验 SOP：从开机到寻峰.md / checklist",
    source: "标准流程包括检查激光与相机、连接微波源、确认 TTL 触发、设置频率扫描范围、执行低分辨率预扫、缩小窗口拟合并保存参数快照。",
    tag: "实验 SOP",
  },
  {
    title: "仪器连接与 Serial / SCPI 地址表.md / device map",
    source: "组内仪器应记录设备型号、连接方式、串口号或 VISA 地址、波特率、常用 SCPI 命令和上位机工具函数。",
    tag: "仪器通信",
  },
  {
    title: "实验数据命名、归档与复现实验规范.md / data rule",
    source: "每次实验应保存原始数据、处理脚本、关键参数、拟合结果和实验备注，目录命名优先保证可检索、可复现和可追溯。",
    tag: "数据归档",
  },
  {
    title: "RAG 知识库：文本切分、Embedding、向量检索、重排序.md / retrieval",
    source: "RAG 质量通常由切分粒度、Embedding 模型、召回数量、重排序策略和引用片段展示共同决定，需要同时优化召回率和答案可验证性。",
    tag: "RAG 检索",
  },
  {
    title: "ReAct 工作流：Thought、Action、Observation 设计.md / agent loop",
    source: "ReAct 将推理过程与工具调用交替组织，适合需要分步检索、读取文档、调用实验工具并根据观察结果继续决策的任务。",
    tag: "ReAct",
  },
  {
    title: "实验信号处理：滤波、降噪、峰值检测与曲线拟合.md / signal processing",
    source: "实验谱线处理应先做质量检查和预处理，再进行寻峰、拟合、参数估计和异常标注，避免模型学习到仪器漂移或采集噪声。",
    tag: "信号处理",
  },
];

const knowledgeContext = `
你是 NV 色心量子传感项目组的百科助手。回答要面向实验室成员，强调可执行步骤、排查顺序和注意事项。

项目组知识库包括：
- NV 色心基础：ODMR、零场劈裂、Rabi、Ramsey、Echo、T2*、T2、矢量磁测量、温度漂移。
- 实验 SOP：开机检查、仪器连接、宽频预扫、精扫拟合、参数快照、结果保存。
- 仪器通信：Serial、SCPI、VISA 地址、波特率、终止符、*IDN? 查询、超时处理。
- 数据规范：日期_样品_实验类型_关键参数_版本号；保存原始数据、脚本、拟合结果、备注。
- 软件工程：Python、PyQt5、QThread、Serial / SCPI、ctypes、PyInstaller、SQLite、RAG、Embedding。
- AI Agent：Planning、Memory、Tools、Reflection、ReAct、Tool Calling、参数 schema、权限控制、日志追踪。
- RAG：文本切分、Embedding、向量检索、重排序、引用溯源、答案校验。
- 机器学习：PyTorch、Dataset、DataLoader、训练循环、特征工程、谱线分类、降噪、异常检测、模型评估。
- 安全：激光防护、微波功率上限、位移台防撞、长时间采集温漂记录。

如果问题涉及实验安全，先提醒安全检查。若信息不足，说明需要补充哪些参数。
`;

function tokenize(text) {
  const lower = String(text || "").toLowerCase();
  const latin = lower.match(/[a-z0-9][a-z0-9_\-./]{1,}/g) || [];
  const chinese = (lower.match(/[\u4e00-\u9fa5]+/g) || []).flatMap((part) => {
    if (part.length <= 2) return [part];
    const grams = [];
    for (let i = 0; i < part.length - 1; i += 1) {
      grams.push(part.slice(i, i + 2));
    }
    return grams;
  });
  return [...new Set([...latin, ...chinese])].filter((token) => token.length > 1);
}

function fnv1a(text) {
  let value = 2166136261;
  const bytes = new TextEncoder().encode(text);
  for (const byte of bytes) {
    value ^= byte;
    value = Math.imul(value, 16777619) >>> 0;
  }
  return value >>> 0;
}

function embedText(text, dim = Number(ragRetrieval.embeddingDim || 384)) {
  const counts = new Map();
  for (const token of tokenize(text)) {
    counts.set(token, (counts.get(token) || 0) + 1);
  }
  const vector = new Map();
  for (const [token, count] of counts.entries()) {
    const hashed = fnv1a(token);
    const index = hashed % dim;
    const sign = (hashed >>> 31) === 0 ? 1 : -1;
    vector.set(index, (vector.get(index) || 0) + sign * (1 + Math.log(count)));
  }
  const norm = Math.sqrt([...vector.values()].reduce((sum, value) => sum + value * value, 0));
  if (!norm) return {};
  return Object.fromEntries([...vector.entries()].map(([index, value]) => [String(index), value / norm]));
}

function dotProduct(left, right) {
  if (!left || !right) return 0;
  let score = 0;
  for (const [index, value] of Object.entries(left)) {
    score += Number(value) * Number(right[index] || 0);
  }
  return score;
}

function keywordScore(text, tokens) {
  const haystack = String(text || "").toLowerCase();
  let score = 0;
  for (const token of tokens) {
    if (haystack.includes(token)) {
      score += token.length > 4 ? 3 : 1;
    }
  }
  return score;
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function snippetAroundTokens(text, tokens, radius = 110) {
  const source = String(text || "");
  const lower = source.toLowerCase();
  const firstIndex = tokens.map((token) => lower.indexOf(token)).filter((index) => index >= 0).sort((a, b) => a - b)[0] ?? 0;
  const start = Math.max(0, firstIndex - radius);
  const end = Math.min(source.length, firstIndex + radius * 2);
  return `${start > 0 ? "..." : ""}${source.slice(start, end)}${end < source.length ? "..." : ""}`;
}

function highlightSnippet(text, tokens) {
  let html = escapeHtml(text);
  const highlightTokens = tokens
    .filter((token) => token.length > 2)
    .sort((a, b) => b.length - a.length)
    .slice(0, 12);

  for (const token of highlightTokens) {
    const safeToken = escapeHtml(token);
    html = html.replace(new RegExp(escapeRegExp(safeToken), "gi"), (match) => `<mark>${match}</mark>`);
  }
  return html;
}

function chunkText(text, chunkSize = 850, overlap = 120) {
  const normalized = String(text || "").replace(/\s+/g, " ").trim();
  if (!normalized) return [];

  const chunks = [];
  let start = 0;
  while (start < normalized.length) {
    const end = Math.min(normalized.length, start + chunkSize);
    const chunk = normalized.slice(start, end).trim();
    if (chunk) chunks.push(chunk);
    if (end >= normalized.length) break;
    start = Math.max(0, end - overlap);
  }
  return chunks;
}

async function extractDocumentText(uploadedFile) {
  const type = documentTypeFrom(uploadedFile.filename, uploadedFile.mimeType);
  if (type === "PDF") {
    const module = await import("pdf-parse");
    const pdfParse = module.default || module;
    const result = await pdfParse(uploadedFile.content);
    return result.text || "";
  }
  if (["Markdown", "TXT"].includes(type)) {
    return uploadedFile.content.toString("utf-8");
  }
  throw new Error(`Unsupported document type: ${type}`);
}

async function indexUploadedDocument(uploadedFile, documentId) {
  const text = await extractDocumentText(uploadedFile);
  const chunks = chunkText(text);
  if (!chunks.length) {
    throw new Error("No extractable text found in document");
  }

  const newChunks = chunks.map((chunk, index) => ({
    id: `upload-${documentId}-c${index + 1}`,
    source: uploadedFile.filename,
    path: `uploaded://${uploadedFile.filename}`,
    page: null,
    chunk: index + 1,
    text: chunk,
    embedding: embedText(`${uploadedFile.filename} ${chunk}`),
  }));

  ragChunks.push(...newChunks);
  ragIndexName = ragIndexName === "none" ? "uploaded" : ragIndexName;
  ragRetrieval = {
    ...ragRetrieval,
    embeddingModel: "local-hash-tfidf-v1",
    vectorSearch: "cosine",
    rerank: "hybrid-vector-keyword-title-v1",
  };
  return newChunks.length;
}

function searchRag(question, topK = 5) {
  if (!ragChunks.length) return [];
  const queryTokens = tokenize(question);
  if (!queryTokens.length) return [];
  const queryEmbedding = embedText(question);

  const candidates = ragChunks
    .map((chunk) => {
      const haystack = `${chunk.source} ${chunk.text}`.toLowerCase();
      const vectorScore = dotProduct(queryEmbedding, chunk.embedding);
      const lexicalScore = keywordScore(haystack, queryTokens);
      const titleScore = keywordScore(chunk.source, queryTokens);
      return { ...chunk, vectorScore, lexicalScore, titleScore };
    })
    .filter((chunk) => chunk.vectorScore > 0 || chunk.lexicalScore > 0)
    .sort((a, b) => b.vectorScore - a.vectorScore)
    .slice(0, 60);

  const maxLexical = Math.max(1, ...candidates.map((chunk) => chunk.lexicalScore));
  return candidates
    .map((chunk) => {
      const score = chunk.vectorScore * 0.72 + (chunk.lexicalScore / maxLexical) * 0.2 + Math.min(chunk.titleScore, 3) * 0.03;
      const snippet = snippetAroundTokens(chunk.text, queryTokens);
      return {
        ...chunk,
        score,
        snippet,
        highlightedSource: highlightSnippet(snippet, queryTokens),
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

function ragReferences(matches) {
  return matches.map((match) => ({
    title: `${match.source}${match.page ? ` / p.${match.page}` : ""}`,
    source: match.snippet || String(match.text || "").slice(0, 220),
    highlightedSource: match.highlightedSource,
    score: Number(match.score || 0).toFixed(3),
    retrieval: `embedding ${Number(match.vectorScore || 0).toFixed(3)} / rerank ${Number(match.score || 0).toFixed(3)}`,
    tag: "本地 RAG",
  }));
}

function buildMessages(question, matches) {
  const ragContext = matches.length
    ? matches
        .map((match, index) => `[${index + 1}] ${match.source}${match.page ? ` p.${match.page}` : ""}\n${match.text}`)
        .join("\n\n")
    : "当前没有命中本地论文 RAG 索引，请优先基于项目组百科和通用知识回答，并说明可能需要补充文献。";

  return [
    { role: "system", content: knowledgeContext },
    {
      role: "system",
      content: `以下是本地论文/百科 RAG 检索片段。回答时优先使用这些片段，并在结尾简要列出引用来源。\n\n${ragContext}`,
    },
    { role: "user", content: question },
  ];
}

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

function sendJson(res, payload, status = 200) {
  setCors(res);
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
  });
}

function readBuffer(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => {
      chunks.push(Buffer.from(chunk));
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

async function readUploadedFile(req) {
  const contentType = req.headers["content-type"] || "";
  const boundary = String(contentType).match(/boundary=(?:"([^"]+)"|([^;]+))/)?.[1] || String(contentType).match(/boundary=(?:"([^"]+)"|([^;]+))/)?.[2];
  if (!boundary) {
    throw new Error("Missing multipart boundary");
  }

  const body = await readBuffer(req);
  const text = body.toString("latin1");
  const headerEnd = text.indexOf("\r\n\r\n");
  if (headerEnd < 0) {
    throw new Error("Invalid multipart payload");
  }

  const header = text.slice(0, headerEnd);
  const filenameRaw = header.match(/filename="([^"]*)"/)?.[1] || "uploaded-document";
  const filename = Buffer.from(filenameRaw, "latin1").toString("utf8") || filenameRaw;
  const mimeType = header.match(/Content-Type:\s*([^\r\n]+)/i)?.[1]?.trim() || "application/octet-stream";
  const contentStart = headerEnd + 4;
  const boundaryMarker = `\r\n--${boundary}`;
  const contentEnd = text.indexOf(boundaryMarker, contentStart);
  const finalContentEnd = contentEnd > contentStart ? contentEnd : text.length;
  const size = Math.max(0, finalContentEnd - contentStart);
  const content = body.subarray(contentStart, finalContentEnd);

  return { filename, mimeType, size, content };
}

function formatFileSize(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function documentTypeFrom(filename, mimeType) {
  const ext = String(filename).split(".").pop()?.toLowerCase() || "";
  if (ext === "pdf" || mimeType.includes("pdf")) return "PDF";
  if (["md", "markdown"].includes(ext)) return "Markdown";
  if (ext === "txt") return "TXT";
  if (["doc", "docx"].includes(ext)) return "Word";
  if (["ppt", "pptx"].includes(ext)) return "PPTX";
  return ext ? ext.toUpperCase() : "FILE";
}

function fallbackAnswer(question) {
  if (/ODMR|无峰|信噪比|调参/i.test(question)) {
    return `ODMR 无峰建议按顺序排查：1. 频率范围是否覆盖 2.87 GHz 附近及偏置场引起的偏移；2. 微波输出、开关和天线连接是否正常；3. 激光对焦、相机曝光和荧光强度是否稳定；4. 平均次数、积分时间和拟合窗口是否合理；5. 保存参数快照，便于复现实验。`;
  }
  if (/数据|命名|归档|复现/i.test(question)) {
    return `建议使用 日期_样品_实验类型_关键参数_版本号 命名，例如 20260524_SampleA_ODMR_2p82-2p92GHz_Pmw-10dBm_v01，并同步保存原始数据、处理脚本、拟合结果、参数快照和异常备注。`;
  }
  if (/Agent|智能体|ReAct|Tool|工具调用|RAG|Embedding|向量/i.test(question)) {
    return `AI Agent 建议采用 Planning -> Tool Calling -> Observation -> Verification -> Response 的闭环。RAG 部分需要做好文本切分、Embedding、召回、重排序和引用溯源；工具调用部分要做参数 schema、权限控制、错误恢复和执行日志。`;
  }
  if (/机器学习|PyTorch|谱线|降噪|拟合|训练|模型|评估/i.test(question)) {
    return `实验谱线的机器学习流程建议为：定义任务、整理数据集、预处理、建模、评估和部署。分类任务看准确率/召回率/F1，回归任务看 MAE/RMSE/R2，异常检测要关注误报和漏报，并保留原始数据与模型版本。`;
  }
  if (/新人|上手|入门|学习/i.test(question)) {
    return `新人建议按“术语表 -> ODMR SOP -> 仪器连接表 -> 上位机操作 -> 数据归档 -> 常见故障排查 -> 专题文献”的顺序学习。第一目标是独立完成一次 ODMR 扫描并保存完整记录。`;
  }
  return `这是组内百科代理的本地兜底回答。建议把问题补充为具体实验、设备、参数或报错现象，我可以按 SOP、故障排查、数据规范或软件部署几个方向继续整理。`;
}

async function callChatCompletions(question, stream) {
  const ragMatches = searchRag(question);
  if (!apiKey) {
    return { fallback: fallbackAnswer(question), ragMatches };
  }

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      stream,
      temperature: 0.3,
      messages: buildMessages(question, ragMatches),
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`LLM API ${response.status}: ${text.slice(0, 500)}`);
  }

  return { response, ragMatches };
}

async function handleAsk(req, res) {
  const payload = await readJson(req);
  const question = String(payload.question || "");
  const result = await callChatCompletions(question, false);
  const mergedReferences = result.ragMatches?.length ? ragReferences(result.ragMatches) : references;
  if (result.fallback) {
    sendJson(res, { answer: result.fallback, references: mergedReferences });
    return;
  }

  const data = await result.response.json();
  sendJson(res, {
    answer: data.choices?.[0]?.message?.content || fallbackAnswer(question),
    references: mergedReferences,
  });
}

async function handleStream(url, res) {
  const question = url.searchParams.get("question") || "";
  setCors(res);
  res.writeHead(200, {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
  });

  try {
    const result = await callChatCompletions(question, true);
    if (result.fallback) {
      for (let i = 0; i < result.fallback.length; i += 3) {
        res.write(`data: ${JSON.stringify({ delta: result.fallback.slice(i, i + 3) })}\n\n`);
        await new Promise((resolve) => setTimeout(resolve, 18));
      }
      res.write("data: [DONE]\n\n");
      res.end();
      return;
    }

    const reader = result.response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;
        const data = trimmed.slice(5).trim();
        if (data === "[DONE]") {
          res.write("data: [DONE]\n\n");
          res.end();
          return;
        }
        try {
          const parsed = JSON.parse(data);
          const delta = parsed.choices?.[0]?.delta?.content || "";
          if (delta) {
            res.write(`data: ${JSON.stringify({ delta })}\n\n`);
          }
        } catch {
          // Ignore provider keep-alive frames.
        }
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    const message = error instanceof Error ? error.message : "LLM stream error";
    const safeMessage = `大模型流式接口调用失败：${message}`;
    res.write(`data: ${JSON.stringify({ delta: safeMessage })}\n\n`);
    res.write("data: [DONE]\n\n");
    res.end();
  }
}

const server = http.createServer(async (req, res) => {
  setCors(res);
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  try {
    const url = new URL(req.url || "/", `http://${req.headers.host}`);
    if (url.pathname === "/api/health") {
      sendJson(res, { ok: true, model, baseUrl, hasApiKey: Boolean(apiKey) });
      return;
    }
    if (url.pathname === "/api/rag/status") {
      const sourceNames = [...new Set(ragChunks.map((chunk) => chunk.source).filter(Boolean))];
      sendJson(res, {
        enabled: ragChunks.length > 0,
        index: ragIndexName,
        chunkCount: ragChunks.length,
        sourceCount: sourceNames.length,
        sources: sourceNames.slice(0, 12),
        retrieval: ragRetrieval,
        uploadedDocumentCount: uploadedDocuments.size,
        uploadedChunkCount: ragChunks.filter((chunk) => String(chunk.path || "").startsWith("uploaded://")).length,
        persistentStore: uploadedRagPath,
      });
      return;
    }
    if (url.pathname === "/api/auth/login" && req.method === "POST") {
      const payload = await readJson(req);
      sendJson(res, { token: `local-token-${Date.now()}`, username: payload.account || "lab-user" });
      return;
    }
    if (url.pathname === "/api/libraries") {
      sendJson(res, libraries);
      return;
    }
    if (/^\/api\/libraries\/[^/]+\/documents$/.test(url.pathname) && req.method === "POST") {
      const libraryId = decodeURIComponent(url.pathname.split("/")[3] || "");
      const library = libraries.find((item) => item.id === libraryId) || libraries[0];
      const uploadedFile = await readUploadedFile(req);
      const documentId = Date.now();
      const document = {
        id: documentId,
        libraryId,
        name: uploadedFile.filename,
        type: documentTypeFrom(uploadedFile.filename, uploadedFile.mimeType),
        size: formatFileSize(uploadedFile.size),
        status: "解析中",
        chunks: 0,
      };
      document.status = "解析中";
      try {
        document.chunks = await indexUploadedDocument(uploadedFile, documentId);
        document.status = "已解析";
      } catch (error) {
        document.status = "解析失败";
        document.error = error instanceof Error ? error.message : "Parse failed";
      }
      uploadedDocuments.set(String(documentId), document);
      saveUploadedRagStore();
      library.docs.unshift(document);
      sendJson(res, document);
      return;
    }
    if (/^\/api\/libraries\/[^/]+\/documents\/\d+\/parse$/.test(url.pathname) && req.method === "POST") {
      sendJson(res, { status: "已解析", chunks: Math.round(40 + Math.random() * 120) });
      return;
    }
    if (url.pathname === "/api/chat/ask" && req.method === "POST") {
      await handleAsk(req, res);
      return;
    }
    if (url.pathname === "/api/chat/stream") {
      await handleStream(url, res);
      return;
    }

    sendJson(res, { message: "Not found" }, 404);
  } catch (error) {
    if (res.headersSent) {
      res.end();
      return;
    }
    sendJson(res, { message: error instanceof Error ? error.message : "Server error" }, 500);
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`LLM proxy listening on http://127.0.0.1:${port}/api`);
  console.log(`Model: ${model}`);
  console.log(apiKey ? "LLM API key loaded" : "LLM_API_KEY is empty, using local fallback answers");
});

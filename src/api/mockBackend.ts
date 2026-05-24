import { initialLibraries, references } from "../mockData";
import type { AskPayload, AskResult, DocumentItem, KnowledgeLibrary, LoginPayload, LoginResult } from "../types";

function wait(ms = 420) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function cloneLibraries(): KnowledgeLibrary[] {
  return initialLibraries.map((library) => ({
    ...library,
    docs: library.docs.map((doc) => ({ ...doc })),
  }));
}

export function createMockAnswer(question: string, libraryName: string) {
  if (/新人|入门|上手|学习路线|培训|百科|术语/i.test(question)) {
    return `可以把「${libraryName}」作为项目组新人入口，建议按下面顺序学习：
1. 先读 NV 色心术语表，弄清 ODMR、零场劈裂、Rabi、Ramsey、Echo、T2*、T2 等概念。
2. 跟着 ODMR SOP 完成一次从开机、连仪器、扫频到保存数据的完整流程。
3. 学会查看仪器连接表和上位机工具调用清单，知道每个按钮或工具函数对应哪台设备。
4. 按数据归档规范保存实验参数、原始数据、拟合结果和备注。
5. 最后再按专题阅读宽场成像、灵敏度优化、光纤集成或 Rydberg 对比文献。`;
  }

  if (/无峰|ODMR|信噪比|调参/.test(question)) {
    return `根据「${libraryName}」的检索结果，建议按优先级排查：
1. 确认微波频率范围覆盖共振点，并检查功率是否过低或过高。
2. 检查激光对焦、相机曝光、采集积分时间和平均次数。
3. 核对 TTL 触发、微波开关、位移台位置和磁场方向。
4. 若仍无明显谱线，可先用宽范围低分辨率扫描，再缩小窗口进行拟合。`;
  }

  if (/RAG|引用|溯源|幻觉/.test(question)) {
    return `RAG 可以拆成“文档解析 -> 文本切分 -> Embedding -> 向量检索 -> 重排序 -> 上下文拼接 -> 大模型生成 -> 引用溯源”。
项目组百科场景里，重点不是让模型背答案，而是让它能回到 SOP、文献、实验记录和故障手册中的证据片段。优化方向包括：合理 chunk 大小、召回数量、重排序策略、引用展示和答案校验。`;
  }

  if (/Agent|智能体|ReAct|Planning|Memory|Reflection|工具调用|Tool Calling/i.test(question)) {
    return `实验室 AI Agent 建议采用“计划 -> 工具调用 -> 观察 -> 校验 -> 回复”的闭环：
1. Planner 负责拆解任务，例如检索文献、读取 SOP、设置参数、分析数据。
2. Tool Calling 层统一注册工具名称、参数 schema、权限等级和错误处理。
3. Observation 把工具执行结果转成模型可理解的结构化信息。
4. Verifier 检查答案是否有引用、参数是否越界、是否需要人工确认。
5. 对仪器写入类动作，例如微波输出、位移台移动、电流源设置，应强制人工确认和日志记录。`;
  }

  if (/Embedding|向量|检索|相似度|重排序|rerank/i.test(question)) {
    return `Embedding 检索的关键是让“问题”和“知识片段”落到同一个语义空间。组内知识库可以这样做：
1. SOP、故障手册适合按步骤或小节切分。
2. 论文适合按摘要、方法、实验结果和结论切分。
3. 实验记录适合保留样品、参数、现象、结论等结构字段。
4. 召回后可用关键词、时间、文档类型和重排序模型二次筛选。
5. 前端必须展示引用来源，否则答案难以用于科研复核。`;
  }

  if (/SOP|流程|开机|寻峰|扫频|checklist/i.test(question)) {
    return `组内 ODMR SOP 可以拆成 7 步：
1. 检查激光、相机、微波源、位移台和电流源连接状态。
2. 打开上位机并确认 Serial / SCPI 通信正常。
3. 设置样品编号、保存目录和实验备注，避免后续数据不可追溯。
4. 用宽频低分辨率参数做预扫，确认是否存在共振区域。
5. 缩小频率窗口，提高平均次数或积分时间做精扫。
6. 进行自动寻峰、拟合和结果摘要生成。
7. 保存原始数据、拟合图、参数快照和异常记录。`;
  }

  if (/SCPI|串口|Serial|VISA|通信|设备|连接|地址/i.test(question)) {
    return `仪器通信排查建议按“物理连接 -> 地址 -> 协议 -> 命令 -> 超时”顺序检查：
1. 确认 USB/串口/网口连接稳定，设备管理器中端口未变化。
2. 核对串口号、VISA 地址、波特率、终止符和超时时间。
3. 先用 *IDN? 或简单查询命令验证设备响应。
4. 上位机中把设备初始化、参数写入、状态查询和错误处理分层封装。
5. 每次实验记录实际设备地址，避免换电脑后连接失败。`;
  }

  if (/宽场|成像|扫描|显微|microscopy|imaging/i.test(question)) {
    return `「${libraryName}」中和宽场/扫描成像相关的资料主要覆盖三类问题：
1. 光学系统与相机限制，例如视场、曝光、读出噪声和荧光收集效率。
2. 微波场或磁场反演，例如线圈近场分布、矢量分量解算和空间分辨率。
3. 应用场景，例如超导涡旋、磁性薄膜、电流分布和生物磁信号成像。`;
  }

  if (/光纤|集成|便携|portable|fiber|integrated/i.test(question)) {
    return `检索到的光纤/集成 NV 方案可以从工程角度总结为：光路封装、探头小型化、微波结构集成、温漂控制和现场部署能力。简历项目里可以把这些内容转化为“系统集成、仪器控制、数据采集和可视化界面”的工程亮点。`;
  }

  if (/温度|漂移|补偿|temperature|thermal/i.test(question)) {
    return `NV 中心的零场劈裂对温度敏感，温漂会影响磁场解算精度。实际系统通常需要记录温度、建立补偿模型，或利用双参量测量同时估计磁场与温度。`;
  }

  if (/灵敏度|优化|噪声|线宽|对比度|sensitivity|noise|linewidth/i.test(question)) {
    return `NV 磁力计灵敏度可以按“信号、噪声、线宽、对比度、相干时间”来拆解：
1. 提升荧光收集效率和 ODMR 对比度，增加有效信号强度。
2. 控制微波功率和激光功率，避免功率展宽导致谱线变宽。
3. 优化平均次数、积分时间和拟合窗口，平衡时间分辨率与信噪比。
4. 对温度漂移、背景磁场噪声和机械振动做补偿，提升长期稳定性。`;
  }

  if (/机器学习|深度学习|PyTorch|训练|模型|Dataset|DataLoader|神经网络/i.test(question)) {
    return `实验数据上的机器学习流程可以按 6 步整理：
1. 明确任务：分类、回归、异常检测、降噪或参数估计。
2. 构建数据集：保存原始谱线、标签、采集参数和样品信息。
3. 预处理：基线扣除、归一化、平滑滤波、峰值检测和异常点剔除。
4. 建模：传统特征 + 机器学习适合小数据，CNN/MLP/AutoEncoder 适合较多谱线。
5. 评估：分类看准确率、召回率、F1；回归看 RMSE、MAE、R2；科研场景还要看可解释性。
6. 部署：导出模型、记录版本、固定输入格式，并在上位机里做异常兜底。`;
  }

  if (/谱线|峰值|拟合|降噪|滤波|异常检测|AutoEncoder|CNN/i.test(question)) {
    return `ODMR 谱线处理建议采用“预处理 + 物理先验 + 模型辅助”的方案：
1. 先做暗场/背景扣除、归一化和平滑滤波。
2. 使用峰值检测或 Lorentzian 拟合得到初始参数。
3. 对无峰、双峰、低信噪比、漂移等情况建立异常标签。
4. 小样本阶段优先用规则和特征工程，大样本后再训练 CNN 或 AutoEncoder。
5. 模型输出要保留置信度和失败原因，不能直接覆盖原始实验数据。`;
  }

  if (/评估|准确率|召回率|F1|RMSE|R2|混淆矩阵|指标/i.test(question)) {
    return `模型评估要和任务类型对应：
1. 谱线分类：准确率、召回率、F1、混淆矩阵。
2. 峰位/线宽回归：MAE、RMSE、R2，以及物理量误差范围。
3. 异常检测：误报率、漏报率、人工复核通过率。
4. RAG 问答：召回命中率、引用覆盖率、答案可验证性和人工评分。
5. 上位机部署：还要看推理延迟、失败兜底和跨样品稳定性。`;
  }

  if (/相机|曝光|读出|camera|exposure/i.test(question)) {
    return `宽场 NV 成像中，相机通常限制帧率、动态范围和弱信号读出能力。可以从曝光时间、ROI 裁剪、binning、背景扣除、暗场校正和荧光收集效率几个方面优化成像质量。`;
  }

  if (/数据|命名|归档|复现|记录|保存|导出/i.test(question)) {
    return `组内数据归档建议采用固定字段命名：日期_样品_实验类型_关键参数_版本号。
示例：20260524_SampleA_ODMR_2p82-2p92GHz_Pmw-10dBm_v01。
每次实验至少保存：原始数据、处理脚本、拟合结果、参数快照、操作者、样品状态、异常备注和最终图表。这样后续写论文、复现实验和排查问题都会轻很多。`;
  }

  if (/打包|部署|PyInstaller|ctypes|DLL|发布|安装/i.test(question)) {
    return `上位机部署建议按清单检查：
1. 使用 PyInstaller 前先确认 Python 环境、依赖版本和入口脚本。
2. 把 ctypes 调用的 DLL、配置文件、模型文件、知识库索引和图标资源加入打包目录。
3. 在无开发环境的电脑上测试启动、仪器连接、数据保存和异常提示。
4. 发布包中保留版本号、更新日志和默认配置模板。
5. 遇到路径问题时优先检查相对路径、工作目录和资源解包位置。`;
  }

  if (/安全|激光|微波|位移台|功率|保护/i.test(question)) {
    return `实验安全 checklist：
1. 激光开启前确认光路封闭、防护眼镜和功率限制。
2. 微波输出前确认线缆、负载、天线和功率上限，避免空载或过功率。
3. 位移台移动前确认样品、物镜和探头不会碰撞。
4. 长时间采集时记录温度、漂移和设备状态。
5. 任何异常先暂停输出，再保存日志并记录复现条件。`;
  }

  if (/Rydberg|里德堡|原子|atomic|atom/i.test(question)) {
    return `Rydberg/原子传感资料更适合做横向对比：NV 色心强调固态、近场、高空间分辨率和室温集成；Rydberg 原子强调宽带射频/微波电场测量、可溯源性和频谱分析能力。`;
  }

  return `已在「${libraryName}」中完成检索。当前问题可以先从相关文档片段中提取关键结论，再结合历史会话进行归纳。若接入真实后端，这里会通过 SSE 返回大模型流式内容。`;
}

export const mockBackend = {
  async login(payload: LoginPayload): Promise<LoginResult> {
    await wait();
    return {
      token: `mock-token-${payload.account}-${Date.now()}`,
      username: payload.account,
    };
  },

  async getLibraries(): Promise<KnowledgeLibrary[]> {
    await wait(260);
    return cloneLibraries();
  },

  async uploadDocument(_libraryId: string, file: File): Promise<DocumentItem> {
    await wait(520);
    return {
      id: Date.now() + Math.round(Math.random() * 1000),
      name: file.name,
      type: file.name.split(".").pop()?.toUpperCase() ?? "FILE",
      size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
      status: "解析中",
      chunks: 0,
    };
  },

  async parseDocument(): Promise<{ status: DocumentItem["status"]; chunks: number }> {
    await wait(700);
    return {
      status: "已解析",
      chunks: Math.round(40 + Math.random() * 120),
    };
  },

  async ask(payload: AskPayload, libraryName: string): Promise<AskResult> {
    await wait(360);
    return {
      answer: createMockAnswer(payload.question, libraryName),
      references,
    };
  },
};

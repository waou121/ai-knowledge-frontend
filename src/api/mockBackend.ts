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
  if (/指南针|地磁|罗盘|航向|手机|compass|heading/i.test(question)) {
    return `可以把 NV 量子指南针讲成“用钻石里的量子自旋做磁场罗盘”：
1. 手机指南针通常用经典磁阻/霍尔/磁传感芯片，直接测地磁场的水平分量。
2. NV 指南针用绿光读出钻石 NV 色心的自旋状态，微波扫到共振时荧光会变化。
3. 地磁场会让 ODMR 共振峰发生塞曼劈裂，不同 NV 轴上的峰移动量不同。
4. 软件从多个峰位反推出 Bx、By、Bz，再取水平分量画成指南针。
5. 和手机对齐时要做一次“偏置角”标定，因为钻石探头坐标和手机坐标不一定同向。

演示话术可以说：手机看到的是电子芯片里的磁场，NV 看到的是钻石量子能级被地磁场轻轻拨开的频率变化。`;
  }

  if (/八峰|8峰|四峰|4峰|三峰|3峰|少峰|低频4|高频4|矢量反演|vector/i.test(question)) {
    return `少峰矢量反演可以这样解释：
1. 完整八峰来自 4 个 NV 轴向，每个轴向有低频和高频两条跃迁。
2. 八峰最稳，可以同时帮助判断峰归属、D/E、温漂和磁场方向，但扫描时间更长。
3. 如果 D 和 E 已经通过校准固定，未知量主要是 Bx、By、Bz 三个分量。
4. 低频4峰或高频4峰通常足够解三维磁场，且比八峰快。
5. 三峰在数学上也可能解出来，但对噪声、峰误判和室内磁干扰更敏感，适合作为快速演示模式。

推荐演示路线：先用宽扫或八峰锁定一次，再切到低频4峰/高频4峰快速更新指南针；如果追求速度，再尝试三峰。`;
  }

  if (/D\/E|DE|零场分裂|应力|strain|参数已知|2870/i.test(question)) {
    return `D/E 可以用很通俗的话解释：
1. D 是 NV 色心的零场分裂，室温附近大约是 2870 MHz，相当于 ODMR 谱线的中心参考。
2. D 会随温度变化，所以温漂会影响磁场解算。
3. E 反映晶体应力、电场或局部环境带来的横向劈裂，可以理解为钻石里轻微“不完美”造成的谱线偏移。
4. 如果 D/E 已知并固定，峰位变化就主要来自外部磁场，少峰反演会更快。
5. 如果 D/E 不稳定，仍建议用八峰或温度补偿来提高可靠性。`;
  }

  if (/平均次数|速度|快一点|延迟|实时|精度|噪声|averag/i.test(question)) {
    return `速度和精度的取舍可以这样讲：
1. 平均次数越大，噪声越小，峰位拟合更稳，但一次读数更慢。
2. 平均次数越小，指南针刷新更快，但峰位会抖动，方向也可能跳。
3. 演示地磁方向时可以先降低平均次数，例如从 500 或 1000 起步试。
4. 如果方向抖动明显，就提高平均次数，或从三峰模式切回四峰模式。
5. 如果峰经常丢失，说明速度压得太狠，需要扩大扫描窗口、降低 prominence 门限或增加平均次数。`;
  }

  if (/跳变|对不上|不准|校准|偏置|干扰|金属|电流|线圈|磁铁/i.test(question)) {
    return `NV 指南针和手机对不上时，可以按这个顺序排查：
1. 先确认手机和探头是否真的同方向放置，很多偏差来自机械摆放。
2. 做偏置角校准：偏置角 = 手机指南针角度 - NV 原始角度。
3. 远离铁桌、螺丝刀、磁铁、马达、电流线、音箱和电源适配器。
4. 检查扫描范围是否覆盖目标峰，少峰模式下峰归属错了会导致方向跳变。
5. 三峰不稳时切回低频4峰或高频4峰；四峰仍不稳时重新做一次八峰锁定。`;
  }

  if (/讲解|科普|展示|演示|观众|汇报|答辩/i.test(question)) {
    return `可以用一段 30 秒科普话术：
“这套装置用钻石里的 NV 色心做量子传感。我们用绿光把自旋初始化并读出，用微波扫描它的共振频率。当地磁场存在时，量子能级会发生很小的塞曼劈裂，所以 ODMR 谱线会移动。软件从几条谱线反推出磁场矢量，再把水平分量画成指南针。它和手机指南针测的是同一个地磁场，只是一个用经典芯片，一个用钻石量子能级。”

如果要讲技术亮点，可以补一句：为了让读数更快，系统支持固定 D/E 后用四峰甚至三峰近似反演，牺牲一点精度换取更快刷新。`;
  }

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

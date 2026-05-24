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
  if (/无峰|ODMR|信噪比|调参/.test(question)) {
    return `根据「${libraryName}」的检索结果，建议按优先级排查：
1. 确认微波频率范围覆盖共振点，并检查功率是否过低或过高。
2. 检查激光对焦、相机曝光、采集积分时间和平均次数。
3. 核对 TTL 触发、微波开关、位移台位置和磁场方向。
4. 若仍无明显谱线，可先用宽范围低分辨率扫描，再缩小窗口进行拟合。`;
  }

  if (/RAG|引用|溯源|幻觉/.test(question)) {
    return "可以把回答链路拆成检索、排序、生成和校验四步。前端侧重点是展示引用来源、片段位置和回答置信信息，让用户能从答案快速回到原文证据。";
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

  if (/相机|曝光|读出|camera|exposure/i.test(question)) {
    return `宽场 NV 成像中，相机通常限制帧率、动态范围和弱信号读出能力。可以从曝光时间、ROI 裁剪、binning、背景扣除、暗场校正和荧光收集效率几个方面优化成像质量。`;
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

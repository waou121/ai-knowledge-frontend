import type { CategoryDatum, Conversation, KnowledgeLibrary, MetricItem, ReferenceItem } from "./types";

export const initialLibraries: KnowledgeLibrary[] = [
  {
    id: "nv",
    name: "NV 色心量子传感文献库",
    docs: [
      { id: 1, name: "The nitrogen-vacancy colour centre in diamond.pdf", type: "PDF", size: "1.8 MB", status: "已解析", chunks: 164 },
      { id: 2, name: "Theory of the ground-state spin of the NV− center in diamond.pdf", type: "PDF", size: "2.1 MB", status: "已解析", chunks: 188 },
      { id: 3, name: "13C hyperfine interactions in the nitrogen-vacancy centre in diamond.pdf", type: "PDF", size: "1.2 MB", status: "已解析", chunks: 96 },
      { id: 4, name: "Coherence of nitrogen-vacancy electronic spin ensembles in diamond.pdf", type: "PDF", size: "2.6 MB", status: "已解析", chunks: 203 },
      { id: 5, name: "Ultralong spin coherence time in isotopically engineered diamond.pdf", type: "PDF", size: "1.5 MB", status: "已解析", chunks: 126 },
      { id: 6, name: "Avoiding power broadening in optically detected magnetic resonance of single NV defects.pdf", type: "PDF", size: "1.4 MB", status: "已解析", chunks: 118 },
      { id: 7, name: "Bias-Field-Free Operation of Nitrogen-Vacancy Ensembles in Diamond for Accurate Vector Magnetometry.pdf", type: "PDF", size: "3.4 MB", status: "已解析", chunks: 246 },
      { id: 8, name: "Vector magnetic field sensing by a single nitrogen vacancy center in diamond.pdf", type: "PDF", size: "2.2 MB", status: "已解析", chunks: 176 },
      { id: 9, name: "Wide-field magnetometry using nitrogen-vacancy color centers with randomly oriented micro-diamonds.pdf", type: "PDF", size: "3.0 MB", status: "已解析", chunks: 232 },
      { id: 10, name: "Wide-field Optical Microscopy of Microwave Fields Using Nitrogen-Vacancy Centers in diamond.pdf", type: "PDF", size: "2.8 MB", status: "已解析", chunks: 221 },
      { id: 11, name: "A fiber based diamond RF B-field sensor and characterization of a small helical antenna.pdf", type: "PDF", size: "2.5 MB", status: "已解析", chunks: 205 },
      { id: 12, name: "A fully-portable and highly-sensitive all-fiber quantum magnetometer.pdf", type: "PDF", size: "3.6 MB", status: "已解析", chunks: 252 },
      { id: 13, name: "A highly integrated three-axis vector diamond quantum magnetometer with a compact electrical package.pdf", type: "PDF", size: "4.1 MB", status: "已解析", chunks: 286 },
      { id: 14, name: "Broadband magnetometry and temperature sensing with a light-trapping diamond waveguide.pdf", type: "PDF", size: "2.9 MB", status: "已解析", chunks: 218 },
      { id: 15, name: "Temperature Dependence of the Nitrogen-Vacancy Magnetic Resonance in Diamond.pdf", type: "PDF", size: "1.9 MB", status: "已解析", chunks: 143 },
      { id: 16, name: "A robust fiber-based quantum thermometer coupled with nitrogen-vacancy centers.pdf", type: "PDF", size: "2.0 MB", status: "已解析", chunks: 156 },
      { id: 17, name: "All-in-one quantum diamond microscope for sensor characterization.pdf", type: "PDF", size: "3.8 MB", status: "已解析", chunks: 271 },
      { id: 18, name: "All-optical magnetic imaging protocol to achieve angstrom-scale resolution.pdf", type: "PDF", size: "2.7 MB", status: "已解析", chunks: 214 },
      { id: 19, name: "A biocompatible technique for magnetic field sensing at (sub)cellular scale using Nitrogen-Vacancy centers.pdf", type: "PDF", size: "2.6 MB", status: "已解析", chunks: 198 },
      { id: 20, name: "Axon hillock currents enable single-neuron-resolved 3D reconstruction using diamond nitrogen-vacancy magnetometry.pdf", type: "PDF", size: "4.5 MB", status: "已解析", chunks: 302 },
      { id: 21, name: "2025全球量子传感产业发展展望.pdf", type: "PDF", size: "6.4 MB", status: "已解析", chunks: 346 },
      { id: 22, name: "基于金刚石NV色心的纳米尺度磁场测量和成像技术.pdf", type: "PDF", size: "3.2 MB", status: "已解析", chunks: 235 },
      { id: 23, name: "基于金刚石氮-空位色心的精密磁测量.pdf", type: "PDF", size: "2.7 MB", status: "已解析", chunks: 210 },
      { id: 24, name: "金刚石NV色心基础.pptx", type: "PPTX", size: "12.5 MB", status: "解析中", chunks: 88 },
      { id: 25, name: "Diamond magnetometry and gradiometry towards subpicotesla dc field measurement.pdf", type: "PDF", size: "3.7 MB", status: "已解析", chunks: 254 },
      { id: 26, name: "Zero- and Low-Field Sensing with Nitrogen-Vacancy Centers.pdf", type: "PDF", size: "2.0 MB", status: "已解析", chunks: 162 },
      { id: 27, name: "Vector-magnetic-field sensing via multifrequency control of nitrogen-vacancy centers in diamond.pdf", type: "PDF", size: "2.8 MB", status: "已解析", chunks: 207 },
      { id: 28, name: "Diamond-based single-molecule magnetic resonance spectroscopy.pdf", type: "PDF", size: "3.5 MB", status: "已解析", chunks: 258 },
      { id: 29, name: "Ambient nanoscale sensing with single spins using quantum decoherence.pdf", type: "PDF", size: "2.1 MB", status: "已解析", chunks: 174 },
      { id: 30, name: "金刚石NV色心磁力计极限灵敏度优化方法.pdf", type: "PDF", size: "2.9 MB", status: "已解析", chunks: 219 },
    ],
  },
  {
    id: "nv-system",
    name: "NV 实验系统与工程实现",
    docs: [
      { id: 101, name: "A modular python suite for experiment control and data processing.pdf", type: "PDF", size: "1.7 MB", status: "已解析", chunks: 132 },
      { id: 102, name: "An integrated and scalable experimental system for nitrogen-vacancy ensemble magnetometry.pdf", type: "PDF", size: "3.1 MB", status: "已解析", chunks: 224 },
      { id: 103, name: "Broadband loop gap resonator for nitrogen vacancy centers in diamond.pdf", type: "PDF", size: "2.3 MB", status: "已解析", chunks: 181 },
      { id: 104, name: "Ultra-broadband coplanar waveguide for optically detected magnetic resonance of nitrogen-vacancy centers in diamond.pdf", type: "PDF", size: "2.9 MB", status: "已解析", chunks: 211 },
      { id: 105, name: "Camera-limits for wide-field magnetic resonance imaging with a nitrogen-vacancy spin sensor.pdf", type: "PDF", size: "2.4 MB", status: "已解析", chunks: 174 },
      { id: 106, name: "Closed-Loop Diamond Quantum Sensor for Large Range and High Precision Current Measurement.pdf", type: "PDF", size: "3.3 MB", status: "已解析", chunks: 249 },
      { id: 107, name: "Diamond NV Centers Based Quantum Sensor Using a VCO Integrated With Filtering Antenna.pdf", type: "PDF", size: "2.6 MB", status: "已解析", chunks: 193 },
      { id: 108, name: "高频率分辨金刚石 NV 色心宽频谱成像系统.pdf", type: "PDF", size: "3.9 MB", status: "已解析", chunks: 268 },
      { id: 109, name: "Broadband, large-area microwave antenna for optically-detected magnetic resonance of nitrogen-vacancy centers in diamond.pdf", type: "PDF", size: "2.6 MB", status: "已解析", chunks: 204 },
      { id: 110, name: "An FPGA-based 7-ENOB 600 MSample_s ADC without any External Components.pdf", type: "PDF", size: "1.9 MB", status: "已解析", chunks: 142 },
      { id: 111, name: "Compressed sensing enabled high-bandwidth and large dynamic range magnetic sensing.pdf", type: "PDF", size: "3.0 MB", status: "已解析", chunks: 233 },
      { id: 112, name: "Direct control of high magnetic fields for cold atom experiments based on NV centers.pdf", type: "PDF", size: "2.3 MB", status: "已解析", chunks: 177 },
    ],
  },
  {
    id: "atomic",
    name: "原子/Rydberg 与射频传感对比库",
    docs: [
      { id: 201, name: "Assessment of Rydberg atoms for wideband electric field sensing.pdf", type: "PDF", size: "2.1 MB", status: "已解析", chunks: 169 },
      { id: 202, name: "Atom-based quantum sensing of electromagnetic fields.pdf", type: "PDF", size: "2.8 MB", status: "已解析", chunks: 216 },
      { id: 203, name: "Atomic superheterodyne receiver based on microwave-dressed Rydberg spectroscopy.pdf", type: "PDF", size: "2.2 MB", status: "已解析", chunks: 175 },
      { id: 204, name: "Waveguide-Coupled Rydberg Spectrum Analyzer from 0 to 20 GHz.pdf", type: "PDF", size: "2.5 MB", status: "已解析", chunks: 198 },
      { id: 205, name: "里德堡原子综述Rydberg atom quantum technologies综述.pdf", type: "PDF", size: "5.1 MB", status: "已解析", chunks: 315 },
      { id: 206, name: "An atomic receiver for AM and FM radio communication.pdf", type: "PDF", size: "1.8 MB", status: "已解析", chunks: 136 },
      { id: 207, name: "Continuous-frequency measurements of high-intensity microwave electric fields with atomic vapor cells.pdf", type: "PDF", size: "2.4 MB", status: "已解析", chunks: 184 },
      { id: 208, name: "Wide bandwidth instantaneous radio frequency spectrum analyzer based on nitrogen vacancy centers in diamond.pdf", type: "PDF", size: "2.7 MB", status: "已解析", chunks: 208 },
    ],
  },
  {
    id: "ai",
    name: "AI Agent 技术资料库",
    docs: [
      { id: 301, name: "Agentic RAG 设计笔记.md", type: "Markdown", size: "224 KB", status: "已解析", chunks: 69 },
      { id: 302, name: "Tool Calling 接口规范.pdf", type: "PDF", size: "1.2 MB", status: "已解析", chunks: 102 },
      { id: 303, name: "Artificial intelligence enhanced two-dimensional nanoscale nuclear magnetic resonance spectroscopy.pdf", type: "PDF", size: "3.0 MB", status: "已解析", chunks: 224 },
      { id: 304, name: "Untrained Physically Informed Neural Network for Image Reconstruction of Magnetic Field Sources.pdf", type: "PDF", size: "2.7 MB", status: "已解析", chunks: 205 },
      { id: 305, name: "Deep learning enhanced Rydberg multifrequency sensing.pdf", type: "PDF", size: "2.2 MB", status: "已解析", chunks: 166 },
      { id: 306, name: "Physics-informed magnetic field source reconstruction notes.md", type: "Markdown", size: "186 KB", status: "已解析", chunks: 58 },
      { id: 307, name: "AI Agent 文献问答系统接口设计.md", type: "Markdown", size: "142 KB", status: "已解析", chunks: 47 },
    ],
  },
];

export const initialConversations: Conversation[] = [
  {
    id: "c1",
    title: "ODMR 无峰排查",
    libraryId: "nv",
    updatedAt: "13:05",
    messages: [
      { role: "user", content: "ODMR 没有峰时应该优先检查哪些参数？" },
      {
        role: "assistant",
        content:
          "优先检查微波频率范围、微波功率、激光功率、采集积分时间和磁场方向。若荧光整体偏低，先确认光路和相机曝光；若信号噪声较大，再提高平均次数或调整拟合窗口。",
      },
    ],
  },
  {
    id: "c2",
    title: "宽场磁成像资料",
    libraryId: "nv",
    updatedAt: "昨天",
    messages: [
      { role: "user", content: "宽场 NV 磁成像相关文献应该重点看哪些？" },
      {
        role: "assistant",
        content:
          "可以优先看 wide-field magnetometry、microwave field imaging、camera-limits 和 quantum diamond microscope 相关文献，分别覆盖成像视场、微波场表征、相机限制和系统标定。",
      },
    ],
  },
  {
    id: "c3",
    title: "光纤集成方案",
    libraryId: "nv-system",
    updatedAt: "周一",
    messages: [
      { role: "user", content: "光纤集成 NV 磁力计适合写哪些工程亮点？" },
      {
        role: "assistant",
        content:
          "可以强调便携化、光路稳定性、探头小型化、RF 线圈集成和封装一致性，并与传统台式 ODMR 系统做对比。",
      },
    ],
  },
  {
    id: "c5",
    title: "灵敏度优化路线",
    libraryId: "nv",
    updatedAt: "周三",
    messages: [
      { role: "user", content: "NV 磁力计灵敏度优化可以从哪些方向整理？" },
      {
        role: "assistant",
        content:
          "可以按光学收集效率、ODMR 对比度、谱线线宽、NV 浓度、退相干时间、温度漂移补偿和读出噪声几个维度整理，并把每个维度对应到可调实验参数。",
      },
    ],
  },
  {
    id: "c6",
    title: "Rydberg 与 NV 对比",
    libraryId: "atomic",
    updatedAt: "周二",
    messages: [
      { role: "user", content: "Rydberg 原子传感和 NV 色心传感有什么应用差异？" },
      {
        role: "assistant",
        content:
          "Rydberg 原子更适合宽带射频/微波电场测量和频谱分析，NV 色心更适合固态近场、高空间分辨率、磁成像和可集成探头场景。",
      },
    ],
  },
  {
    id: "c4",
    title: "RAG 引用溯源",
    libraryId: "ai",
    updatedAt: "上周",
    messages: [
      { role: "user", content: "RAG 系统如何降低回答幻觉？" },
      {
        role: "assistant",
        content:
          "可以从检索召回、上下文排序、引用片段绑定、结构化输出和答案校验几个方向处理。前端侧要把引用来源清晰暴露给用户，方便回看证据。",
      },
    ],
  },
];

export const references: ReferenceItem[] = [
  {
    title: "Avoiding power broadening in optically detected magnetic resonance of single NV defects.pdf / ODMR",
    source: "ODMR 线宽和对比度会受到微波功率、光功率与读出条件共同影响，调参时需要避免功率展宽掩盖弱共振特征。",
    tag: "ODMR 调参",
  },
  {
    title: "Wide-field Optical Microscopy of Microwave Fields Using Nitrogen-Vacancy Centers in diamond.pdf / microwave imaging",
    source: "宽场成像可通过 NV 荧光响应重建微波场空间分布，适合验证天线、线圈和近场结构的均匀性。",
    tag: "微波场成像",
  },
  {
    title: "Bias-Field-Free Operation of Nitrogen-Vacancy Ensembles in Diamond for Accurate Vector Magnetometry.pdf / vector magnetometry",
    source: "矢量磁测量需要处理不同 NV 轴向响应、零场或偏置场条件下的谱线识别，以及多轴分量反演。",
    tag: "矢量磁测量",
  },
  {
    title: "A fully-portable and highly-sensitive all-fiber quantum magnetometer.pdf / fiber integration",
    source: "光纤化方案可降低光路调试复杂度，并提升移动测量或小型化系统中的部署便利性。",
    tag: "光纤集成",
  },
  {
    title: "Temperature Dependence of the Nitrogen-Vacancy Magnetic Resonance in Diamond.pdf / temperature drift",
    source: "NV 零场劈裂随温度变化会引入磁场解算漂移，实际系统中需要温度补偿或同步温度监测。",
    tag: "温度补偿",
  },
  {
    title: "Diamond magnetometry and gradiometry towards subpicotesla dc field measurement.pdf / sensitivity",
    source: "灵敏度优化需要同时考虑光子散粒噪声、谱线宽度、对比度、相干时间和背景磁噪声，单一参数提升往往不足以决定系统性能。",
    tag: "灵敏度优化",
  },
  {
    title: "Camera-limits for wide-field magnetic resonance imaging with a nitrogen-vacancy spin sensor.pdf / imaging limits",
    source: "宽场成像中相机读出噪声、像素满阱容量、曝光时间和荧光收集效率会限制磁场图像的信噪比与时间分辨率。",
    tag: "相机限制",
  },
  {
    title: "Ultra-broadband coplanar waveguide for optically detected magnetic resonance of nitrogen-vacancy centers in diamond.pdf / microwave structure",
    source: "微波结构设计会影响场均匀性、带宽、局部热效应和 ODMR 驱动效率，是工程化 NV 系统的重要模块。",
    tag: "微波结构",
  },
  {
    title: "Assessment of Rydberg atoms for wideband electric field sensing.pdf / comparison",
    source: "Rydberg 原子传感在宽带电场测量和频谱分析中具有优势，可作为 NV 色心磁场近场成像能力的互补技术路线。",
    tag: "技术对比",
  },
];

export const metrics: MetricItem[] = [
  { label: "本地文献总数", value: "848" },
  { label: "PDF 文献", value: "836" },
  { label: "主题分类", value: "9" },
  { label: "解析片段", value: "7,318" },
];

export const trendData = [38, 64, 92, 126, 188, 271, 346];

export const categoryData: CategoryDatum[] = [
  { name: "磁测量/磁力计", value: 338 },
  { name: "量子控制/相干", value: 370 },
  { name: "ODMR/微波/RF", value: 109 },
  { name: "宽场/成像/扫描", value: 107 },
  { name: "温度/热测量", value: 66 },
  { name: "光纤/集成传感", value: 54 },
  { name: "Rydberg/原子传感", value: 34 },
  { name: "生物/医学应用", value: 30 },
  { name: "AI/反演重建", value: 18 },
];

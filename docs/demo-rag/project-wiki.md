# AI Knowledge Demo RAG Notes

## NV center and ODMR

Nitrogen vacancy centers in diamond are solid-state spin defects that can be initialized and read out optically. In a typical ODMR experiment, green laser excitation polarizes the spin state and the fluorescence intensity changes when the microwave frequency matches a spin transition. Around zero magnetic field, the resonance is close to 2.87 GHz. Bias magnetic fields split the resonance, so the sweep range should cover the expected shifted peaks.

ODMR linewidth can broaden because of high microwave power, laser heating, strain distribution, magnetic noise, temperature drift, ensemble inhomogeneity, and imperfect microwave delivery. When the ODMR contrast is weak, the first checks are laser focus, fluorescence count rate, microwave output, antenna position, sweep range, exposure time, averaging number, and fitting window.

## Quantum compass demo

A diamond NV quantum compass uses the Zeeman splitting of ODMR resonance lines to infer magnetic field direction. The diamond lattice contains four possible NV axes. A magnetic field projects differently onto these four axes, so the resonance frequencies carry vector information rather than only a scalar field magnitude. In a public demo, the explanation can be: the phone compass uses a classical magnetometer chip, while the NV probe reads magnetic direction through microwave resonance frequencies of quantum spins in diamond.

For geomagnetic field demonstrations, the expected field is about 0.25 to 0.65 gauss depending on location and indoor magnetic disturbance. The UI should compare the horizontal projection angle from the NV vector result with the phone compass heading. Because the diamond probe and the phone do not share the same zero direction, a heading offset calibration is needed. The practical calibration step is to keep the probe fixed, read the phone heading, read the NV raw heading, and set heading offset equal to phone heading minus NV raw heading.

## Eight peaks, four peaks, and fast vector inversion

Full ODMR vector magnetometry can fit eight resonances from four NV orientations. Eight peaks are robust because they provide redundancy and can help estimate magnetic field, zero-field splitting D, strain parameter E, temperature drift, and peak assignment. The tradeoff is speed: scanning a wide spectrum with enough averaging takes longer.

When D and E are already known from calibration, fewer peaks can be used for a faster demo. Four low-frequency peaks or four high-frequency peaks can provide enough equations to solve the three magnetic vector components, with one redundant constraint. Three peaks can also produce a mathematical solution if the peak identities are known, but it is more sensitive to noise and peak misassignment. A reliable workflow is: first use a full or wider scan to lock the peak assignment and D/E values, then use low-four or high-four peak tracking for faster compass updates, and use three-peak mode only as an experimental fast-tracking option.

## How to explain D and E

In NV ODMR, D is the zero-field splitting, close to 2870 MHz at room temperature. It is mainly set by the internal spin-spin interaction of the NV center and shifts with temperature. E is a transverse strain or electric-field-related splitting parameter. In simple public language, D is the center reference of the spectrum and E describes a small built-in asymmetry of the diamond environment. If D and E are fixed by calibration, the remaining frequency shifts can be interpreted mainly as magnetic-field information.

## Demo talking points for visitors

The quantum compass demo can be explained in four sentences. A green laser prepares and reads the NV spins in diamond. Microwaves sweep across resonance frequencies, and the fluorescence changes when the spin transition is hit. Earth's magnetic field slightly moves the resonance frequencies. By comparing several resonance lines, the software reconstructs the magnetic field vector and draws a compass needle.

Good demo prompts for the web agent include: why can a diamond sense magnetic fields, why does ODMR have eight peaks, why can four peaks be faster than eight peaks, how to compare with a phone compass, why lowering average counts makes the reading faster but noisier, and what should be checked when the compass direction jumps.

## 中文科普：量子指南针与少峰矢量反演

量子指南针可以解释为用钻石里的 NV 色心量子自旋来读取地磁场方向。手机指南针通常使用经典磁传感芯片，而 NV 指南针通过绿光读出自旋、微波扫描 ODMR 共振峰，再根据峰位移动反推出磁场矢量。地磁场会让 ODMR 峰发生塞曼劈裂，不同 NV 轴向的峰移动量不同，所以多个峰位可以携带 Bx、By、Bz 三个方向的信息。

完整八峰来自四个 NV 轴向，每个轴向有低频和高频两条跃迁。八峰最稳，可以帮助判断峰归属、D/E、温漂和磁场方向，但扫描时间较长。若 D 和 E 已知，未知量主要是 Bx、By、Bz，因此低频4峰或高频4峰通常可以快速解出三维磁场矢量。三峰模式也可能给出数学解，但对噪声、峰归属错误和室内磁干扰更敏感，更适合作为快速演示而不是精密测量。

和手机指南针对照时，需要做偏置角校准。实际步骤是固定探头和手机，记录手机指南针角度，再记录 NV 指南针原始角度，令偏置角等于手机角度减去 NV 原始角度。若方向跳变，应检查铁桌、磁铁、马达、电流线、音箱、电源适配器等室内磁干扰源，并优先从三峰模式切回低频4峰或高频4峰。

公众演示话术可以是：这套装置用钻石里的量子自旋做磁场传感。绿光负责读出自旋状态，微波负责寻找共振频率。当地磁场存在时，量子能级会发生很小的塞曼劈裂，ODMR 谱线随之移动。软件从几条谱线反推出磁场矢量，再把水平分量画成指南针。

## Troubleshooting the compass demo

If the NV compass does not match the phone compass, first check whether the probe and phone are physically aligned and whether the heading offset has been calibrated. Then check for nearby steel tables, magnets, motors, current-carrying wires, and microwave cables because indoor magnetic disturbances can easily perturb geomagnetic measurements. If the direction is noisy, increase averaging, widen the peak fitting window, or switch from three-peak mode back to four-peak mode. If the algorithm reports too few peaks, lower the prominence threshold slightly or use a wider scan range for re-locking.

## RAG workflow

A research knowledge base usually uses a retrieval augmented generation workflow. The documents are parsed into text chunks, each chunk is converted to an embedding vector, and the user question is embedded into the same vector space. The retrieval stage selects candidate chunks by vector similarity, then a rerank stage combines semantic similarity, keyword matches, title hits, source reliability, and recency. The final answer should cite the retrieved source names and show enough snippets for verification.

For this project, the public online demo uses a small demo index. The full local version can build a private index from laboratory PDF papers. The private index should stay outside GitHub because it may contain copyrighted paper text or internal group notes.

## Project group usage

The platform is designed for a research group encyclopedia. Useful content includes paper summaries, experimental SOPs, instrument connection notes, SCPI command examples, data naming rules, troubleshooting records, and onboarding notes for new students. The answer interface should keep citations visible so users can decide whether the model answer is supported by the group knowledge base.

## Safe online deployment

The frontend can be deployed on GitHub Pages, but real model calls need a backend service. The backend stores the DeepSeek API key in environment variables and exposes only a small API to the browser. API keys, local `.env` files, original papers, and private RAG indexes should never be committed to GitHub.

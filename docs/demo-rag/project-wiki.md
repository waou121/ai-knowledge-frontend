# AI Knowledge Demo RAG Notes

## NV center and ODMR

Nitrogen vacancy centers in diamond are solid-state spin defects that can be initialized and read out optically. In a typical ODMR experiment, green laser excitation polarizes the spin state and the fluorescence intensity changes when the microwave frequency matches a spin transition. Around zero magnetic field, the resonance is close to 2.87 GHz. Bias magnetic fields split the resonance, so the sweep range should cover the expected shifted peaks.

ODMR linewidth can broaden because of high microwave power, laser heating, strain distribution, magnetic noise, temperature drift, ensemble inhomogeneity, and imperfect microwave delivery. When the ODMR contrast is weak, the first checks are laser focus, fluorescence count rate, microwave output, antenna position, sweep range, exposure time, averaging number, and fitting window.

## RAG workflow

A research knowledge base usually uses a retrieval augmented generation workflow. The documents are parsed into text chunks, each chunk is converted to an embedding vector, and the user question is embedded into the same vector space. The retrieval stage selects candidate chunks by vector similarity, then a rerank stage combines semantic similarity, keyword matches, title hits, source reliability, and recency. The final answer should cite the retrieved source names and show enough snippets for verification.

For this project, the public online demo uses a small demo index. The full local version can build a private index from laboratory PDF papers. The private index should stay outside GitHub because it may contain copyrighted paper text or internal group notes.

## Project group usage

The platform is designed for a research group encyclopedia. Useful content includes paper summaries, experimental SOPs, instrument connection notes, SCPI command examples, data naming rules, troubleshooting records, and onboarding notes for new students. The answer interface should keep citations visible so users can decide whether the model answer is supported by the group knowledge base.

## Safe online deployment

The frontend can be deployed on GitHub Pages, but real model calls need a backend service. The backend stores the DeepSeek API key in environment variables and exposes only a small API to the browser. API keys, local `.env` files, original papers, and private RAG indexes should never be committed to GitHub.

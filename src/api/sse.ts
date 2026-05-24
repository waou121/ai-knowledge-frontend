import { apiBaseUrl } from "./http";
import { createMockAnswer } from "./mockBackend";

interface StreamOptions {
  libraryId: string;
  libraryName: string;
  conversationId: string;
  question: string;
  onDelta: (delta: string) => void;
  onDone: () => void;
  onError: (message: string) => void;
}

function streamMockAnswer(answer: string, onDelta: (delta: string) => void, onDone: () => void) {
  let index = 0;
  const timer = window.setInterval(() => {
    const delta = answer.slice(index, index + 2);
    index += 2;
    if (delta) {
      onDelta(delta);
    }
    if (index >= answer.length) {
      window.clearInterval(timer);
      onDone();
    }
  }, 18);

  return () => window.clearInterval(timer);
}

export function streamChatAnswer(options: StreamOptions) {
  const useMock = import.meta.env.VITE_USE_MOCK !== "false";
  if (useMock) {
    return streamMockAnswer(createMockAnswer(options.question, options.libraryName), options.onDelta, options.onDone);
  }

  const params = new URLSearchParams({
    libraryId: options.libraryId,
    conversationId: options.conversationId,
    question: options.question,
  });
  const eventSource = new EventSource(`${apiBaseUrl}/chat/stream?${params.toString()}`);

  eventSource.addEventListener("message", (event) => {
    if (event.data === "[DONE]") {
      eventSource.close();
      options.onDone();
      return;
    }

    try {
      const parsed = JSON.parse(event.data) as { delta?: string };
      options.onDelta(parsed.delta ?? event.data);
    } catch {
      options.onDelta(event.data);
    }
  });

  eventSource.addEventListener("error", () => {
    eventSource.close();
    options.onError("流式连接中断，请检查后端 SSE 服务");
  });

  return () => eventSource.close();
}

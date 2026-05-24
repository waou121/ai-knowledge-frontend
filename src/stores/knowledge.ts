import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { askQuestionApi, fetchLibrariesApi, loginApi, parseDocumentApi, uploadDocumentApi } from "../api/knowledge";
import { streamChatAnswer } from "../api/sse";
import { initialLibraries, references as initialReferences } from "../mockData";
import type { Conversation, DocumentItem, KnowledgeLibrary, LoginPayload, ReferenceItem } from "../types";

const loginKey = "knowledge_ai_logged_in";
const tokenKey = "knowledge_ai_token";

function cloneLibraries(): KnowledgeLibrary[] {
  return initialLibraries.map((library) => ({
    ...library,
    docs: library.docs.map((doc) => ({ ...doc })),
  }));
}

function createDefaultConversation(libraryId: string): Conversation {
  return {
    id: "c-default",
    title: "新的问答会话",
    libraryId,
    updatedAt: "刚刚",
    messages: [{ role: "assistant", content: "已连接当前知识库，可以开始提问。" }],
  };
}

export const useKnowledgeStore = defineStore("knowledge", () => {
  const loggedIn = ref(localStorage.getItem(loginKey) === "1");
  const username = ref(localStorage.getItem("knowledge_ai_username") || "gaojunchi");
  const libraries = ref<KnowledgeLibrary[]>(cloneLibraries());
  const activeLibraryId = ref(libraries.value[0].id);
  const conversations = ref<Conversation[]>([createDefaultConversation(activeLibraryId.value)]);
  const activeConversationId = ref(conversations.value[0].id);
  const uploadHint = ref("拖拽或点击上传");
  const lastQuestion = ref("");
  const references = ref<ReferenceItem[]>([...initialReferences]);
  const isStreaming = ref(false);
  const isLoading = ref(false);
  let closeStream: (() => void) | undefined;

  const currentLibrary = computed(() => {
    return libraries.value.find((library) => library.id === activeLibraryId.value) ?? libraries.value[0];
  });

  const currentConversation = computed(() => {
    return conversations.value.find((conversation) => conversation.id === activeConversationId.value) ?? conversations.value[0];
  });

  const chunkCount = computed(() => currentLibrary.value.docs.reduce((sum, doc) => sum + doc.chunks, 0));

  async function login(payload: LoginPayload) {
    isLoading.value = true;
    try {
      const result = await loginApi(payload);
      username.value = result.username;
      loggedIn.value = true;
      localStorage.setItem(loginKey, "1");
      localStorage.setItem(tokenKey, result.token);
      localStorage.setItem("knowledge_ai_username", result.username);
    } finally {
      isLoading.value = false;
    }
  }

  function logout() {
    loggedIn.value = false;
    localStorage.removeItem(loginKey);
    localStorage.removeItem(tokenKey);
  }

  async function loadLibraries() {
    libraries.value = await fetchLibrariesApi();
    if (!libraries.value.some((library) => library.id === activeLibraryId.value)) {
      activeLibraryId.value = libraries.value[0]?.id ?? "";
    }
  }

  function setLibrary(libraryId: string) {
    activeLibraryId.value = libraryId;
  }

  function selectConversation(conversationId: string) {
    const conversation = conversations.value.find((item) => item.id === conversationId);
    if (!conversation) return;
    activeConversationId.value = conversationId;
    activeLibraryId.value = conversation.libraryId;
  }

  function createConversation() {
    const id = `c${Date.now()}`;
    conversations.value.unshift({
      id,
      title: "新的问答会话",
      libraryId: activeLibraryId.value,
      updatedAt: "刚刚",
      messages: [{ role: "assistant", content: "已连接当前知识库，可以开始提问。" }],
    });
    activeConversationId.value = id;
  }

  async function submitQuestion(question: string) {
    const trimmed = question.trim();
    if (!trimmed || isStreaming.value) return;

    lastQuestion.value = trimmed;
    const conversation = currentConversation.value;
    conversation.messages.push({ role: "user", content: trimmed });
    conversation.title = trimmed.slice(0, 14);
    conversation.libraryId = activeLibraryId.value;

    const assistantMessage = { role: "assistant" as const, content: "" };
    conversation.messages.push(assistantMessage);
    isStreaming.value = true;

    const payload = {
      libraryId: activeLibraryId.value,
      conversationId: conversation.id,
      question: trimmed,
    };

    closeStream?.();
    closeStream = streamChatAnswer({
      ...payload,
      libraryName: currentLibrary.value.name,
      onDelta: (delta) => {
        assistantMessage.content += delta;
      },
      onDone: async () => {
        conversation.updatedAt = "刚刚";
        isStreaming.value = false;
        try {
          const result = await askQuestionApi(payload, currentLibrary.value.name);
          references.value = result.references;
          if (!assistantMessage.content) {
            assistantMessage.content = result.answer;
          }
        } catch {
          references.value = initialReferences;
        }
      },
      onError: (message) => {
        isStreaming.value = false;
        assistantMessage.content = assistantMessage.content || message;
      },
    });
  }

  function regenerateAnswer() {
    if (!lastQuestion.value || isStreaming.value) return;
    const messages = currentConversation.value.messages;
    if (messages[messages.length - 1]?.role === "assistant") {
      messages.pop();
    }
    void submitQuestion(lastQuestion.value);
  }

  async function parseDocument(doc: DocumentItem) {
    doc.status = "解析中";
    const result = await parseDocumentApi(activeLibraryId.value, doc.id);
    doc.status = result.status;
    doc.chunks = result.chunks;
  }

  async function parseAll() {
    await Promise.all(currentLibrary.value.docs.map((doc) => parseDocument(doc)));
  }

  async function addUploadedDocs(files: File[]) {
    if (!files.length) return;
    uploadHint.value = `${files.length} 个文件已加入队列`;
    const uploadedDocs = await Promise.all(files.map((file) => uploadDocumentApi(activeLibraryId.value, file)));
    currentLibrary.value.docs.unshift(...uploadedDocs);
  }

  return {
    activeConversationId,
    activeLibraryId,
    chunkCount,
    conversations,
    currentConversation,
    currentLibrary,
    isLoading,
    isStreaming,
    libraries,
    loggedIn,
    references,
    uploadHint,
    username,
    addUploadedDocs,
    createConversation,
    loadLibraries,
    login,
    logout,
    parseAll,
    parseDocument,
    regenerateAnswer,
    selectConversation,
    setLibrary,
    submitQuestion,
  };
});

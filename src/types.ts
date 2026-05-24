export type ViewKey = "chat" | "library" | "dashboard";

export type Role = "user" | "assistant";

export interface DocumentItem {
  id: number;
  name: string;
  type: string;
  size: string;
  status: "已解析" | "解析中" | "解析失败";
  chunks: number;
}

export interface KnowledgeLibrary {
  id: string;
  name: string;
  docs: DocumentItem[];
}

export interface ChatMessage {
  role: Role;
  content: string;
}

export interface Conversation {
  id: string;
  title: string;
  libraryId: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export interface ReferenceItem {
  title: string;
  source: string;
  tag: string;
}

export interface MetricItem {
  label: string;
  value: string;
}

export interface CategoryDatum {
  name: string;
  value: number;
}

export interface LoginPayload {
  account: string;
  password: string;
}

export interface LoginResult {
  token: string;
  username: string;
}

export interface AskPayload {
  libraryId: string;
  conversationId: string;
  question: string;
}

export interface AskResult {
  answer: string;
  references: ReferenceItem[];
}

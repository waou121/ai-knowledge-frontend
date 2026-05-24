import { http } from "./http";
import { mockBackend } from "./mockBackend";
import type { AskPayload, AskResult, DocumentItem, KnowledgeLibrary, LoginPayload, LoginResult } from "../types";

const useMock = () => import.meta.env.VITE_USE_MOCK !== "false";

export async function loginApi(payload: LoginPayload): Promise<LoginResult> {
  if (useMock()) return mockBackend.login(payload);
  return http.post<LoginResult, LoginResult>("/auth/login", payload);
}

export async function fetchLibrariesApi(): Promise<KnowledgeLibrary[]> {
  if (useMock()) return mockBackend.getLibraries();
  return http.get<KnowledgeLibrary[], KnowledgeLibrary[]>("/libraries");
}

export async function uploadDocumentApi(libraryId: string, file: File): Promise<DocumentItem> {
  if (useMock()) return mockBackend.uploadDocument(libraryId, file);
  const formData = new FormData();
  formData.append("file", file);
  return http.post<DocumentItem, DocumentItem>(`/libraries/${libraryId}/documents`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function parseDocumentApi(libraryId: string, documentId: number): Promise<{ status: DocumentItem["status"]; chunks: number }> {
  if (useMock()) return mockBackend.parseDocument();
  return http.post<{ status: DocumentItem["status"]; chunks: number }, { status: DocumentItem["status"]; chunks: number }>(
    `/libraries/${libraryId}/documents/${documentId}/parse`,
  );
}

export async function askQuestionApi(payload: AskPayload, libraryName: string): Promise<AskResult> {
  if (useMock()) return mockBackend.ask(payload, libraryName);
  return http.post<AskResult, AskResult>("/chat/ask", payload);
}

import type { ChatMessage } from "@/types";
import { MOCK_MODE, apiFetch, delay } from "./api";
import { mockAssistantReply } from "./mock-data";

export async function sendChat(prompt: string): Promise<ChatMessage> {
  if (MOCK_MODE) {
    await delay(900);
    return mockAssistantReply(prompt);
  }
  return apiFetch<ChatMessage>("/chat", {
    method: "POST",
    body: JSON.stringify({ prompt }),
  });
}
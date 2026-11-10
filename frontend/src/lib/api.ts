import type { ChatResponse } from "@/types/chat";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function askSOPAssistant(
  question: string
): Promise<ChatResponse> {
  const response = await fetch(`${API_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question }),
  });

  if (!response.ok) {
    let errorMessage = "Unable to get an answer. Please try again.";

    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorMessage;
    } catch {
      // Keep the default error message.
    }

    throw new Error(errorMessage);
  }

  return response.json();
}
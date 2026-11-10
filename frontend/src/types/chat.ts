export interface Source {
  document: string;
  page: number;
  similarity: number;
  excerpt: string;
}

export interface ChatResponse {
  question: string;
  answer: string;
  sources: Source[];
  abstained: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  abstained?: boolean;
  kind?: "welcome";
}
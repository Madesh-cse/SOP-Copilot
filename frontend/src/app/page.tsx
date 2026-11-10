"use client";

import { useEffect, useRef, useState } from "react";

import Sidebar from "@/components/Sidebar";
import ChatHeader from "@/components/ChatHeader";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import WelcomeScreen from "@/components/WelcomeScreen";
import LoadingMessage from "@/components/LoadingMessage";
import ErrorMessage from "@/components/ErrorMessage";

import { askSOPAssistant } from "@/lib/api";
import type { ChatMessage as ChatMessageType } from "@/types/chat";

const welcomeMessage: ChatMessageType = {
  id: "welcome",
  role: "assistant",
  kind: "welcome",
  content:
    "Hello! I'm your Manufacturing SOP Copilot. Ask me about preventive maintenance, quality specifications, safety procedures and your uploaded manufacturing documents.",
};

export default function Home() {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    welcomeMessage,
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastQuestion, setLastQuestion] = useState("");

  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loading || error) {
      endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [loading, error]);

  function handleNewChat() {
    setMessages([welcomeMessage]);
    setError("");
    setLastQuestion("");
  }

  async function runQuery(question: string) {
    setError("");
    setLoading(true);

    try {
      const result = await askSOPAssistant(question);

      const assistantMessage: ChatMessageType = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: result.answer,
        sources: result.sources ?? [],
        abstained: result.abstained,
      };

      setMessages((previous) => [...previous, assistantMessage]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleSend(question: string) {
    if (loading) return;

    const userMessage: ChatMessageType = {
      id: crypto.randomUUID(),
      role: "user",
      content: question,
    };

    setMessages((previous) => [...previous, userMessage]);
    setLastQuestion(question);
    void runQuery(question);
  }

  function handleRetry() {
    if (loading || !lastQuestion) return;
    void runQuery(lastQuestion);
  }

  const hasConversation = messages.length > 1;

  return (
    <main className="app-shell">
      <Sidebar onNewChat={handleNewChat} />

      <section className="main-panel">
        <ChatHeader />

        <div className="chat-content">
          {!hasConversation && (
            <WelcomeScreen onSelect={handleSend} disabled={loading} />
          )}

          {hasConversation && (
            <div className="conversation">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}

              {loading && <LoadingMessage />}

              {error && (
                <ErrorMessage
                  message={error}
                  onRetry={handleRetry}
                  onDismiss={() => setError("")}
                />
              )}

              <div ref={endRef} />
            </div>
          )}
        </div>

        <footer className="chat-footer">
          <ChatInput onSend={handleSend} disabled={loading} />

          <p>
            AI-generated answers are grounded in indexed documents.
            Always follow your plant&apos;s approved safety procedures.
          </p>
        </footer>
      </section>
    </main>
  );
}
"use client";

import { useState } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Check,
  ChevronDown,
  Copy,
  FileText,
  Info,
  TriangleAlert,
} from "lucide-react";

import type { ChatMessage as ChatMessageType } from "@/types/chat";
import SourceCard from "./SourceCard";

interface ChatMessageProps {
  message: ChatMessageType;
}

const markdownComponents: Components = {
  table: ({ children }) => (
    <div className="table-wrap">
      <table>{children}</table>
    </div>
  ),
};

function Markdown({ content }: { content: string }) {
  return (
    <div className="markdown-answer">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);

  const isUser = message.role === "user";
  const isWelcome = message.kind === "welcome";
  const isAbstained = Boolean(message.abstained);
  const sources = message.sources ?? [];

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  if (isUser) {
    return (
      <article className="user-message-row">
        <div className="user-message-content">
          <span className="message-author">You</span>
          <div className="user-message-bubble">{message.content}</div>
        </div>

        <div className="user-avatar user-avatar-light" aria-hidden="true">
          You
        </div>
      </article>
    );
  }

  if (isWelcome) {
    return (
      <article className="welcome-message">
        <div className="assistant-avatar" aria-hidden="true">
          AI
        </div>

        <div className="welcome-message-content">
          <strong>SOP Copilot</strong>
          <Markdown content={message.content} />
        </div>
      </article>
    );
  }

  return (
    <article className="assistant-answer" aria-label="Assistant response">
      <header className="assistant-answer-header">
        <div className="assistant-avatar" aria-hidden="true">
          AI
        </div>

        <div className="assistant-identity">
          <strong>SOP Copilot</strong>
          <span>Manufacturing knowledge assistant</span>
        </div>

        <span
          className={`answer-badge ${isAbstained ? "answer-badge-warning" : ""}`}
          role="status"
        >
          {isAbstained ? "Insufficient evidence" : "Grounded answer"}
        </span>
      </header>

      <section
        className={`answer-body ${isAbstained ? "answer-body-warning" : ""}`}
      >
        <div className="answer-section-label">
          {isAbstained ? "No matching evidence" : "Answer"}
        </div>

        <Markdown content={message.content} />
      </section>

      {isAbstained && (
        <div className="abstention-note" role="note">
          <TriangleAlert size={18} aria-hidden="true" />
          <div>
            <strong>What should you do?</strong>
            <p>
              The indexed documents do not contain enough evidence to answer
              this. Check the relevant approved SOP or ask your supervisor.
            </p>
          </div>
        </div>
      )}

      {!isAbstained && sources.length > 0 && (
        <details className="sources-section">
          <summary className="sources-summary">
            <span className="sources-summary-title">
              <FileText size={16} aria-hidden="true" />
              Supporting evidence
              <span className="source-count">
                {sources.length} {sources.length === 1 ? "source" : "sources"}
              </span>
            </span>
            <ChevronDown
              className="sources-chevron"
              size={18}
              aria-hidden="true"
            />
          </summary>

          <div className="sources-list">
            {sources.map((source, index) => (
              <SourceCard
                key={`${source.document}-${source.page}-${index}`}
                source={source}
                index={index + 1}
              />
            ))}
          </div>
        </details>
      )}

      <footer className="answer-footer">
        <p className="answer-disclaimer">
          <Info size={14} aria-hidden="true" />
          {isAbstained
            ? "No answer was generated from the documents."
            : "Verify critical values against the latest approved SOP."}
        </p>

        {!isAbstained && (
          <button
            type="button"
            className="copy-button"
            onClick={handleCopy}
            aria-label="Copy answer"
          >
            {copied ? (
              <>
                <Check size={14} aria-hidden="true" /> Copied
              </>
            ) : (
              <>
                <Copy size={14} aria-hidden="true" /> Copy
              </>
            )}
          </button>
        )}
      </footer>
    </article>
  );
}
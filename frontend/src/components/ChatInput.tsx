"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { ArrowUp, Loader2 } from "lucide-react";

interface ChatInputProps {
  onSend: (question: string) => void;
  disabled?: boolean;
}

const MIN_LENGTH = 3;
const MAX_LENGTH = 1000;
const COUNTER_THRESHOLD = 800;

export default function ChatInput({
  onSend,
  disabled = false,
}: ChatInputProps) {
  const [question, setQuestion] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const trimmed = question.trim();
  const canSend = trimmed.length >= MIN_LENGTH && !disabled;

  useEffect(() => {
    const element = textareaRef.current;
    if (!element) return;

    element.style.height = "auto";
    element.style.height = `${Math.min(element.scrollHeight, 160)}px`;
  }, [question]);

  function submit() {
    if (!canSend) return;

    onSend(trimmed);
    setQuestion("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submit();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      submit();
    }
  }

  return (
    <form className="chat-input-form" onSubmit={handleSubmit}>
      <label htmlFor="chat-input" className="sr-only">
        Ask a manufacturing SOP question
      </label>

      <textarea
        id="chat-input"
        ref={textareaRef}
        rows={1}
        value={question}
        onChange={(event) => setQuestion(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask about maintenance, safety or quality procedures..."
        maxLength={MAX_LENGTH}
      />

      <div className="chat-input-actions">
        {question.length >= COUNTER_THRESHOLD && (
          <span
            className={`char-count ${
              question.length >= MAX_LENGTH ? "char-count-limit" : ""
            }`}
            aria-live="polite"
          >
            {question.length}/{MAX_LENGTH}
          </span>
        )}

        <button
          type="submit"
          className="send-button"
          disabled={!canSend}
          aria-label={disabled ? "Waiting for answer" : "Send question"}
        >
          {disabled ? (
            <Loader2 className="spin" size={18} aria-hidden="true" />
          ) : (
            <ArrowUp size={18} strokeWidth={2.4} aria-hidden="true" />
          )}
        </button>
      </div>
    </form>
  );
}
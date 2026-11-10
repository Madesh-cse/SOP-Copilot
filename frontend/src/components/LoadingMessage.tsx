"use client";

import { useEffect, useState } from "react";

const stages = [
  "Searching your documents",
  "Reading the most relevant pages",
  "Writing a grounded answer",
];

export default function LoadingMessage() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setStage((current) => Math.min(current + 1, stages.length - 1));
    }, 2200);

    return () => window.clearInterval(id);
  }, []);

  return (
    <article className="loading-message" role="status" aria-live="polite">
      <header className="loading-header">
        <div className="assistant-avatar" aria-hidden="true">
          AI
        </div>

        <div className="assistant-identity">
          <strong>SOP Copilot</strong>
          <span key={stage} className="loading-stage">
            {stages[stage]}
            <span className="loading-dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
          </span>
        </div>
      </header>

      <div className="skeleton-lines" aria-hidden="true">
        <span className="skeleton-line" />
        <span className="skeleton-line" />
        <span className="skeleton-line" />
      </div>
    </article>
  );
}
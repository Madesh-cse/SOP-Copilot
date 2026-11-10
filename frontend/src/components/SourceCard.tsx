import { FileText } from "lucide-react";

import type { Source } from "@/types/chat";

interface SourceCardProps {
  source: Source;
  index: number;
}

export default function SourceCard({ source, index }: SourceCardProps) {
  const similarity = Math.round(source.similarity * 100);

  return (
    <article className="evidence-card">
      <div className="evidence-top">
        <div className="evidence-file-icon" aria-hidden="true">
          <FileText size={18} />
        </div>

        <div className="evidence-info">
          <h4>{source.document}</h4>

          <div className="evidence-metadata">
            <span className="evidence-page">Page {source.page}</span>

            <span
              className="match-meter"
              title={`${similarity}% similarity to your question`}
            >
              <span className="match-track" aria-hidden="true">
                <span
                  className="match-fill"
                  style={{ width: `${similarity}%` }}
                />
              </span>
              {similarity}% match
            </span>
          </div>
        </div>

        <span className="evidence-index" aria-hidden="true">
          {index}
        </span>
      </div>

      <blockquote className="evidence-excerpt">{source.excerpt}</blockquote>
    </article>
  );
}
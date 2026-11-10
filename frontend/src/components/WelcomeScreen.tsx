import { BookOpenCheck, FileSearch, ShieldQuestion, Sparkles } from "lucide-react";

import SuggestedQuestions from "./SuggestedQuestions";

interface WelcomeScreenProps {
  onSelect: (question: string) => void;
  disabled?: boolean;
}

const trustPoints = [
  { icon: BookOpenCheck, label: "Answers only from your documents" },
  { icon: FileSearch, label: "Page-level citations" },
  { icon: ShieldQuestion, label: "Says so when evidence is missing" },
];

export default function WelcomeScreen({
  onSelect,
  disabled = false,
}: WelcomeScreenProps) {
  return (
    <div className="welcome-section">
      <div className="welcome-icon" aria-hidden="true">
        <Sparkles size={26} strokeWidth={1.8} />
      </div>

      <p className="welcome-eyebrow">Manufacturing knowledge assistant</p>

      <h1>
        Your SOP knowledge.
        <br />
        <span>One question away.</span>
      </h1>

      <p className="welcome-description">
        Search your manufacturing procedures in plain language and get
        document-grounded answers with the exact page behind every one.
      </p>

      <ul className="trust-list">
        {trustPoints.map(({ icon: Icon, label }) => (
          <li key={label} className="trust-chip">
            <Icon size={14} aria-hidden="true" />
            {label}
          </li>
        ))}
      </ul>

      <SuggestedQuestions onSelect={onSelect} disabled={disabled} />
    </div>
  );
}
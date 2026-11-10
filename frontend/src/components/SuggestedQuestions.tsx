import { ArrowUpRight, Ruler, ShieldAlert, Wrench } from "lucide-react";

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void;
  disabled?: boolean;
}

const suggestions = [
  {
    category: "Maintenance",
    tone: "blue",
    icon: Wrench,
    question:
      "What are the daily preventive maintenance steps for the CNC machine?",
  },
  {
    category: "Quality",
    tone: "green",
    icon: Ruler,
    question:
      "What is the outer diameter tolerance for the BH-220 bearing housing?",
  },
  {
    category: "Safety",
    tone: "amber",
    icon: ShieldAlert,
    question: "What are the steps in the lockout tagout procedure?",
  },
] as const;

export default function SuggestedQuestions({
  onSelect,
  disabled = false,
}: SuggestedQuestionsProps) {
  return (
    <section className="suggestions" aria-labelledby="suggestions-title">
      <div className="suggestions-heading">
        <h3 id="suggestions-title">Try asking something</h3>
        <p>Pick a sample question to see how answers and evidence look.</p>
      </div>

      <div className="suggestion-grid">
        {suggestions.map(({ category, tone, icon: Icon, question }, index) => (
          <button
            key={category}
            type="button"
            className="suggestion-card"
            data-tone={tone}
            style={{ animationDelay: `${index * 70}ms` }}
            disabled={disabled}
            onClick={() => onSelect(question)}
          >
            <span className="suggestion-top">
              <span className="suggestion-icon" aria-hidden="true">
                <Icon size={18} strokeWidth={2} />
              </span>
              <ArrowUpRight
                className="suggestion-arrow"
                size={16}
                aria-hidden="true"
              />
            </span>

            <span className="suggestion-category">{category}</span>
            <span className="suggestion-question">{question}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
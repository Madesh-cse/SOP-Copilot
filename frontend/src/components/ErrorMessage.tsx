import { RotateCcw, TriangleAlert } from "lucide-react";

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
  onDismiss: () => void;
}

export default function ErrorMessage({
  message,
  onRetry,
  onDismiss,
}: ErrorMessageProps) {
  return (
    <div className="api-error" role="alert">
      <TriangleAlert size={20} aria-hidden="true" />

      <div className="api-error-body">
        <strong>Couldn&apos;t get an answer</strong>
        <p>{message}</p>

        <div className="api-error-actions">
          <button
            type="button"
            className="api-error-button primary"
            onClick={onRetry}
          >
            <RotateCcw size={14} aria-hidden="true" />
            Try again
          </button>

          <button
            type="button"
            className="api-error-button"
            onClick={onDismiss}
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
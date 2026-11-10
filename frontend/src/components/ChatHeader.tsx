import { ChevronRight } from "lucide-react";

export default function ChatHeader() {
  return (
    <header className="chat-header">
      <div className="chat-header-text">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <span>Workspace</span>
          <ChevronRight size={12} aria-hidden="true" />
          <span aria-current="page">SOP Assistant</span>
        </nav>

        <h2>Ask your SOPs</h2>

        <p className="header-description">
          Document-grounded answers with page-level evidence.
        </p>
      </div>

      <div className="header-status" role="status">
        <span className="status-dot" aria-hidden="true" />
        <span className="header-status-label">Knowledge base ready</span>
      </div>
    </header>
  );
}
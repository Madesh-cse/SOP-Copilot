import { Factory, Files, History, MessagesSquare, Plus } from "lucide-react";

interface SidebarProps {
  onNewChat: () => void;
}

export default function Sidebar({ onNewChat }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon" aria-hidden="true">
          <Factory size={20} strokeWidth={2.2} />
        </div>
        <div>
          <h1>SOP Copilot</h1>
          <p>Manufacturing Intelligence</p>
        </div>
      </div>

      <button className="new-chat-button" onClick={onNewChat}>
        <Plus size={18} strokeWidth={2.4} aria-hidden="true" />
        New conversation
      </button>

      <nav className="sidebar-section" aria-label="Workspace">
        <p className="sidebar-label">Workspace</p>

        <button className="sidebar-link active" aria-current="page">
          <MessagesSquare size={18} aria-hidden="true" />
          SOP Assistant
        </button>

        <button className="sidebar-link" disabled>
          <Files size={18} aria-hidden="true" />
          Documents
          <span className="soon-badge">Soon</span>
        </button>

        <button className="sidebar-link" disabled>
          <History size={18} aria-hidden="true" />
          Recent activity
          <span className="soon-badge">Soon</span>
        </button>
      </nav>

      <div className="sidebar-bottom">
        <div className="index-status" role="status">
          <span className="status-dot" aria-hidden="true" />
          <div>
            <strong>Knowledge base</strong>
            <p>Ready for questions</p>
          </div>
        </div>

        <div className="sidebar-user">
          <div className="user-avatar" aria-hidden="true">
            SF
          </div>
          <div>
            <strong>Shop-floor user</strong>
            <p>Supervisor workspace</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
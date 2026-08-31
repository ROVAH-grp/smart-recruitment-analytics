import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 32px", textAlign: "center" }}>
      <div style={{
        width: 56, height: 56, borderRadius: 14,
        background: "var(--bg-elevated)", border: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 16, color: "var(--text-tertiary)",
      }}>
        {icon ?? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
          </svg>
        )}
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 6, letterSpacing: "-0.2px" }}>{title}</div>
      {description && <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, maxWidth: 300 }}>{description}</div>}
      {action && (
        <button
          onClick={action.onClick}
          style={{
            marginTop: 20, padding: "8px 18px", borderRadius: 8,
            background: "var(--accent)", color: "#fff", border: "none",
            fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
          }}
        >{action.label}</button>
      )}
    </div>
  );
}

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 32px", textAlign: "center" }}>
      <div style={{
        width: 56, height: 56, borderRadius: 14,
        background: "var(--red-light)", border: "1px solid var(--red-border)",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 16, color: "var(--red)",
      }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>Something went wrong</div>
      <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>We couldn't load the data. Please try again.</div>
      {onRetry && (
        <button onClick={onRetry} style={{ marginTop: 20, padding: "8px 18px", borderRadius: 8, background: "var(--red)", color: "#fff", border: "none", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
          Try Again
        </button>
      )}
    </div>
  );
}

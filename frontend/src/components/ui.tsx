import { useCallback, useEffect, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

/* ------------------------------------------------------------------ *
 * Small building blocks shared by the pipeline screens.
 * They use the same CSS variables as the rest of RecruitFlow, so light
 * and dark mode work without extra code.
 * ------------------------------------------------------------------ */

/** The API reports errors as JSON text such as {"statusCode":400,"message":"..."}. */
export function errorMessage(error: unknown, fallback = "Something went wrong."): string {
  if (!(error instanceof Error)) return fallback;
  const text = error.message;
  try {
    const parsed = JSON.parse(text) as { message?: string | string[] };
    if (Array.isArray(parsed.message)) return parsed.message.join(". ");
    if (parsed.message) return parsed.message;
  } catch {
    /* not JSON: use the text as it is */
  }
  return text || fallback;
}

export function fmtDate(value?: string | null): string {
  if (!value) return "—";
  const date = new Date(value.length === 10 ? `${value}T00:00:00` : value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function fmtDateTime(value?: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function money(amount: string | number, currency: string, period: string): string {
  const number = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(Number(amount));
  return `${currency} ${number} ${period === "Monthly" ? "per month" : "per year"}`;
}

/** Loads data when a screen opens and lets it be reloaded after an action. */
export function useLoad<T>(load: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(load, deps);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await run());
    } catch (e) {
      setError(errorMessage(e, "Could not load the data."));
    } finally {
      setLoading(false);
    }
  }, [run]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { data, error, loading, reload, setData };
}

/* ---------------------------- visuals ----------------------------- */

type Tone = "accent" | "green" | "red" | "amber" | "neutral";

const TONES: Record<Tone, { bg: string; fg: string; border: string }> = {
  accent: { bg: "var(--accent-light)", fg: "var(--accent-text)", border: "var(--accent-glow)" },
  green: { bg: "var(--green-light)", fg: "var(--green)", border: "var(--green-border)" },
  red: { bg: "var(--red-light)", fg: "var(--red)", border: "var(--red-border)" },
  amber: { bg: "var(--amber-light)", fg: "var(--amber)", border: "var(--amber-border)" },
  neutral: { bg: "var(--bg-elevated)", fg: "var(--text-secondary)", border: "var(--border)" },
};

export function Pill({ children, tone = "neutral" }: { children: ReactNode; tone?: Tone }) {
  const t = TONES[tone];
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 9px",
        borderRadius: 99,
        fontSize: 11.5,
        fontWeight: 600,
        background: t.bg,
        color: t.fg,
        border: `1px solid ${t.border}`,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

export function statusTone(status: string): Tone {
  const s = status.toUpperCase();
  if (["ACCEPTED", "COMPLETED", "PASS", "SENT", "ACTIVE", "SELECTED", "JOINED", "DONE"].includes(s)) return "green";
  if (["REJECTED", "FAILED", "DECLINED", "FAIL", "CANCELLED", "WITHDRAWN"].includes(s)) return "red";
  if (["PENDING", "PROPOSED", "SKIPPED", "EXPIRED", "ONBOARDING"].includes(s)) return "amber";
  if (["SCHEDULED", "OFFERED"].includes(s)) return "accent";
  return "neutral";
}

export function Notice({
  kind = "info",
  children,
}: {
  kind?: "info" | "success" | "error";
  children: ReactNode;
}) {
  const tone: Tone = kind === "error" ? "red" : kind === "success" ? "green" : "accent";
  const t = TONES[tone];
  return (
    <div
      role={kind === "error" ? "alert" : "status"}
      style={{
        padding: "10px 12px",
        borderRadius: 8,
        fontSize: 13,
        lineHeight: 1.5,
        background: t.bg,
        color: t.fg,
        border: `1px solid ${t.border}`,
      }}
    >
      {children}
    </div>
  );
}

export function Panel({
  title,
  action,
  children,
  style,
}: {
  title?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <section
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        boxShadow: "var(--shadow-sm)",
        padding: 18,
        ...style,
      }}
    >
      {(title || action) && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.1px" }}>{title}</h3>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function Stat({
  label,
  value,
  hint,
  tone = "neutral",
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  tone?: Tone;
}) {
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: "14px 16px",
        borderLeft: `3px solid ${TONES[tone === "neutral" ? "accent" : tone].fg}`,
      }}
    >
      <div style={{ fontSize: 24, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.6px", lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 500, marginTop: 4 }}>{label}</div>
      {hint && <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 2 }}>{hint}</div>}
    </div>
  );
}

export function Loading({ text = "Loading..." }: { text?: string }) {
  return <div style={{ padding: 24, color: "var(--text-secondary)", fontSize: 13 }}>{text}</div>;
}

export function Empty({ children }: { children: ReactNode }) {
  return (
    <div style={{ padding: "20px 8px", color: "var(--text-tertiary)", fontSize: 13, textAlign: "center" }}>{children}</div>
  );
}

/* ----------------------------- controls --------------------------- */

export const inputStyle: CSSProperties = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: 8,
  border: "1px solid var(--border)",
  background: "var(--surface)",
  color: "var(--text)",
  fontSize: 13,
  fontFamily: "inherit",
  outline: "none",
};

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label style={{ display: "block", marginBottom: 12 }}>
      <span style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 5 }}>
        {label}
      </span>
      {children}
      {hint && <span style={{ display: "block", fontSize: 11, color: "var(--text-tertiary)", marginTop: 3 }}>{hint}</span>}
    </label>
  );
}

type ButtonKind = "primary" | "ghost" | "danger" | "success";

export function Btn({
  children,
  onClick,
  kind = "primary",
  disabled,
  small,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  kind?: ButtonKind;
  disabled?: boolean;
  small?: boolean;
  type?: "button" | "submit";
}) {
  const colours: Record<ButtonKind, CSSProperties> = {
    primary: { background: "var(--accent)", color: "#fff", border: "1px solid var(--accent)" },
    success: { background: "var(--green)", color: "#fff", border: "1px solid var(--green)" },
    danger: { background: "var(--surface)", color: "var(--red)", border: "1px solid var(--red-border)" },
    ghost: { background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)" },
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...colours[kind],
        padding: small ? "5px 11px" : "8px 16px",
        fontSize: small ? 12 : 13,
        fontWeight: 600,
        borderRadius: 8,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.55 : 1,
        fontFamily: "inherit",
      }}
    >
      {children}
    </button>
  );
}

/** Runs an async action with a busy flag and a message, so each button stays simple. */
export function useAction() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const run = useCallback(async (work: () => Promise<string | void>) => {
    setBusy(true);
    setError(null);
    setSuccess(null);
    try {
      const message = await work();
      if (message) setSuccess(message);
      return true;
    } catch (e) {
      setError(errorMessage(e));
      return false;
    } finally {
      setBusy(false);
    }
  }, []);

  return { busy, error, success, run, clear: () => { setError(null); setSuccess(null); } };
}

export function Messages({ error, success }: { error: string | null; success: string | null }) {
  if (!error && !success) return null;
  return (
    <div style={{ margin: "10px 0" }}>
      {error && <Notice kind="error">{error}</Notice>}
      {success && <Notice kind="success">{success}</Notice>}
    </div>
  );
}

export function Modal({
  title,
  onClose,
  children,
  width = 760,
}: {
  title: ReactNode;
  onClose: () => void;
  children: ReactNode;
  width?: number;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.55)",
        zIndex: 300,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        overflowY: "auto",
        padding: "40px 16px",
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: width,
          background: "var(--bg)",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-md)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 18px",
            borderBottom: "1px solid var(--border)",
            background: "var(--surface)",
            borderRadius: "var(--radius-md) var(--radius-md) 0 0",
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>{title}</div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{ border: "none", background: "transparent", fontSize: 20, cursor: "pointer", color: "var(--text-secondary)" }}
          >
            ×
          </button>
        </div>
        <div style={{ padding: 18 }}>{children}</div>
      </div>
    </div>
  );
}

export function Tabs({
  tabs,
  active,
  onChange,
}: {
  tabs: Array<{ id: string; label: string }>;
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div role="tablist" style={{ display: "flex", gap: 4, borderBottom: "1px solid var(--border)", marginBottom: 18, flexWrap: "wrap" }}>
      {tabs.map((tab) => {
        const on = tab.id === active;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={on}
            onClick={() => onChange(tab.id)}
            style={{
              padding: "9px 14px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: 13,
              fontWeight: on ? 700 : 500,
              color: on ? "var(--accent-text)" : "var(--text-secondary)",
              borderBottom: `2px solid ${on ? "var(--accent)" : "transparent"}`,
              marginBottom: -1,
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

/** Vertical list of what happened to an application, oldest first. */
export function Timeline({
  events,
}: {
  events: Array<{ title: ReactNode; detail?: string | null; meta?: string }>;
}) {
  if (!events.length) return <Empty>No history yet.</Empty>;
  return (
    <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
      {events.map((event, i) => (
        <li key={i} style={{ display: "flex", gap: 12, paddingBottom: 12, position: "relative" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--accent)", marginTop: 4 }} />
            {i < events.length - 1 && <span style={{ flex: 1, width: 2, background: "var(--border)", marginTop: 2 }} />}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{event.title}</div>
            {event.detail && <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{event.detail}</div>}
            {event.meta && <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{event.meta}</div>}
          </div>
        </li>
      ))}
    </ol>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return <div style={{ padding: 24, maxWidth: 1180, margin: "0 auto" }}>{children}</div>;
}

export const tableStyles = {
  table: { width: "100%", borderCollapse: "collapse" as const, fontSize: 13 },
  th: {
    textAlign: "left" as const,
    padding: "8px 10px",
    fontSize: 11.5,
    fontWeight: 700,
    color: "var(--text-secondary)",
    borderBottom: "1px solid var(--border)",
    textTransform: "uppercase" as const,
    letterSpacing: "0.4px",
  },
  td: { padding: "9px 10px", borderBottom: "1px solid var(--border-light)", color: "var(--text)", verticalAlign: "top" as const },
};

export function Pager({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 8, marginTop: 12 }}>
      <Btn small kind="ghost" disabled={page <= 1} onClick={() => onChange(page - 1)}>Previous</Btn>
      <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>Page {page} of {totalPages}</span>
      <Btn small kind="ghost" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>Next</Btn>
    </div>
  );
}

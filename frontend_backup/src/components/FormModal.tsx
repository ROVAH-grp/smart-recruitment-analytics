import { useState, type ReactNode } from "react";

export interface FieldDef {
  key: string;
  label: string;
  type?: "text" | "email" | "number" | "date" | "datetime-local" | "select" | "textarea";
  placeholder?: string;
  options?: string[];
  required?: boolean;
}

interface FormModalProps {
  title: string;
  subtitle?: string;
  fields: FieldDef[];
  onClose: () => void;
  onSubmit: (data: Record<string, string>) => void;
  submitLabel?: string;
  icon?: ReactNode;
}

export default function FormModal({ title, subtitle, fields, onClose, onSubmit, submitLabel = "Save", icon }: FormModalProps) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map(f => [f.key, ""]))
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const set = (k: string, v: string) => {
    setValues(p => ({ ...p, [k]: v }));
    if (errors[k]) setErrors(p => ({ ...p, [k]: "" }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    fields.forEach(f => {
      if (f.required !== false && !values[f.key]?.trim()) {
        errs[f.key] = `${f.label} is required`;
      }
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 600));
    onSubmit(values);
    setSubmitting(false);
    onClose();
  };

  return (
    <div
      className="fade-in-fast"
      style={{ position: "fixed", inset: 0, background: "rgba(5,10,20,0.55)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(3px)" }}
      onClick={onClose}
    >
      <div
        className="scale-in"
        style={{ background: "var(--surface)", borderRadius: "var(--radius-lg)", padding: "24px 26px 22px", width: 460, maxWidth: "95vw", maxHeight: "88vh", overflow: "auto", boxShadow: "var(--shadow-lg)", border: "1px solid var(--border)" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            {icon && (
              <div style={{ width: 38, height: 38, borderRadius: 10, background: "var(--accent-light)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {icon}
              </div>
            )}
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", margin: 0, letterSpacing: "-0.3px" }}>{title}</h2>
              {subtitle && <p style={{ fontSize: 12.5, color: "var(--text-secondary)", margin: "3px 0 0" }}>{subtitle}</p>}
            </div>
          </div>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 7, border: "1px solid var(--border)", background: "var(--bg-elevated)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--text-secondary)", flexShrink: 0 }}>
            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" width="10" height="10"><line x1="2" y1="2" x2="10" y2="10"/><line x1="10" y1="2" x2="2" y2="10"/></svg>
          </button>
        </div>

        {/* Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {fields.map(f => (
            <div key={f.key}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 5, letterSpacing: "0.1px" }}>
                {f.label} {f.required !== false && <span style={{ color: "var(--red)" }}>*</span>}
              </label>

              {f.type === "select" ? (
                <select
                  value={values[f.key]}
                  onChange={e => set(f.key, e.target.value)}
                  style={{ width: "100%", border: `1px solid ${errors[f.key] ? "var(--red)" : "var(--border)"}`, borderRadius: 7, padding: "9px 12px", fontSize: 13.5, fontFamily: "inherit", color: values[f.key] ? "var(--text)" : "var(--text-tertiary)", background: "var(--bg-elevated)" }}
                >
                  <option value="">{f.placeholder || `Select ${f.label}`}</option>
                  {f.options?.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : f.type === "textarea" ? (
                <textarea
                  value={values[f.key]}
                  onChange={e => set(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  rows={3}
                  style={{ width: "100%", border: `1px solid ${errors[f.key] ? "var(--red)" : "var(--border)"}`, borderRadius: 7, padding: "9px 12px", fontSize: 13.5, fontFamily: "inherit", color: "var(--text)", background: "var(--bg-elevated)", resize: "vertical" }}
                />
              ) : (
                <input
                  type={f.type ?? "text"}
                  value={values[f.key]}
                  onChange={e => set(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  style={{ width: "100%", border: `1px solid ${errors[f.key] ? "var(--red)" : "var(--border)"}`, borderRadius: 7, padding: "9px 12px", fontSize: 13.5, fontFamily: "inherit", color: "var(--text)", background: "var(--bg-elevated)" }}
                />
              )}

              {errors[f.key] && (
                <p style={{ fontSize: 11.5, color: "var(--red)", margin: "4px 0 0", display: "flex", alignItems: "center", gap: 4 }}>
                  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" width="10" height="10"><circle cx="6" cy="6" r="5"/><line x1="6" y1="4" x2="6" y2="6.5"/><circle cx="6" cy="8.5" r="0.5" fill="currentColor" stroke="none"/></svg>
                  {errors[f.key]}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "10px", border: "1px solid var(--border)", borderRadius: 8, background: "transparent", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", color: "var(--text-secondary)" }}>
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="btn-press"
            style={{ flex: 1.4, padding: "10px", border: "none", borderRadius: 8, background: submitting ? "var(--accent-dark)" : "var(--accent)", color: "#fff", fontSize: 13.5, fontWeight: 700, cursor: submitting ? "wait" : "pointer", fontFamily: "inherit", boxShadow: "var(--shadow-accent)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
          >
            {submitting ? (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2.5" strokeLinecap="round" width="15" height="15" style={{ animation: "spin 0.8s linear infinite" }}>
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.3"/>
                  <path d="M12 2a10 10 0 0 1 10 10"/>
                </svg>
                Saving…
              </>
            ) : submitLabel}
          </button>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ── Confirm Dialog ── */
interface ConfirmProps {
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ title, message, confirmLabel = "Confirm", danger = false, onConfirm, onCancel }: ConfirmProps) {
  return (
    <div className="fade-in-fast" style={{ position: "fixed", inset: 0, background: "rgba(5,10,20,0.55)", zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(3px)" }} onClick={onCancel}>
      <div className="scale-in" style={{ background: "var(--surface)", borderRadius: "var(--radius-lg)", padding: "24px 26px", width: 380, boxShadow: "var(--shadow-lg)", border: "1px solid var(--border)" }} onClick={e => e.stopPropagation()}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: danger ? "var(--red-light)" : "var(--accent-light)", color: danger ? "var(--red)" : "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
          {danger ? (
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M10 2L1 18h18L10 2z"/><line x1="10" y1="8" x2="10" y2="12"/><circle cx="10" cy="15" r="0.5" fill="currentColor" stroke="none"/></svg>
          ) : (
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><circle cx="10" cy="10" r="9"/><line x1="10" y1="7" x2="10" y2="11"/><circle cx="10" cy="13.5" r="0.5" fill="currentColor" stroke="none"/></svg>
          )}
        </div>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", margin: "0 0 8px", letterSpacing: "-0.2px" }}>{title}</h2>
        <p style={{ fontSize: 13.5, color: "var(--text-secondary)", margin: "0 0 22px", lineHeight: 1.6 }}>{message}</p>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: "9px", border: "1px solid var(--border)", borderRadius: 8, background: "transparent", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", color: "var(--text-secondary)" }}>Cancel</button>
          <button onClick={() => { onConfirm(); onCancel(); }} style={{ flex: 1, padding: "9px", border: "none", borderRadius: 8, background: danger ? "var(--red)" : "var(--accent)", color: "#fff", fontSize: 13.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

/* ── Toast Notification ── */
interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
}

export function Toast({ message, type = "success", onClose }: ToastProps) {
  const configs = {
    success: { bg: "var(--green-light)", color: "var(--green)", border: "var(--green-border)", icon: "✓" },
    error:   { bg: "var(--red-light)",   color: "var(--red)",   border: "var(--red-border)",   icon: "✕" },
    info:    { bg: "var(--accent-light)", color: "var(--accent)", border: "var(--accent-glow)", icon: "ℹ" },
  };
  const c = configs[type];

  return (
    <div className="scale-in" style={{ position: "fixed", bottom: 24, right: 24, zIndex: 500, display: "flex", alignItems: "center", gap: 12, padding: "12px 18px 12px 14px", borderRadius: "var(--radius-md)", background: "var(--surface)", border: `1px solid ${c.border}`, boxShadow: "var(--shadow-md)", maxWidth: 340 }}>
      <div style={{ width: 26, height: 26, borderRadius: 7, background: c.bg, color: c.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{c.icon}</div>
      <span style={{ fontSize: 13.5, color: "var(--text)", fontWeight: 500, flex: 1 }}>{message}</span>
      <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-tertiary)", display: "flex", padding: 0 }}>
        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="10" height="10"><line x1="2" y1="2" x2="10" y2="10"/><line x1="10" y1="2" x2="2" y2="10"/></svg>
      </button>
    </div>
  );
}

import { useState } from "react";
import { applications } from "../data/mockData";
import Badge from "../components/Badge";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import EmptyState from "../components/EmptyState";
import ApplicationDetail from "./ApplicationDetail";

const PAGE_SIZE = 7;

const STATUSES = ["all", "applied", "screened", "shortlisted", "interviewed", "selected", "offered", "joined", "rejected"];

function MatchBar({ score }: { score: number }) {
  const color = score >= 85 ? "var(--green)" : score >= 70 ? "var(--amber)" : "var(--red)";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
      <div style={{ height: 4, width: 48, background: "var(--border-light)", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${score}%`, background: color, borderRadius: 99 }} />
      </div>
      <span style={{ fontSize: 12.5, fontWeight: 700, color, fontVariantNumeric: "tabular-nums" }}>{score}%</span>
    </div>
  );
}

function Avatar({ name, size = 30 }: { name: string; size?: number }) {
  const hue = (name.charCodeAt(0) * 47 + name.charCodeAt(1) * 13) % 360;
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.28,
      background: `hsl(${hue}, 55%, 92%)`,
      color: `hsl(${hue}, 55%, 38%)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.4, fontWeight: 700, flexShrink: 0,
    }}>{name[0]}</div>
  );
}

export default function Applications() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState<string | null>(null);
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const filtered = applications.filter(a => {
    const q = search.toLowerCase();
    const matchQ = !q || a.candidate.toLowerCase().includes(q) || a.job.toLowerCase().includes(q) || a.id.toLowerCase().includes(q) || a.source.toLowerCase().includes(q);
    const matchS = status === "all" || a.status === status;
    return matchQ && matchS;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const selectedApp = applications.find(a => a.id === selected);
  if (selected && selectedApp) {
    return <ApplicationDetail app={selectedApp} onBack={() => setSelected(null)} />;
  }

  const counts = STATUSES.slice(1).reduce((acc, s) => {
    acc[s] = applications.filter(a => a.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  function sortHeader(col: string, label: string) {
    const active = sortCol === col;
    return (
      <button onClick={() => { setSortCol(col); setSortDir(d => active ? (d === "asc" ? "desc" : "asc") : "asc"); }} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontFamily: "inherit", fontSize: 11.5, fontWeight: 600, color: active ? "var(--accent)" : "var(--text-secondary)", padding: 0, letterSpacing: "0.3px", textTransform: "uppercase" }}>
        {label}
        <span style={{ opacity: active ? 1 : 0.3, fontSize: 9 }}>{active && sortDir === "desc" ? "▼" : "▲"}</span>
      </button>
    );
  }

  return (
    <div className="fade-in" style={{ padding: "24px 24px 48px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800, color: "var(--text)", margin: "0 0 3px", letterSpacing: "-0.5px" }}>Applications</h1>
          <p style={{ fontSize: 12.5, color: "var(--text-secondary)", margin: 0 }}>{applications.length} total · {applications.filter(a => a.status === "joined").length} joined · {applications.filter(a => ["applied", "screened", "shortlisted", "interviewed"].includes(a.status)).length} active</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-press"
          style={{
            display: "flex", alignItems: "center", gap: 7,
            background: "var(--accent)", color: "#fff", border: "none",
            borderRadius: 9, padding: "9px 16px", fontSize: 13.5, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit",
            boxShadow: "0 2px 10px var(--accent-shadow)",
          }}
        >
          <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="13" height="13"><line x1="7" y1="1" x2="7" y2="13"/><line x1="1" y1="7" x2="13" y2="7"/></svg>
          Add Application
        </button>
      </div>

      {/* Status pill tabs */}
      <div style={{ display: "flex", gap: 5, marginBottom: 14, flexWrap: "wrap" }}>
        {STATUSES.map(s => (
          <button
            key={s}
            onClick={() => { setStatus(s); setPage(1); }}
            style={{
              padding: "4px 12px", borderRadius: 99, border: "1px solid",
              borderColor: status === s ? "var(--accent)" : "var(--border)",
              background: status === s ? "var(--accent-light)" : "var(--surface)",
              color: status === s ? "var(--accent)" : "var(--text-secondary)",
              fontSize: 12, fontWeight: status === s ? 700 : 500, cursor: "pointer", fontFamily: "inherit",
              transition: "all 0.12s ease",
            }}
          >
            {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            {s !== "all" && counts[s] > 0 && (
              <span style={{ marginLeft: 5, fontSize: 10.5, fontWeight: 700 }}>{counts[s]}</span>
            )}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <SearchBar value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search candidate, job, ID…" width={240} />
      </div>

      {/* Table */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-elevated)" }}>
                {[
                  ["id", "ID"], ["candidate", "Candidate"], ["job", "Position"],
                  ["recruiter", "Recruiter"], ["source", "Source"], ["status", "Status"],
                  ["matchScore", "Match"], ["joiningDate", "Joining"], ["actions", ""]
                ].map(([col, lbl]) => (
                  <th key={col} style={{ padding: "10px 16px", textAlign: "left" }}>
                    {col !== "actions" ? sortHeader(col, lbl) : null}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={9}>
                  <EmptyState
                    title="No applications found"
                    description={search || status !== "all" ? "Try adjusting your search or filter." : "No applications have been submitted yet."}
                    action={status !== "all" ? { label: "Clear filter", onClick: () => { setStatus("all"); setSearch(""); } } : undefined}
                    icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>}
                  />
                </td></tr>
              ) : paginated.map((app, i) => (
                <tr
                  key={app.id}
                  style={{ borderBottom: i < paginated.length - 1 ? "1px solid var(--border-light)" : "none", transition: "background 0.1s", cursor: "default" }}
                  onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = "var(--bg-elevated)"}
                  onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = "transparent"}
                >
                  {/* ID */}
                  <td style={{ padding: "11px 16px" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--text-tertiary)", letterSpacing: "-0.2px" }}>{app.id}</span>
                  </td>

                  {/* Candidate */}
                  <td style={{ padding: "11px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <Avatar name={app.candidate} />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", letterSpacing: "-0.15px" }}>{app.candidate}</div>
                        <div style={{ fontSize: 11.5, color: "var(--text-tertiary)" }}>{app.dept}</div>
                      </div>
                    </div>
                  </td>

                  {/* Job */}
                  <td style={{ padding: "11px 16px", maxWidth: 200 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", letterSpacing: "-0.1px" }}>{app.job}</div>
                  </td>

                  {/* Recruiter */}
                  <td style={{ padding: "11px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Avatar name={app.recruiter} size={22} />
                      <span style={{ fontSize: 12.5, color: "var(--text-secondary)" }}>{app.recruiter.split(" ")[0]}</span>
                    </div>
                  </td>

                  {/* Source */}
                  <td style={{ padding: "11px 16px" }}>
                    <span style={{ fontSize: 12, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 5 }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--accent)", opacity: 0.7 }} />
                      {app.source}
                    </span>
                  </td>

                  {/* Status */}
                  <td style={{ padding: "11px 16px" }}><Badge status={app.status} dot /></td>

                  {/* Match */}
                  <td style={{ padding: "11px 16px" }}><MatchBar score={app.matchScore} /></td>

                  {/* Joining */}
                  <td style={{ padding: "11px 16px" }}>
                    <span style={{ fontSize: app.joiningDate ? 12 : 12.5, color: app.joiningDate ? "var(--text)" : "var(--text-tertiary)", fontFamily: app.joiningDate ? "var(--font-mono)" : "inherit" }}>{app.joiningDate || "—"}</span>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: "11px 16px" }}>
                    <div style={{ display: "flex", gap: 5 }}>
                      <button
                        onClick={() => setSelected(app.id)}
                        style={{ padding: "4px 11px", borderRadius: 6, border: "1px solid var(--accent-light)", background: "var(--accent-light)", fontSize: 12, color: "var(--accent)", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.12s" }}
                      >View</button>
                      <button
                        onClick={() => setShowConfirm(app.id)}
                        style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid var(--border)", background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--text-tertiary)" }}
                      >
                        <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="12" height="12"><polyline points="1,4 13,4"/><path d="M11 4v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4"/><path d="M5 4V2h4v2"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} total={filtered.length} pageSize={PAGE_SIZE} />
      </div>

      {/* Add Modal */}
      {showModal && (
        <Modal title="Add New Application" onClose={() => setShowModal(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { label: "Candidate Name", placeholder: "e.g. Riya Desai", type: "text" },
              { label: "Job Position", placeholder: "e.g. Senior Engineer", type: "text" },
              { label: "Recruiter", placeholder: "e.g. Sarah Mitchell", type: "text" },
              { label: "Source", placeholder: "e.g. LinkedIn", type: "text" },
            ].map(f => (
              <div key={f.label}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 5, letterSpacing: "0.1px" }}>{f.label}</label>
                <input placeholder={f.placeholder} type={f.type} style={{ width: "100%", border: "1px solid var(--border)", borderRadius: 7, padding: "9px 12px", fontSize: 13.5, fontFamily: "inherit", color: "var(--text)", background: "var(--bg-elevated)", transition: "border 0.15s" }} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: "10px", border: "1px solid var(--border)", borderRadius: 8, background: "transparent", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", color: "var(--text-secondary)" }}>Cancel</button>
            <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: "10px", border: "none", borderRadius: 8, background: "var(--accent)", color: "#fff", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 2px 8px var(--accent-shadow)" }}>Add Application</button>
          </div>
        </Modal>
      )}

      {/* Confirm delete */}
      {showConfirm && (
        <Modal title="Delete Application" onClose={() => setShowConfirm(null)} width={380}>
          <p style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.6, margin: "0 0 20px" }}>
            Are you sure you want to delete application <strong style={{ color: "var(--text)" }}>{showConfirm}</strong>? This action cannot be undone.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setShowConfirm(null)} style={{ flex: 1, padding: "10px", border: "1px solid var(--border)", borderRadius: 8, background: "transparent", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", color: "var(--text-secondary)" }}>Cancel</button>
            <button onClick={() => setShowConfirm(null)} style={{ flex: 1, padding: "10px", border: "none", borderRadius: 8, background: "var(--red)", color: "#fff", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Delete</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export function Modal({ title, children, onClose, width = 440 }: { title: string; children: React.ReactNode; onClose: () => void; width?: number }) {
  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(17,24,39,0.45)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(2px)" }}
      onClick={onClose}
    >
      <div
        style={{ background: "var(--surface)", borderRadius: "var(--radius-lg)", padding: "24px 26px 22px", width, boxShadow: "var(--shadow-lg)", border: "1px solid var(--border)" }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", margin: 0, letterSpacing: "-0.3px" }}>{title}</h2>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 7, border: "1px solid var(--border)", background: "var(--bg-elevated)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--text-secondary)" }}>
            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="10" height="10"><line x1="2" y1="2" x2="10" y2="10"/><line x1="10" y1="2" x2="2" y2="10"/></svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

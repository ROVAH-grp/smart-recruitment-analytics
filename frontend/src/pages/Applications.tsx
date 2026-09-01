import { useState } from "react";
import { applications } from "../data/mockData";
import Badge from "../components/Badge";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import EmptyState from "../components/EmptyState";
import FormModal, { ConfirmDialog, Toast } from "../components/FormModal";
import { exportToCsv } from "../utils/exportCsv";
import ApplicationDetail from "./ApplicationDetail";

const PAGE_SIZE = 7;
const STATUSES = ["all", "applied", "screened", "shortlisted", "interviewed", "selected", "offered", "joined", "rejected"];

const APP_FIELDS = [
  { key: "candidate",  label: "Candidate Name",   placeholder: "e.g. Riya Desai" },
  { key: "job",        label: "Job Position",      placeholder: "e.g. Senior Frontend Engineer" },
  { key: "dept",       label: "Department",        type: "select" as const, options: ["Engineering", "Sales", "Marketing", "Design", "Operations", "Finance", "HR"] },
  { key: "recruiter",  label: "Recruiter",         type: "select" as const, options: ["Sarah Mitchell", "James Watson", "Emily Clarke"] },
  { key: "source",     label: "Source",            type: "select" as const, options: ["LinkedIn", "Indeed", "Referral", "Company Website", "Naukri", "Other"] },
  { key: "matchScore", label: "Match Score (%)",   type: "number" as const, placeholder: "e.g. 82" },
];

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
  const hue = (name.charCodeAt(0) * 47 + (name.charCodeAt(1) || 0) * 13) % 360;
  return (
    <div style={{ width: size, height: size, borderRadius: size * 0.28, background: `hsl(${hue},55%,92%)`, color: `hsl(${hue},55%,35%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.4, fontWeight: 700, flexShrink: 0 }}>
      {name[0]}
    </div>
  );
}

export default function Applications() {
  const [list, setList] = useState(applications);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const filtered = list.filter(a => {
    const q = search.toLowerCase();
    const mQ = !q || a.candidate.toLowerCase().includes(q) || a.job.toLowerCase().includes(q) || a.id.toLowerCase().includes(q) || a.source.toLowerCase().includes(q);
    const mS = status === "all" || a.status === status;
    return mQ && mS;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const counts = STATUSES.slice(1).reduce((acc, s) => { acc[s] = list.filter(a => a.status === s).length; return acc; }, {} as Record<string, number>);

  const selectedApp = list.find(a => a.id === selected);
  if (selected && selectedApp) return <ApplicationDetail app={selectedApp} onBack={() => setSelected(null)} />;

  const handleAdd = (data: Record<string, string>) => {
    const newApp = {
      id: `APP${String(list.length + 1).padStart(3, "0")}`,
      candidate: data.candidate, candidateId: `C${String(list.length + 1).padStart(3, "0")}`,
      job: data.job, jobId: `J001`,
      recruiter: data.recruiter, source: data.source,
      status: "applied", matchScore: Number(data.matchScore) || 70,
      appliedDate: new Date().toISOString().split("T")[0],
      joiningDate: null, dept: data.dept,
      interviewScore: null, offerStatus: null, cost: 0,
    };
    setList(p => [...p, newApp]);
    showToast(`Application from "${data.candidate}" added!`);
  };

  const handleDelete = (id: string) => {
    setList(p => p.filter(a => a.id !== id));
    showToast("Application removed.", "error");
  };

  return (
    <div className="fade-in" style={{ padding: "24px 24px 48px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: "var(--text)", margin: "0 0 3px", letterSpacing: "-0.5px" }}>Applications</h1>
          <p style={{ fontSize: 12.5, color: "var(--text-secondary)", margin: 0 }}>
            {list.length} total · {list.filter(a => a.status === "joined").length} joined · {list.filter(a => ["applied","screened","shortlisted","interviewed"].includes(a.status)).length} active
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => exportToCsv("applications.csv", list as unknown as Record<string, unknown>[])}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", borderRadius: 9, border: "1px solid var(--border)", background: "var(--surface)", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", cursor: "pointer", fontFamily: "inherit" }}
          >
            <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12"><path d="M7 1v8M4 6l3 3 3-3"/><path d="M1 10v2a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-2"/></svg>
            Export
          </button>
          <button
            onClick={() => setShowAdd(true)}
            className="btn-press"
            style={{ display: "flex", alignItems: "center", gap: 7, background: "var(--accent)", color: "#fff", border: "none", borderRadius: 9, padding: "9px 16px", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", boxShadow: "var(--shadow-accent)" }}
          >
            <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="13" height="13"><line x1="7" y1="1" x2="7" y2="13"/><line x1="1" y1="7" x2="13" y2="7"/></svg>
            Add Application
          </button>
        </div>
      </div>

      {/* Status tabs + search */}
      <div style={{ display: "flex", gap: 5, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
        {STATUSES.map(s => (
          <button
            key={s}
            onClick={() => { setStatus(s); setPage(1); }}
            style={{ padding: "4px 12px", borderRadius: 99, border: "1px solid", borderColor: status === s ? "var(--accent)" : "var(--border)", background: status === s ? "var(--accent-light)" : "var(--surface)", color: status === s ? "var(--accent-text)" : "var(--text-secondary)", fontSize: 12, fontWeight: status === s ? 700 : 500, cursor: "pointer", fontFamily: "inherit" }}
          >
            {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            {s !== "all" && counts[s] > 0 && <span style={{ marginLeft: 4, fontSize: 10.5, fontWeight: 700 }}>({counts[s]})</span>}
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
                {["ID", "Candidate", "Position", "Recruiter", "Source", "Status", "Match", "Joining", ""].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11.5, fontWeight: 600, color: "var(--text-secondary)", letterSpacing: "0.3px", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={9}>
                  <EmptyState
                    title="No applications found"
                    description={search || status !== "all" ? "Try adjusting your search or filter." : "No applications yet."}
                    action={status !== "all" || search ? { label: "Clear filters", onClick: () => { setStatus("all"); setSearch(""); } } : undefined}
                  />
                </td></tr>
              ) : paginated.map((app, i) => (
                <tr key={app.id}
                  style={{ borderBottom: i < paginated.length - 1 ? "1px solid var(--border-light)" : "none", transition: "background 0.1s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = "var(--bg-elevated)"}
                  onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = "transparent"}
                >
                  <td style={{ padding: "11px 16px" }}><span style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--text-tertiary)" }}>{app.id}</span></td>
                  <td style={{ padding: "11px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <Avatar name={app.candidate} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{app.candidate}</div>
                        <div style={{ fontSize: 11.5, color: "var(--text-tertiary)" }}>{app.dept}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "11px 16px", maxWidth: 180 }}><div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{app.job}</div></td>
                  <td style={{ padding: "11px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Avatar name={app.recruiter} size={22} />
                      <span style={{ fontSize: 12.5, color: "var(--text-secondary)" }}>{app.recruiter.split(" ")[0]}</span>
                    </div>
                  </td>
                  <td style={{ padding: "11px 16px" }}><span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{app.source}</span></td>
                  <td style={{ padding: "11px 16px" }}><Badge status={app.status} dot /></td>
                  <td style={{ padding: "11px 16px" }}><MatchBar score={app.matchScore} /></td>
                  <td style={{ padding: "11px 16px" }}><span style={{ fontSize: app.joiningDate ? 12 : 12.5, color: app.joiningDate ? "var(--text)" : "var(--text-tertiary)", fontFamily: app.joiningDate ? "var(--font-mono)" : "inherit" }}>{app.joiningDate || "—"}</span></td>
                  <td style={{ padding: "11px 16px" }}>
                    <div style={{ display: "flex", gap: 5 }}>
                      <button onClick={() => setSelected(app.id)} style={{ padding: "4px 11px", borderRadius: 6, border: "1px solid var(--accent-light)", background: "var(--accent-light)", fontSize: 12, color: "var(--accent-text)", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>View</button>
                      <button onClick={() => setDeleteId(app.id)} style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid var(--border)", background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--text-tertiary)" }}>
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

      {showAdd && (
        <FormModal
          title="Add Application"
          subtitle="Register a new candidate application"
          fields={APP_FIELDS}
          onClose={() => setShowAdd(false)}
          onSubmit={handleAdd}
          submitLabel="Add Application"
          icon={<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><path d="M12 2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6z"/><polyline points="12,2 12,6 16,6"/></svg>}
        />
      )}

      {deleteId && (
        <ConfirmDialog
          title="Delete Application"
          message={`Are you sure you want to delete application ${deleteId}? This cannot be undone.`}
          confirmLabel="Delete"
          danger
          onConfirm={() => handleDelete(deleteId)}
          onCancel={() => setDeleteId(null)}
        />
      )}

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

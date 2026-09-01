import { useState } from "react";
import { candidates } from "../data/mockData";
import Badge from "../components/Badge";
import GenericTable from "./GenericTable";
import FormModal, { Toast, ConfirmDialog } from "../components/FormModal";
import { exportToCsv } from "../utils/exportCsv";

const CANDIDATE_FIELDS = [
  { key: "name",       label: "Full Name",        placeholder: "e.g. Priya Desai" },
  { key: "email",      label: "Email",             type: "email" as const, placeholder: "e.g. priya@gmail.com" },
  { key: "phone",      label: "Phone",             placeholder: "+91 98765 XXXXX" },
  { key: "location",   label: "Location",          placeholder: "e.g. Bengaluru" },
  { key: "education",  label: "Education",         type: "select" as const, options: ["B.Tech", "MBA", "B.Sc", "M.Sc", "B.Com", "CA", "B.Des", "M.Tech"] },
  { key: "experience", label: "Experience",        type: "select" as const, options: ["0–1 yr", "1–3 yrs", "3–5 yrs", "5–8 yrs", "8+ yrs"] },
  { key: "skills",     label: "Skills (comma-sep)",placeholder: "e.g. React, Node.js, TypeScript" },
];

export default function Candidates() {
  const [list, setList] = useState(candidates);
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleAdd = (data: Record<string, string>) => {
    const newC = {
      id: `C${String(list.length + 1).padStart(3, "0")}`,
      name: data.name, email: data.email, phone: data.phone,
      location: data.location, experience: data.experience,
      education: data.education,
      skills: data.skills.split(",").map(s => s.trim()).filter(Boolean),
      status: "applied",
    };
    setList(p => [...p, newC]);
    showToast(`Candidate "${data.name}" added successfully!`);
  };

  const handleDelete = (id: string) => {
    setList(p => p.filter(c => c.id !== id));
    showToast("Candidate removed.", "error");
  };

  return (
    <>
      <GenericTable
        title="Candidates"
        subtitle={`${list.length} total candidates`}
        data={list as unknown as Record<string, unknown>[]}
        addLabel="Add Candidate"
        onAddClick={() => setShowAdd(true)}
        onExport={() => exportToCsv("candidates.csv", list as unknown as Record<string, unknown>[])}
        searchKeys={["name", "email", "location", "education"]}
        columns={[
          { key: "id", label: "ID", render: r => <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-tertiary)", fontSize: 11.5 }}>{String(r.id)}</span> },
          { key: "name", label: "Candidate", render: r => {
            const hue = (String(r.name).charCodeAt(0) * 47 + String(r.name).charCodeAt(1) * 13) % 360;
            return (
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, flexShrink: 0, background: `hsl(${hue},55%,92%)`, color: `hsl(${hue},55%,35%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>{String(r.name)[0]}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{String(r.name)}</div>
                  <div style={{ fontSize: 11.5, color: "var(--text-tertiary)" }}>{String(r.email)}</div>
                </div>
              </div>
            );
          }},
          { key: "location",   label: "Location",   render: r => <span style={{ color: "var(--text-secondary)" }}>{String(r.location)}</span> },
          { key: "experience", label: "Experience",  render: r => <span style={{ color: "var(--text-secondary)" }}>{String(r.experience)}</span> },
          { key: "education",  label: "Education",   render: r => <span style={{ color: "var(--text-secondary)" }}>{String(r.education)}</span> },
          { key: "skills", label: "Skills", render: r => (
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {(r.skills as string[]).slice(0, 2).map((s: string) => (
                <span key={s} style={{ fontSize: 11, padding: "2px 7px", borderRadius: 99, background: "var(--accent-light)", color: "var(--accent-text)", fontWeight: 500 }}>{s}</span>
              ))}
              {(r.skills as string[]).length > 2 && <span style={{ fontSize: 11, color: "var(--text-tertiary)" }}>+{(r.skills as string[]).length - 2}</span>}
            </div>
          )},
          { key: "status", label: "Status", render: r => <Badge status={String(r.status)} dot /> },
          { key: "actions", label: "", sortable: false, render: r => (
            <button onClick={() => setDeleteId(String(r.id))} style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid var(--border)", background: "transparent", fontSize: 11.5, color: "var(--text-tertiary)", cursor: "pointer", fontFamily: "inherit" }}>Remove</button>
          )},
        ]}
      />

      {showAdd && (
        <FormModal
          title="Add Candidate"
          subtitle="Fill in the candidate's profile information"
          fields={CANDIDATE_FIELDS}
          onClose={() => setShowAdd(false)}
          onSubmit={handleAdd}
          submitLabel="Add Candidate"
          icon={<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><path d="M16 17v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>}
        />
      )}

      {deleteId && (
        <ConfirmDialog
          title="Remove Candidate"
          message={`Are you sure you want to remove this candidate? This action cannot be undone.`}
          confirmLabel="Remove"
          danger
          onConfirm={() => handleDelete(deleteId)}
          onCancel={() => setDeleteId(null)}
        />
      )}

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}

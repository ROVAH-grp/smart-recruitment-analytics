import { useState } from "react";
import { jobs } from "../data/mockData";
import Badge from "../components/Badge";
import GenericTable from "./GenericTable";
import FormModal, { Toast, ConfirmDialog } from "../components/FormModal";
import { exportToCsv } from "../utils/exportCsv";

const JOB_FIELDS = [
  { key: "title",       label: "Job Title",     placeholder: "e.g. Senior Frontend Engineer" },
  { key: "dept",        label: "Department",    type: "select" as const, options: ["Engineering", "Sales", "Marketing", "Design", "Operations", "Finance", "HR"] },
  { key: "location",    label: "Location",      placeholder: "e.g. Bengaluru / Remote" },
  { key: "type",        label: "Employment Type", type: "select" as const, options: ["Full-time", "Part-time", "Contract", "Internship"] },
  { key: "openings",    label: "No. of Openings", type: "number" as const, placeholder: "e.g. 3" },
  { key: "closingDate", label: "Closing Date",  type: "date" as const },
];

export default function Jobs() {
  const [list, setList] = useState(jobs);
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [closeId, setCloseId] = useState<string | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handlePost = (data: Record<string, string>) => {
    const newJ = {
      id: `J${String(list.length + 1).padStart(3, "0")}`,
      title: data.title, dept: data.dept, location: data.location,
      type: data.type, openings: Number(data.openings) || 1,
      applicants: 0, status: "open",
      postedDate: new Date().toISOString().split("T")[0],
      closingDate: data.closingDate,
    };
    setList(p => [...p, newJ]);
    showToast(`Job "${data.title}" posted successfully!`);
  };

  const handleClose = (id: string) => {
    setList(p => p.map(j => j.id === id ? { ...j, status: "closed" } : j));
    showToast("Job closed.", "error");
    setCloseId(null);
  };

  return (
    <>
      <GenericTable
        title="Jobs"
        subtitle={`${list.filter(j => j.status === "open").length} open · ${list.length} total`}
        data={list as unknown as Record<string, unknown>[]}
        addLabel="Post Job"
        onAddClick={() => setShowAdd(true)}
        onExport={() => exportToCsv("jobs.csv", list as unknown as Record<string, unknown>[])}
        searchKeys={["title", "dept", "location"]}
        columns={[
          { key: "id",    label: "ID",    render: r => <span style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--text-tertiary)" }}>{String(r.id)}</span> },
          { key: "title", label: "Job Title", render: r => <span style={{ fontWeight: 600, color: "var(--text)" }}>{String(r.title)}</span> },
          { key: "dept",  label: "Department", render: r => <span style={{ fontSize: 12.5, color: "var(--text-secondary)" }}>{String(r.dept)}</span> },
          { key: "location", label: "Location", render: r => <span style={{ fontSize: 12.5, color: "var(--text-secondary)" }}>{String(r.location)}</span> },
          { key: "type",  label: "Type",  render: r => <span style={{ fontSize: 12, padding: "2px 8px", borderRadius: 99, background: "var(--accent-light)", color: "var(--accent-text)", fontWeight: 500 }}>{String(r.type)}</span> },
          { key: "openings", label: "Openings", render: r => <span style={{ fontWeight: 700 }}>{String(r.openings)}</span> },
          { key: "applicants", label: "Applicants", render: r => (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ height: 4, width: 44, background: "var(--border-light)", borderRadius: 99 }}>
                <div style={{ height: "100%", width: `${Math.min(Number(r.applicants) / 2, 100)}%`, background: "var(--accent)", borderRadius: 99 }} />
              </div>
              <span style={{ fontWeight: 600, fontSize: 13 }}>{String(r.applicants)}</span>
            </div>
          )},
          { key: "status", label: "Status", render: r => <Badge status={String(r.status)} dot /> },
          { key: "postedDate", label: "Posted", render: r => <span style={{ color: "var(--text-tertiary)", fontSize: 12, fontFamily: "var(--font-mono)" }}>{String(r.postedDate)}</span> },
          { key: "actions", label: "", sortable: false, render: r => (
            String(r.status) !== "closed" && (
              <button onClick={() => setCloseId(String(r.id))} style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid var(--border)", background: "transparent", fontSize: 11.5, color: "var(--text-tertiary)", cursor: "pointer", fontFamily: "inherit" }}>Close</button>
            )
          )},
        ]}
      />

      {showAdd && (
        <FormModal
          title="Post New Job"
          subtitle="Create a new job opening for your team"
          fields={JOB_FIELDS}
          onClose={() => setShowAdd(false)}
          onSubmit={handlePost}
          submitLabel="Post Job"
          icon={<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><rect x="2" y="5" width="14" height="12" rx="2"/><path d="M11 5V4a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v1"/></svg>}
        />
      )}

      {closeId && (
        <ConfirmDialog
          title="Close Job Posting"
          message="Closing this job will stop accepting new applications. Are you sure?"
          confirmLabel="Close Job"
          danger
          onConfirm={() => handleClose(closeId)}
          onCancel={() => setCloseId(null)}
        />
      )}

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}

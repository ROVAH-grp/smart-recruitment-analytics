import { useState } from "react";
import { recruiters } from "../data/mockData";
import GenericTable from "./GenericTable";
import FormModal, { Toast } from "../components/FormModal";
import { exportToCsv } from "../utils/exportCsv";

const RECRUITER_FIELDS = [
  { key: "name",  label: "Full Name",   placeholder: "e.g. James Watson" },
  { key: "email", label: "Email",       type: "email" as const, placeholder: "e.g. james@company.com" },
  { key: "phone", label: "Phone",       placeholder: "+91 98765 XXXXX" },
  { key: "dept",  label: "Department",  type: "select" as const, options: ["HR", "Engineering", "Sales", "Operations"] },
];

export default function Recruiters() {
  const [list, setList] = useState(recruiters);
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const handleAdd = (data: Record<string, string>) => {
    const newR = {
      id: `R${String(list.length + 1).padStart(3, "0")}`,
      name: data.name, email: data.email, phone: data.phone, dept: data.dept,
      assigned: 0, filled: 0, successRate: 0, avgTimeToHire: 0,
    };
    setList(p => [...p, newR]);
    setToast({ msg: `Recruiter "${data.name}" added!`, type: "success" });
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <>
      <GenericTable
        title="Recruiters"
        subtitle={`${list.length} active recruiters`}
        data={list as unknown as Record<string, unknown>[]}
        addLabel="Add Recruiter"
        onAddClick={() => setShowAdd(true)}
        onExport={() => exportToCsv("recruiters.csv", list as unknown as Record<string, unknown>[])}
        searchKeys={["name", "email", "dept"]}
        columns={[
          { key: "id",   label: "ID",  render: r => <span style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--text-tertiary)" }}>{String(r.id)}</span> },
          { key: "name", label: "Recruiter", render: r => (
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg, var(--accent-dark), var(--accent))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>{String(r.name)[0]}</div>
              <div>
                <div style={{ fontWeight: 600, color: "var(--text)" }}>{String(r.name)}</div>
                <div style={{ fontSize: 11.5, color: "var(--text-tertiary)" }}>{String(r.email)}</div>
              </div>
            </div>
          )},
          { key: "dept",     label: "Dept",    render: r => <span style={{ color: "var(--text-secondary)" }}>{String(r.dept)}</span> },
          { key: "assigned", label: "Assigned",render: r => <span style={{ fontWeight: 700 }}>{String(r.assigned)}</span> },
          { key: "filled",   label: "Filled",  render: r => <span style={{ fontWeight: 700, color: "var(--green)" }}>{String(r.filled)}</span> },
          { key: "successRate", label: "Success", render: r => (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ height: 4, width: 44, background: "var(--border-light)", borderRadius: 99 }}>
                <div style={{ height: "100%", width: `${Number(r.successRate)}%`, background: "var(--green-mid)", borderRadius: 99 }} />
              </div>
              <span style={{ fontWeight: 600, fontSize: 12.5 }}>{String(r.successRate)}%</span>
            </div>
          )},
          { key: "avgTimeToHire", label: "Avg. Time to Hire", render: r => <span style={{ color: "var(--text-secondary)" }}>{Number(r.avgTimeToHire) > 0 ? `${String(r.avgTimeToHire)} days` : "—"}</span> },
        ]}
      />
      {showAdd && <FormModal title="Add Recruiter" subtitle="Onboard a new team recruiter" fields={RECRUITER_FIELDS} onClose={() => setShowAdd(false)} onSubmit={handleAdd} submitLabel="Add Recruiter" icon={<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><path d="M14 15v-2a3 3 0 0 0-3-3H5a3 3 0 0 0-3 3v2"/><circle cx="8" cy="5" r="4"/><line x1="15" y1="7" x2="15" y2="13"/><line x1="12" y1="10" x2="18" y2="10"/></svg>} />}
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}

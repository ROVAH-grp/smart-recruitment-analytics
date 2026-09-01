import { useState } from "react";
import { sources } from "../data/mockData";
import GenericTable from "./GenericTable";
import FormModal, { Toast } from "../components/FormModal";
import { exportToCsv } from "../utils/exportCsv";

const SOURCE_FIELDS = [
  { key: "name", label: "Source Name",       placeholder: "e.g. AngelList" },
  { key: "cost", label: "Initial Budget (₹)", type: "number" as const, placeholder: "e.g. 5000" },
];

export default function Sources() {
  const [list, setList] = useState(sources);
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const handleAdd = (data: Record<string, string>) => {
    const newS = {
      id: `S${String(list.length + 1).padStart(3, "0")}`,
      name: data.name, applicants: 0, hired: 0,
      cost: Number(data.cost) || 0, cph: 0,
    };
    setList(p => [...p, newS]);
    setToast({ msg: `Source "${data.name}" added!`, type: "success" });
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <>
      <GenericTable
        title="Sources"
        subtitle="Recruitment channel performance"
        data={list as unknown as Record<string, unknown>[]}
        addLabel="Add Source"
        onAddClick={() => setShowAdd(true)}
        onExport={() => exportToCsv("sources.csv", list as unknown as Record<string, unknown>[])}
        searchKeys={["name"]}
        columns={[
          { key: "id",   label: "ID",   render: r => <span style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--text-tertiary)" }}>{String(r.id)}</span> },
          { key: "name", label: "Source", render: r => <span style={{ fontWeight: 600 }}>{String(r.name)}</span> },
          { key: "applicants", label: "Applicants", render: r => <span style={{ fontWeight: 700 }}>{String(r.applicants)}</span> },
          { key: "hired",      label: "Hired",      render: r => <span style={{ fontWeight: 700, color: "var(--green)" }}>{String(r.hired)}</span> },
          { key: "conversion", label: "Conversion", render: r => {
            const pct = Number(r.applicants) > 0 ? Math.round((Number(r.hired) / Number(r.applicants)) * 100) : 0;
            return (
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ height: 4, width: 44, background: "var(--border-light)", borderRadius: 99 }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: "var(--accent)", borderRadius: 99 }} />
                </div>
                <span style={{ fontSize: 12.5, fontWeight: 700 }}>{pct}%</span>
              </div>
            );
          }},
          { key: "cost", label: "Total Cost",   render: r => <span>₹{Number(r.cost).toLocaleString()}</span> },
          { key: "cph",  label: "Cost Per Hire", render: r => <span style={{ fontWeight: 700, color: "var(--accent-text)" }}>₹{Number(r.cph).toLocaleString()}</span> },
        ]}
      />
      {showAdd && <FormModal title="Add Source" subtitle="Track a new recruitment channel" fields={SOURCE_FIELDS} onClose={() => setShowAdd(false)} onSubmit={handleAdd} submitLabel="Add Source" icon={<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><circle cx="14" cy="4" r="2.5"/><circle cx="4" cy="9" r="2.5"/><circle cx="14" cy="14" r="2.5"/><line x1="6.5" y1="10.2" x2="11.5" y2="12.8"/><line x1="11.5" y1="5.2" x2="6.5" y2="7.8"/></svg>} />}
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}

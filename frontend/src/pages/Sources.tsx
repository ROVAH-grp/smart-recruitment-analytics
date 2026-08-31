import { sources } from "../data/mockData";
import GenericTable from "./GenericTable";

export default function Sources() {
  return (
    <GenericTable
      title="Sources"
      subtitle="Recruitment channel performance"
      data={sources as unknown as Record<string, unknown>[]}
      addLabel="Add Source"
      searchKeys={["name"]}
      columns={[
        { key: "id", label: "ID", render: r => <span style={{ fontFamily: "monospace", fontSize: 12, color: "var(--text-secondary)" }}>{String(r.id)}</span> },
        { key: "name", label: "Source Name", render: r => <span style={{ fontWeight: 600 }}>{String(r.name)}</span> },
        { key: "applicants", label: "Applicants", render: r => <span style={{ fontWeight: 600 }}>{String(r.applicants)}</span> },
        { key: "hired", label: "Hired", render: r => <span style={{ fontWeight: 600, color: "var(--green)" }}>{String(r.hired)}</span> },
        { key: "conversion", label: "Conversion", render: r => {
          const pct = Math.round((Number(r.hired) / Number(r.applicants)) * 100);
          return (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ height: 4, width: 48, background: "var(--border-light)", borderRadius: 99 }}>
                <div style={{ height: "100%", width: `${pct}%`, background: "var(--accent)", borderRadius: 99 }} />
              </div>
              <span style={{ fontSize: 12.5, fontWeight: 600 }}>{pct}%</span>
            </div>
          );
        }},
        { key: "cost", label: "Total Cost", render: r => <span>₹{Number(r.cost).toLocaleString()}</span> },
        { key: "cph", label: "Cost Per Hire", render: r => <span style={{ fontWeight: 600, color: "var(--text)" }}>₹{Number(r.cph).toLocaleString()}</span> },
      ]}
    />
  );
}

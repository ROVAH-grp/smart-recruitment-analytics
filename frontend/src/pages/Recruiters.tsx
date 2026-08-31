import { recruiters } from "../data/mockData";
import GenericTable from "./GenericTable";

export default function Recruiters() {
  return (
    <GenericTable
      title="Recruiters"
      subtitle={`${recruiters.length} active recruiters`}
      data={recruiters as unknown as Record<string, unknown>[]}
      addLabel="Add Recruiter"
      searchKeys={["name", "email", "dept"]}
      columns={[
        { key: "id", label: "ID", render: r => <span style={{ fontFamily: "monospace", fontSize: 12, color: "var(--text-secondary)" }}>{String(r.id)}</span> },
        { key: "name", label: "Recruiter", render: r => (
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, var(--accent-grad-1), var(--accent-grad-2))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>{String(r.name)[0]}</div>
            <div>
              <div style={{ fontWeight: 600, color: "var(--text)" }}>{String(r.name)}</div>
              <div style={{ fontSize: 11.5, color: "var(--text-secondary)" }}>{String(r.email)}</div>
            </div>
          </div>
        )},
        { key: "dept", label: "Department" },
        { key: "assigned", label: "Assigned", render: r => <span style={{ fontWeight: 600 }}>{String(r.assigned)}</span> },
        { key: "filled", label: "Filled", render: r => <span style={{ fontWeight: 600, color: "var(--green)" }}>{String(r.filled)}</span> },
        { key: "successRate", label: "Success Rate", render: r => (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ height: 4, width: 48, background: "var(--border-light)", borderRadius: 99 }}>
              <div style={{ height: "100%", width: `${Number(r.successRate)}%`, background: "var(--green-mid)", borderRadius: 99 }} />
            </div>
            <span style={{ fontWeight: 600, fontSize: 12.5 }}>{String(r.successRate)}%</span>
          </div>
        )},
        { key: "avgTimeToHire", label: "Avg. Time to Hire", render: r => <span style={{ color: "var(--text-secondary)" }}>{String(r.avgTimeToHire)} days</span> },
      ]}
    />
  );
}

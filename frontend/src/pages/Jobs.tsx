import { jobs } from "../data/mockData";
import Badge from "../components/Badge";
import GenericTable from "./GenericTable";

export default function Jobs() {
  return (
    <GenericTable
      title="Jobs"
      subtitle={`${jobs.length} open positions`}
      data={jobs as unknown as Record<string, unknown>[]}
      addLabel="Post Job"
      searchKeys={["title", "dept", "location"]}
      columns={[
        { key: "id", label: "ID", render: r => <span style={{ fontFamily: "monospace", fontSize: 12, color: "var(--text-secondary)" }}>{String(r.id)}</span> },
        { key: "title", label: "Job Title", render: r => <span style={{ fontWeight: 600, color: "var(--text)" }}>{String(r.title)}</span> },
        { key: "dept", label: "Department" },
        { key: "location", label: "Location" },
        { key: "type", label: "Type" },
        { key: "openings", label: "Openings", render: r => <span style={{ fontWeight: 600 }}>{String(r.openings)}</span> },
        { key: "applicants", label: "Applicants", render: r => (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ height: 4, width: 48, background: "var(--border-light)", borderRadius: 99 }}>
              <div style={{ height: "100%", width: `${Math.min(Number(r.applicants) / 2, 100)}%`, background: "var(--accent)", borderRadius: 99 }} />
            </div>
            <span style={{ fontWeight: 600 }}>{String(r.applicants)}</span>
          </div>
        )},
        { key: "status", label: "Status", render: r => <Badge status={String(r.status)} /> },
        { key: "postedDate", label: "Posted", render: r => <span style={{ color: "var(--text-secondary)", fontSize: 12.5 }}>{String(r.postedDate)}</span> },
      ]}
    />
  );
}

import { candidates } from "../data/mockData";
import Badge from "../components/Badge";
import GenericTable from "./GenericTable";

export default function Candidates() {
  return (
    <GenericTable
      title="Candidates"
      subtitle={`${candidates.length} total candidates`}
      data={candidates as unknown as Record<string, unknown>[]}
      addLabel="Add Candidate"
      searchKeys={["name", "email", "location", "education"]}
      columns={[
        { key: "id", label: "ID", render: r => <span style={{ fontFamily: "monospace", color: "var(--text-secondary)", fontSize: 12 }}>{String(r.id)}</span> },
        { key: "name", label: "Candidate", render: r => (
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, flexShrink: 0, background: `hsl(${String(r.name).charCodeAt(0) * 13 % 360},60%,90%)`, color: `hsl(${String(r.name).charCodeAt(0) * 13 % 360},60%,35%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>{String(r.name)[0]}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{String(r.name)}</div>
              <div style={{ fontSize: 11.5, color: "var(--text-secondary)" }}>{String(r.email)}</div>
            </div>
          </div>
        )},
        { key: "location", label: "Location" },
        { key: "experience", label: "Experience" },
        { key: "education", label: "Education" },
        { key: "skills", label: "Skills", render: r => (
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {(r.skills as string[]).slice(0, 2).map((s: string) => (
              <span key={s} style={{ fontSize: 11, padding: "2px 7px", borderRadius: 99, background: "var(--accent-light)", color: "var(--accent)", fontWeight: 500 }}>{s}</span>
            ))}
          </div>
        )},
        { key: "status", label: "Status", render: r => <Badge status={String(r.status)} /> },
      ]}
    />
  );
}

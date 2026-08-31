import { interviews } from "../data/mockData";
import Badge from "../components/Badge";
import GenericTable from "./GenericTable";

export default function Interviews() {
  return (
    <GenericTable
      title="Interviews"
      subtitle={`${interviews.length} scheduled/completed interviews`}
      data={interviews as unknown as Record<string, unknown>[]}
      addLabel="Schedule Interview"
      searchKeys={["candidate", "job", "recruiter", "type"]}
      columns={[
        { key: "id", label: "ID", render: r => <span style={{ fontFamily: "monospace", fontSize: 12, color: "var(--text-secondary)" }}>{String(r.id)}</span> },
        { key: "candidate", label: "Candidate", render: r => <span style={{ fontWeight: 600 }}>{String(r.candidate)}</span> },
        { key: "job", label: "Job", render: r => <span style={{ color: "var(--text-secondary)", fontSize: 12.5 }}>{String(r.job)}</span> },
        { key: "recruiter", label: "Recruiter" },
        { key: "type", label: "Type", render: r => <span style={{ fontSize: 12, padding: "2px 8px", borderRadius: 99, background: "var(--accent-light)", color: "var(--accent)", fontWeight: 500 }}>{String(r.type)}</span> },
        { key: "scheduledDate", label: "Scheduled", render: r => <span style={{ fontSize: 12.5, color: "var(--text-secondary)" }}>{String(r.scheduledDate)}</span> },
        { key: "score", label: "Score", render: r => r.score != null ? <span style={{ fontWeight: 600 }}>{String(r.score)}/100</span> : <span style={{ color: "var(--text-secondary)" }}>—</span> },
        { key: "status", label: "Status", render: r => <Badge status={String(r.status)} /> },
      ]}
    />
  );
}

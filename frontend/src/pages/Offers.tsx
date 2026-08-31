import { offers } from "../data/mockData";
import Badge from "../components/Badge";
import GenericTable from "./GenericTable";

export default function Offers() {
  return (
    <GenericTable
      title="Offers"
      subtitle={`${offers.length} total offers`}
      data={offers as unknown as Record<string, unknown>[]}
      addLabel="Create Offer"
      searchKeys={["candidate", "job"]}
      columns={[
        { key: "id", label: "ID", render: r => <span style={{ fontFamily: "monospace", fontSize: 12, color: "var(--text-secondary)" }}>{String(r.id)}</span> },
        { key: "candidate", label: "Candidate", render: r => <span style={{ fontWeight: 600 }}>{String(r.candidate)}</span> },
        { key: "job", label: "Job", render: r => <span style={{ color: "var(--text-secondary)", fontSize: 12.5 }}>{String(r.job)}</span> },
        { key: "ctc", label: "CTC", render: r => <span style={{ fontWeight: 600, color: "var(--accent)" }}>{String(r.ctc)}</span> },
        { key: "offerDate", label: "Offer Date", render: r => <span style={{ fontSize: 12.5, color: "var(--text-secondary)" }}>{String(r.offerDate)}</span> },
        { key: "deadline", label: "Deadline", render: r => <span style={{ fontSize: 12.5, color: "var(--text-secondary)" }}>{String(r.deadline)}</span> },
        { key: "status", label: "Status", render: r => <Badge status={String(r.status)} /> },
        { key: "joiningDate", label: "Joining Date", render: r => <span style={{ fontSize: 12.5, color: "var(--text-secondary)" }}>{r.joiningDate ? String(r.joiningDate) : "—"}</span> },
      ]}
    />
  );
}

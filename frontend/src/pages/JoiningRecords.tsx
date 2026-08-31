import { joiningRecords } from "../data/mockData";
import Badge from "../components/Badge";
import GenericTable from "./GenericTable";

export default function JoiningRecords() {
  return (
    <GenericTable
      title="Joining Records"
      subtitle={`${joiningRecords.length} employees onboarded`}
      data={joiningRecords as unknown as Record<string, unknown>[]}
      searchKeys={["candidate", "job", "dept"]}
      columns={[
        { key: "id", label: "ID", render: r => <span style={{ fontFamily: "monospace", fontSize: 12, color: "var(--text-secondary)" }}>{String(r.id)}</span> },
        { key: "empId", label: "Emp. ID", render: r => <span style={{ fontFamily: "monospace", fontWeight: 600, color: "var(--accent)" }}>{String(r.empId)}</span> },
        { key: "candidate", label: "Employee", render: r => <span style={{ fontWeight: 600 }}>{String(r.candidate)}</span> },
        { key: "job", label: "Designation", render: r => <span style={{ color: "var(--text-secondary)", fontSize: 12.5 }}>{String(r.job)}</span> },
        { key: "dept", label: "Department" },
        { key: "joiningDate", label: "Joining Date", render: r => <span style={{ fontSize: 12.5, color: "var(--text-secondary)" }}>{String(r.joiningDate)}</span> },
        { key: "onboarding", label: "Onboarding", render: r => <Badge status={String(r.onboarding)} /> },
        { key: "status", label: "Status", render: r => <Badge status={String(r.status)} /> },
      ]}
    />
  );
}

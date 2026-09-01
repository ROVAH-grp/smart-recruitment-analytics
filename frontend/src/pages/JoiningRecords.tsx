import { joiningRecords } from "../data/mockData";
import Badge from "../components/Badge";
import GenericTable from "./GenericTable";
import { exportToCsv } from "../utils/exportCsv";

export default function JoiningRecords() {
  return (
    <GenericTable
      title="Joining Records"
      subtitle={`${joiningRecords.length} employees onboarded`}
      data={joiningRecords as unknown as Record<string, unknown>[]}
      onExport={() => exportToCsv("joining-records.csv", joiningRecords as unknown as Record<string, unknown>[])}
      searchKeys={["candidate", "job", "dept"]}
      columns={[
        { key: "id",        label: "ID",        render: r => <span style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--text-tertiary)" }}>{String(r.id)}</span> },
        { key: "empId",     label: "Emp ID",    render: r => <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--accent-text)" }}>{String(r.empId)}</span> },
        { key: "candidate", label: "Employee",  render: r => <span style={{ fontWeight: 600 }}>{String(r.candidate)}</span> },
        { key: "job",       label: "Designation",render: r => <span style={{ color: "var(--text-secondary)", fontSize: 12.5 }}>{String(r.job)}</span> },
        { key: "dept",      label: "Department" },
        { key: "joiningDate", label: "Joining Date", render: r => <span style={{ fontSize: 12.5, fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>{String(r.joiningDate)}</span> },
        { key: "onboarding", label: "Onboarding", render: r => <Badge status={String(r.onboarding)} dot /> },
        { key: "status",    label: "Status",    render: r => <Badge status={String(r.status)} dot /> },
      ]}
    />
  );
}

import { useState } from "react";
import { interviews } from "../data/mockData";
import Badge from "../components/Badge";
import GenericTable from "./GenericTable";
import FormModal, { Toast } from "../components/FormModal";
import { exportToCsv } from "../utils/exportCsv";

const INTERVIEW_FIELDS = [
  { key: "candidate",  label: "Candidate Name",  placeholder: "e.g. Aryan Mehta" },
  { key: "job",        label: "Job Position",     placeholder: "e.g. Senior Frontend Engineer" },
  { key: "recruiter",  label: "Recruiter",        type: "select" as const, options: ["Sarah Mitchell", "James Watson", "Emily Clarke"] },
  { key: "type",       label: "Interview Type",   type: "select" as const, options: ["Technical", "HR", "Portfolio Review", "Case Study", "Final Round"] },
  { key: "scheduledDate", label: "Scheduled Date & Time", type: "datetime-local" as const, placeholder: "" },
];

export default function Interviews() {
  const [list, setList] = useState(interviews);
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const handleSchedule = (data: Record<string, string>) => {
    const newI = {
      id: `I${String(list.length + 1).padStart(3, "0")}`,
      candidate: data.candidate, job: data.job, recruiter: data.recruiter,
      type: data.type, scheduledDate: data.scheduledDate.replace("T", " "),
      score: null, status: "scheduled", feedback: null,
    };
    setList(p => [...p, newI]);
    setToast({ msg: `Interview with "${data.candidate}" scheduled!`, type: "success" });
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <>
      <GenericTable
        title="Interviews"
        subtitle={`${list.filter(i => i.status === "scheduled").length} scheduled · ${list.length} total`}
        data={list as unknown as Record<string, unknown>[]}
        addLabel="Schedule Interview"
        onAddClick={() => setShowAdd(true)}
        onExport={() => exportToCsv("interviews.csv", list as unknown as Record<string, unknown>[])}
        searchKeys={["candidate", "job", "recruiter", "type"]}
        columns={[
          { key: "id",        label: "ID",        render: r => <span style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--text-tertiary)" }}>{String(r.id)}</span> },
          { key: "candidate", label: "Candidate", render: r => <span style={{ fontWeight: 600 }}>{String(r.candidate)}</span> },
          { key: "job",       label: "Position",  render: r => <span style={{ color: "var(--text-secondary)", fontSize: 12.5 }}>{String(r.job)}</span> },
          { key: "recruiter", label: "Recruiter" },
          { key: "type",      label: "Type",      render: r => <span style={{ fontSize: 12, padding: "2px 8px", borderRadius: 99, background: "var(--accent-light)", color: "var(--accent-text)", fontWeight: 500 }}>{String(r.type)}</span> },
          { key: "scheduledDate", label: "Scheduled", render: r => <span style={{ fontSize: 12.5, color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>{String(r.scheduledDate)}</span> },
          { key: "score",     label: "Score",     render: r => r.score != null ? <span style={{ fontWeight: 700, color: "var(--text)" }}>{String(r.score)}<span style={{ color: "var(--text-tertiary)", fontWeight: 400 }}>/100</span></span> : <span style={{ color: "var(--text-tertiary)" }}>—</span> },
          { key: "status",    label: "Status",    render: r => <Badge status={String(r.status)} dot /> },
        ]}
      />
      {showAdd && <FormModal title="Schedule Interview" subtitle="Set up a new candidate interview" fields={INTERVIEW_FIELDS} onClose={() => setShowAdd(false)} onSubmit={handleSchedule} submitLabel="Schedule" icon={<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><rect x="1" y="2" width="16" height="15" rx="2"/><line x1="12" y1="1" x2="12" y2="4"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="1" y1="7" x2="17" y2="7"/></svg>} />}
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}

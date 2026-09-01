import { useState } from "react";
import { offers } from "../data/mockData";
import Badge from "../components/Badge";
import GenericTable from "./GenericTable";
import FormModal, { Toast, ConfirmDialog } from "../components/FormModal";
import { exportToCsv } from "../utils/exportCsv";

const OFFER_FIELDS = [
  { key: "candidate",   label: "Candidate Name",  placeholder: "e.g. Aryan Mehta" },
  { key: "job",         label: "Job Position",     placeholder: "e.g. Senior Frontend Engineer" },
  { key: "ctc",         label: "CTC / Package",   placeholder: "e.g. 22 LPA" },
  { key: "offerDate",   label: "Offer Date",       type: "date" as const },
  { key: "deadline",    label: "Acceptance Deadline", type: "date" as const },
  { key: "joiningDate", label: "Expected Joining Date", type: "date" as const, required: false },
];

export default function Offers() {
  const [list, setList] = useState(offers);
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [revokeId, setRevokeId] = useState<string | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleCreate = (data: Record<string, string>) => {
    const newO = {
      id: `O${String(list.length + 1).padStart(3, "0")}`,
      candidate: data.candidate, job: data.job, ctc: data.ctc,
      offerDate: data.offerDate, deadline: data.deadline,
      status: "pending", joiningDate: data.joiningDate || null,
    };
    setList(p => [...p, newO]);
    showToast(`Offer sent to "${data.candidate}"!`);
  };

  const handleRevoke = (id: string) => {
    setList(p => p.filter(o => o.id !== id));
    showToast("Offer revoked.", "error");
  };

  return (
    <>
      <GenericTable
        title="Offers"
        subtitle={`${list.filter(o => o.status === "pending").length} pending · ${list.length} total`}
        data={list as unknown as Record<string, unknown>[]}
        addLabel="Create Offer"
        onAddClick={() => setShowAdd(true)}
        onExport={() => exportToCsv("offers.csv", list as unknown as Record<string, unknown>[])}
        searchKeys={["candidate", "job"]}
        columns={[
          { key: "id",        label: "ID",        render: r => <span style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--text-tertiary)" }}>{String(r.id)}</span> },
          { key: "candidate", label: "Candidate", render: r => <span style={{ fontWeight: 600 }}>{String(r.candidate)}</span> },
          { key: "job",       label: "Position",  render: r => <span style={{ color: "var(--text-secondary)", fontSize: 12.5 }}>{String(r.job)}</span> },
          { key: "ctc",       label: "CTC",       render: r => <span style={{ fontWeight: 700, color: "var(--accent-text)" }}>{String(r.ctc)}</span> },
          { key: "offerDate", label: "Offer Date",render: r => <span style={{ fontSize: 12.5, color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>{String(r.offerDate)}</span> },
          { key: "deadline",  label: "Deadline",  render: r => <span style={{ fontSize: 12.5, color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>{String(r.deadline)}</span> },
          { key: "status",    label: "Status",    render: r => <Badge status={String(r.status)} dot /> },
          { key: "joiningDate", label: "Joining", render: r => <span style={{ fontSize: 12.5, color: r.joiningDate ? "var(--text)" : "var(--text-tertiary)" }}>{r.joiningDate ? String(r.joiningDate) : "—"}</span> },
          { key: "actions", label: "", sortable: false, render: r => (
            String(r.status) === "pending" && (
              <button onClick={() => setRevokeId(String(r.id))} style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid var(--red-border)", background: "var(--red-light)", fontSize: 11.5, color: "var(--red)", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>Revoke</button>
            )
          )},
        ]}
      />
      {showAdd && <FormModal title="Create Offer" subtitle="Generate a new offer letter" fields={OFFER_FIELDS} onClose={() => setShowAdd(false)} onSubmit={handleCreate} submitLabel="Send Offer" icon={<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><polyline points="18,5 9,11.5 0,5"/><rect x="0" y="3" width="18" height="13" rx="2"/></svg>} />}
      {revokeId && <ConfirmDialog title="Revoke Offer" message="This will permanently revoke the offer. The candidate will be notified. Continue?" confirmLabel="Revoke" danger onConfirm={() => handleRevoke(revokeId)} onCancel={() => setRevokeId(null)} />}
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}

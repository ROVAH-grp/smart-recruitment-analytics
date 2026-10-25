import { useState } from "react";
import { createInvitation, getAllJobs, getInvitations } from "../../api/pipeline";
import {
  Btn, Empty, Field, Loading, Messages, Notice, Pager, Panel, Pill, fmtDate, inputStyle,
  statusTone, tableStyles, useAction, useLoad,
} from "../../components/ui";

export default function InvitationsTab() {
  const [page, setPage] = useState(1);
  const jobs = useLoad(getAllJobs);
  const list = useLoad(() => getInvitations(page), [page]);

  const [candidateId, setCandidateId] = useState("");
  const [jobId, setJobId] = useState("");
  const [message, setMessage] = useState("");
  const action = useAction();

  const titleOf = (id: string) => jobs.data?.find((j) => j.jobId === id)?.jobTitle ?? id;

  const send = () =>
    action.run(async () => {
      await createInvitation({ candidateId: candidateId.trim(), jobId, message: message.trim() || undefined });
      setCandidateId("");
      setMessage("");
      await list.reload();
      return "Invitation sent. The candidate received an email with a link.";
    });

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <Panel title="Invite a candidate to apply">
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))" }}>
          <Field label="Candidate ID" hint="For example C0001">
            <input style={inputStyle} value={candidateId} onChange={(e) => setCandidateId(e.target.value)} placeholder="C0001" />
          </Field>
          <Field label="Job">
            <select style={inputStyle} value={jobId} onChange={(e) => setJobId(e.target.value)}>
              <option value="">Select a job...</option>
              {jobs.data?.map((job) => (
                <option key={job.jobId} value={job.jobId}>{job.jobTitle} ({job.jobId})</option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Message (optional)">
          <textarea style={{ ...inputStyle, minHeight: 64 }} maxLength={500} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="We liked your profile and would love you to apply." />
        </Field>
        <Btn disabled={!candidateId.trim() || !jobId || action.busy} onClick={send}>
          {action.busy ? "Sending..." : "Send invitation"}
        </Btn>
        <Messages error={action.error} success={action.success} />
      </Panel>

      <Panel title="Invitations sent">
        {list.loading && !list.data && <Loading />}
        {list.error && <Notice kind="error">{list.error}</Notice>}
        {list.data && (list.data.data.length === 0 ? <Empty>No invitations yet.</Empty> : (
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyles.table}>
              <thead>
                <tr>{["Candidate", "Job", "Status", "Sent", "Valid until"].map((h) => <th key={h} style={tableStyles.th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {list.data.data.map((inv) => (
                  <tr key={inv.token}>
                    <td style={tableStyles.td}>{inv.candidateId}</td>
                    <td style={tableStyles.td}>{titleOf(inv.jobId)}</td>
                    <td style={tableStyles.td}><Pill tone={statusTone(inv.status)}>{inv.status}</Pill></td>
                    <td style={tableStyles.td}>{fmtDate(inv.createdAt)}</td>
                    <td style={tableStyles.td}>{fmtDate(inv.expiresAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
        {list.data && <Pager page={list.data.meta.page} totalPages={list.data.meta.totalPages} onChange={setPage} />}
      </Panel>
    </div>
  );
}

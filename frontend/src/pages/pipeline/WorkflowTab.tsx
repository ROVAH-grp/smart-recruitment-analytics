import { useState } from "react";
import { getApplications } from "../../api/applications";
import {
  Btn, Empty, Loading, Notice, Pager, Panel, Pill, fmtDate, inputStyle, statusTone, tableStyles, useLoad,
} from "../../components/ui";

export default function WorkflowTab({
  refreshKey, onOpenApplication,
}: { refreshKey: number; onOpenApplication: (id: string) => void }) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [term, setTerm] = useState("");
  const [id, setId] = useState("");
  const { data, error, loading } = useLoad(() => getApplications(page, 10, term), [page, term, refreshKey]);

  return (
    <Panel
      title="Applications"
      action={
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <form onSubmit={(e) => { e.preventDefault(); setPage(1); setTerm(search.trim()); }} style={{ display: "flex", gap: 6 }}>
            <input style={{ ...inputStyle, width: 190 }} placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
            <Btn small type="submit" kind="ghost">Search</Btn>
          </form>
          <form onSubmit={(e) => { e.preventDefault(); if (id.trim()) onOpenApplication(id.trim()); }} style={{ display: "flex", gap: 6 }}>
            <input style={{ ...inputStyle, width: 130 }} placeholder="Open by ID" value={id} onChange={(e) => setId(e.target.value)} />
            <Btn small type="submit">Open</Btn>
          </form>
        </div>
      }
    >
      {loading && !data && <Loading />}
      {error && <Notice kind="error">{error}</Notice>}
      {data && (data.data.length === 0 ? <Empty>No applications found.</Empty> : (
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyles.table}>
            <thead>
              <tr>{["ID", "Candidate", "Job", "Status", "AI match", "Applied", ""].map((h) => <th key={h} style={tableStyles.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {data.data.map((app) => (
                <tr key={app.applicationId}>
                  <td style={tableStyles.td}>#{app.applicationId}</td>
                  <td style={tableStyles.td}>{app.candidate?.candidateName ?? app.candidateId}</td>
                  <td style={tableStyles.td}>{app.job?.jobTitle ?? app.jobId}</td>
                  <td style={tableStyles.td}><Pill tone={statusTone(app.status ?? "Applied")}>{app.status ?? "Applied"}</Pill></td>
                  <td style={tableStyles.td}>{app.matchScore !== null ? `${Math.round(Number(app.matchScore))}%` : "—"}</td>
                  <td style={tableStyles.td}>{fmtDate(app.applicationDate)}</td>
                  <td style={tableStyles.td}><Btn small onClick={() => onOpenApplication(app.applicationId)}>Manage</Btn></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
      {data && <Pager page={data.meta.page} totalPages={data.meta.totalPages} onChange={setPage} />}
    </Panel>
  );
}

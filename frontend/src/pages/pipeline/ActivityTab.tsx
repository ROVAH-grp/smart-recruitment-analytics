import { useState } from "react";
import { getActivity, getEmailLog } from "../../api/pipeline";
import {
  Btn, Empty, Loading, Notice, Pager, Panel, Pill, fmtDateTime, statusTone, tableStyles, useLoad,
} from "../../components/ui";

export default function ActivityTab({ onOpenApplication }: { onOpenApplication: (id: string) => void }) {
  const [view, setView] = useState<"changes" | "emails">("changes");

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div style={{ display: "flex", gap: 6 }}>
        <Btn small kind={view === "changes" ? "primary" : "ghost"} onClick={() => setView("changes")}>Stage changes</Btn>
        <Btn small kind={view === "emails" ? "primary" : "ghost"} onClick={() => setView("emails")}>Emails sent</Btn>
      </div>
      {view === "changes" ? <Changes onOpenApplication={onOpenApplication} /> : <Emails />}
    </div>
  );
}

function Changes({ onOpenApplication }: { onOpenApplication: (id: string) => void }) {
  const [page, setPage] = useState(1);
  const [actor, setActor] = useState<"" | "SYSTEM" | "USER">("");
  const { data, error, loading } = useLoad(
    () => getActivity(page, actor ? { actor } : {}),
    [page, actor],
  );

  return (
    <Panel
      title="Every change to an application, newest first"
      action={
        <div style={{ display: "flex", gap: 6 }}>
          <Btn small kind={actor === "" ? "primary" : "ghost"} onClick={() => { setActor(""); setPage(1); }}>All</Btn>
          <Btn small kind={actor === "SYSTEM" ? "primary" : "ghost"} onClick={() => { setActor("SYSTEM"); setPage(1); }}>Automatic</Btn>
          <Btn small kind={actor === "USER" ? "primary" : "ghost"} onClick={() => { setActor("USER"); setPage(1); }}>By people</Btn>
        </div>
      }
    >
      {loading && !data && <Loading />}
      {error && <Notice kind="error">{error}</Notice>}
      {data && (data.data.length === 0 ? <Empty>No changes recorded yet.</Empty> : (
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyles.table}>
            <thead>
              <tr>{["When", "Candidate", "Change", "By", "Reason", ""].map((h) => <th key={h} style={tableStyles.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {data.data.map((row) => (
                <tr key={row.id}>
                  <td style={tableStyles.td}>{fmtDateTime(row.at)}</td>
                  <td style={tableStyles.td}>
                    <div style={{ fontWeight: 600 }}>{row.candidate ?? "—"}</div>
                    <div style={{ fontSize: 11.5, color: "var(--text-tertiary)" }}>{row.job ?? ""}</div>
                  </td>
                  <td style={tableStyles.td}>
                    {row.from ? <>{row.from} → </> : null}<Pill tone={statusTone(row.to)}>{row.to}</Pill>
                  </td>
                  <td style={tableStyles.td}>
                    {row.by === "SYSTEM" ? <Pill tone="accent">Automatic</Pill> : row.by}
                  </td>
                  <td style={{ ...tableStyles.td, maxWidth: 260 }}>{row.reason ?? "—"}</td>
                  <td style={tableStyles.td}><Btn small kind="ghost" onClick={() => onOpenApplication(row.applicationId)}>Open</Btn></td>
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

function Emails() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const { data, error, loading } = useLoad(
    () => getEmailLog(page, status ? { status } : {}),
    [page, status],
  );

  return (
    <Panel
      title="Every automatic email"
      action={
        <div style={{ display: "flex", gap: 6 }}>
          {["", "SENT", "FAILED", "SKIPPED"].map((s) => (
            <Btn key={s || "all"} small kind={status === s ? "primary" : "ghost"} onClick={() => { setStatus(s); setPage(1); }}>
              {s || "All"}
            </Btn>
          ))}
        </div>
      }
    >
      {loading && !data && <Loading />}
      {error && <Notice kind="error">{error}</Notice>}
      {data && (data.data.length === 0 ? <Empty>No emails yet.</Empty> : (
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyles.table}>
            <thead>
              <tr>{["When", "To", "Email", "Result"].map((h) => <th key={h} style={tableStyles.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {data.data.map((row) => (
                <tr key={row.emailId}>
                  <td style={tableStyles.td}>{fmtDateTime(row.createdAt)}</td>
                  <td style={tableStyles.td}>{row.toEmail ?? "—"}</td>
                  <td style={tableStyles.td}>
                    <div style={{ fontWeight: 600 }}>{row.template.replace(/_/g, " ")}</div>
                    <div style={{ fontSize: 11.5, color: "var(--text-tertiary)" }}>{row.subject}</div>
                  </td>
                  <td style={tableStyles.td}>
                    <Pill tone={statusTone(row.status)}>{row.status}</Pill>
                    {row.error && <div style={{ fontSize: 11.5, color: "var(--red)", marginTop: 4, maxWidth: 260 }}>{row.error}</div>}
                  </td>
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

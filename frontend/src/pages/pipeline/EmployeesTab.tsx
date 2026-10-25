import { useState } from "react";
import { getEmployees, markEmployeeJoined, resetEmployeeCredentials } from "../../api/pipeline";
import {
  Btn, Empty, Loading, Messages, Notice, Pager, Panel, Pill, fmtDate, inputStyle,
  statusTone, tableStyles, useAction, useLoad,
} from "../../components/ui";

export default function EmployeesTab() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [term, setTerm] = useState("");
  const { data, error, loading, reload } = useLoad(() => getEmployees(page, term), [page, term]);
  const action = useAction();

  return (
    <Panel
      title="New hires"
      action={
        <form onSubmit={(e) => { e.preventDefault(); setPage(1); setTerm(search.trim()); }} style={{ display: "flex", gap: 6 }}>
          <input style={{ ...inputStyle, width: 220 }} placeholder="Search name, ID or email" value={search} onChange={(e) => setSearch(e.target.value)} />
          <Btn small type="submit" kind="ghost">Search</Btn>
        </form>
      }
    >
      <Messages error={action.error} success={action.success} />
      {loading && !data && <Loading />}
      {error && <Notice kind="error">{error}</Notice>}
      {data && (data.data.length === 0 ? (
        <Empty>No employees yet. They appear here automatically when a candidate accepts an offer.</Empty>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyles.table}>
            <thead>
              <tr>{["Employee", "Role", "Joining date", "Onboarding", "Status", "Actions"].map((h) => <th key={h} style={tableStyles.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {data.data.map((emp) => {
                const pct = emp.onboarding.total ? Math.round((emp.onboarding.done / emp.onboarding.total) * 100) : 0;
                return (
                  <tr key={emp.employeeId}>
                    <td style={tableStyles.td}>
                      <div style={{ fontWeight: 600 }}>{emp.fullName}</div>
                      <div style={{ fontSize: 11.5, color: "var(--text-tertiary)" }}>{emp.employeeCode} · {emp.workEmail}</div>
                    </td>
                    <td style={tableStyles.td}>{emp.designation}</td>
                    <td style={tableStyles.td}>{fmtDate(emp.joiningDate)}</td>
                    <td style={{ ...tableStyles.td, minWidth: 120 }}>
                      <div style={{ height: 7, background: "var(--bg-elevated)", borderRadius: 99, overflow: "hidden" }}>
                        <div style={{ width: `${pct}%`, height: "100%", background: "var(--green)" }} />
                      </div>
                      <div style={{ fontSize: 11.5, color: "var(--text-secondary)", marginTop: 3 }}>{emp.onboarding.done} of {emp.onboarding.total} tasks</div>
                    </td>
                    <td style={tableStyles.td}><Pill tone={statusTone(emp.status)}>{emp.status}</Pill></td>
                    <td style={tableStyles.td}>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {emp.status === "ONBOARDING" && (
                          <Btn small kind="success" disabled={action.busy}
                            onClick={() => void action.run(async () => { await markEmployeeJoined(emp.employeeId); await reload(); return `${emp.fullName} is now marked as joined.`; })}>
                            Mark joined
                          </Btn>
                        )}
                        <Btn small kind="ghost" disabled={action.busy}
                          onClick={() => {
                            if (!window.confirm(`Send ${emp.fullName} new login details? Their old password or link stops working.`)) return;
                            void action.run(async () => {
                              const result = await resetEmployeeCredentials(emp.employeeId);
                              return result.emailSent ? "New login details were emailed." : "New login details were created, but the email could not be sent.";
                            });
                          }}>
                          Reset login
                        </Btn>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
      {data && <Pager page={data.meta.page} totalPages={data.meta.totalPages} onChange={setPage} />}
    </Panel>
  );
}

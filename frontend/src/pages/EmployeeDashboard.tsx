import { useState } from "react";
import {
  changeMyPassword, completeOnboardingTask, downloadMyOfferLetter, getMyEmployeeProfile,
} from "../api/pipeline";
import {
  Btn, Field, Loading, Messages, Notice, PageShell, Panel, Pill, Stat, fmtDate, inputStyle,
  money, statusTone, useAction, useLoad,
} from "../components/ui";

const PASSWORD_RULE = /^(?=.*[A-Za-z])(?=.*\d).{8,72}$/;

/** What a new employee sees after signing in with the login created for them. */
export default function EmployeeDashboard() {
  const { data, error, loading, reload } = useLoad(getMyEmployeeProfile);
  const task = useAction();
  const download = useAction();

  if (loading && !data) return <Loading text="Loading your dashboard..." />;
  if (error && !data) return <PageShell><Notice kind="error">{error}</Notice></PageShell>;
  if (!data) return null;

  const { onboarding } = data;
  const pct = onboarding.total ? Math.round((onboarding.done / onboarding.total) * 100) : 0;
  const countdown =
    data.status === "ACTIVE" ? "You have joined" :
    data.daysUntilJoining > 0 ? `${data.daysUntilJoining} day${data.daysUntilJoining === 1 ? "" : "s"} to go` :
    data.daysUntilJoining === 0 ? "Your first day is today" : "Joining date has passed";

  return (
    <PageShell>
      <h1 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.4px" }}>
        Welcome, {data.fullName.split(" ")[0]}!
      </h1>
      <p style={{ margin: "0 0 20px", color: "var(--text-secondary)", fontSize: 13.5 }}>
        {data.designation}{data.department ? ` · ${data.department}` : ""}
      </p>

      {data.mustChangePassword && (
        <div style={{ marginBottom: 16 }}>
          <Notice kind="info">You are using a temporary password. Please change it below before you do anything else.</Notice>
        </div>
      )}

      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", marginBottom: 18 }}>
        <Stat label="Employee ID" value={data.employeeCode} />
        <Stat label="Joining date" value={fmtDate(data.joiningDate)} hint={countdown} tone="accent" />
        <Stat label="Onboarding" value={`${pct}%`} hint={`${onboarding.done} of ${onboarding.total} tasks done`} tone="green" />
        <Stat label="Pay" value={money(data.compensation.amount, data.compensation.currency, data.compensation.period)} />
      </div>

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", alignItems: "start" }}>
        <Panel title="Onboarding checklist" action={<Pill tone={statusTone(data.status)}>{data.status}</Pill>}>
          <div style={{ height: 8, background: "var(--bg-elevated)", borderRadius: 99, overflow: "hidden", marginBottom: 12 }}>
            <div style={{ width: `${pct}%`, height: "100%", background: "var(--green)", transition: "width .3s" }} />
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            {onboarding.tasks.map((item) => {
              const done = item.status === "DONE";
              return (
                <div key={item.taskId} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
                  padding: "9px 12px", border: "1px solid var(--border)", borderRadius: 8,
                  background: done ? "var(--green-light)" : "var(--surface)",
                }}>
                  <span style={{ fontSize: 13, color: "var(--text)", textDecoration: done ? "line-through" : "none" }}>
                    {done ? "✓ " : ""}{item.title}
                  </span>
                  {!done && (
                    <Btn small disabled={task.busy}
                      onClick={() => void task.run(async () => { await completeOnboardingTask(item.taskId); await reload(); })}>
                      Mark done
                    </Btn>
                  )}
                </div>
              );
            })}
          </div>
          <Messages error={task.error} success={null} />
        </Panel>

        <div style={{ display: "grid", gap: 16 }}>
          <PasswordPanel onChanged={reload} />
          <Panel title="Your details">
            <div style={{ display: "grid", gap: 6, fontSize: 13, color: "var(--text)" }}>
              <div><span style={{ color: "var(--text-secondary)" }}>Work email: </span>{data.workEmail}</div>
              <div><span style={{ color: "var(--text-secondary)" }}>Role: </span>{data.designation}</div>
            </div>
            <div style={{ marginTop: 12 }}>
              <Btn small kind="ghost" disabled={download.busy}
                onClick={() => void download.run(async () => { await downloadMyOfferLetter(); })}>
                Download my offer letter (PDF)
              </Btn>
              <Messages error={download.error} success={null} />
            </div>
          </Panel>
        </div>
      </div>
    </PageShell>
  );
}

function PasswordPanel({ onChanged }: { onChanged: () => void }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [again, setAgain] = useState("");
  const action = useAction();

  const problem =
    next && !PASSWORD_RULE.test(next) ? "Use 8 to 72 characters with at least one letter and one number." :
    again && next !== again ? "The two new passwords do not match." : "";

  const submit = () =>
    action.run(async () => {
      await changeMyPassword(current, next);
      setCurrent(""); setNext(""); setAgain("");
      onChanged();
      return "Your password was changed.";
    });

  return (
    <Panel title="Change password">
      <Field label="Current password">
        <input type="password" style={inputStyle} value={current} onChange={(e) => setCurrent(e.target.value)} autoComplete="current-password" />
      </Field>
      <Field label="New password" hint="At least 8 characters, with a letter and a number">
        <input type="password" style={inputStyle} value={next} onChange={(e) => setNext(e.target.value)} autoComplete="new-password" />
      </Field>
      <Field label="Type the new password again">
        <input type="password" style={inputStyle} value={again} onChange={(e) => setAgain(e.target.value)} autoComplete="new-password" />
      </Field>
      {problem && <div style={{ fontSize: 12, color: "var(--red)", marginBottom: 10 }}>{problem}</div>}
      <Btn disabled={!current || !next || !!problem || !again || action.busy} onClick={submit}>
        {action.busy ? "Saving..." : "Change password"}
      </Btn>
      <Messages error={action.error} success={action.success} />
    </Panel>
  );
}

import { getAutomationStatus, runAutomationNow } from "../../api/pipeline";
import type { AutomationSummary } from "../../api/pipeline";
import {
  Btn, Loading, Messages, Notice, Panel, Pill, Stat, fmtDateTime, useAction, useLoad,
} from "../../components/ui";

export default function AutomationTab() {
  const { data, error, loading, reload } = useLoad(getAutomationStatus);
  const action = useAction();

  if (loading && !data) return <Loading />;
  if (error && !data) return <Notice kind="error">{error}</Notice>;
  if (!data) return null;

  const run = () =>
    action.run(async () => {
      await runAutomationNow();
      await reload();
      return "The automation ran. The results are shown below.";
    });

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <Panel
        title="Background automation (autopilot)"
        action={<Btn disabled={action.busy} onClick={run}>{action.busy ? "Running..." : "Run now"}</Btn>}
      >
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 10 }}>
          <Pill tone={data.enabled ? "green" : "red"}>{data.enabled ? "ON" : "OFF"}</Pill>
          <span style={{ fontSize: 13, color: "var(--text)" }}>
            Runs on the schedule <code>{data.schedule}</code> (cron format). The default means every 30 minutes.
          </span>
        </div>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.8, color: "var(--text)" }}>
          <li>Offers and invitations nobody answered are marked <strong>expired</strong>, and the people involved are told.</li>
          <li>An open offer gets a reminder after <strong>{data.settings.offerReminderAfterDays} days</strong>.</li>
          <li>Interviews get a reminder <strong>{data.settings.interviewReminderHoursBefore} hours</strong> before they start.</li>
          <li>Interview slots not chosen after <strong>{data.settings.slotReminderAfterDays} days</strong> get a reminder.</li>
          <li>Employees are marked <strong>Joined</strong> when their joining date arrives.</li>
        </ul>
        <Messages error={action.error} success={action.success} />
      </Panel>

      <Panel title={data.lastRun ? `Last run (${data.lastRun.trigger === "manual" ? "started by a person" : "scheduled"}, ${fmtDateTime(data.lastRun.ranAt)})` : "Last run"}>
        {data.lastRun ? <Summary summary={data.lastRun} /> : <Notice>It has not run since the server started. Press "Run now" to try it.</Notice>}
      </Panel>
    </div>
  );
}

function Summary({ summary }: { summary: AutomationSummary }) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>
        <Stat label="Offers expired" value={summary.offersExpired} tone="amber" />
        <Stat label="Offer reminders" value={summary.offerReminders} />
        <Stat label="Interview reminders" value={summary.interviewReminders} />
        <Stat label="Slot reminders" value={summary.slotReminders} />
        <Stat label="Invitations expired" value={summary.invitationsExpired} tone="amber" />
        <Stat label="Employees joined" value={summary.employeesJoined.length} tone="green" hint={summary.employeesJoined.join(", ")} />
      </div>
      <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>Took {summary.durationMs} ms</div>
      {summary.errors.length > 0 && (
        <Notice kind="error">
          Some tasks had a problem (the others still ran): {summary.errors.join(" | ")}
        </Notice>
      )}
    </div>
  );
}

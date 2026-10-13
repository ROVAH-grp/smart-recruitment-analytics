import { useState } from "react";
import { getOverview } from "../../api/pipeline";
import {
  Btn, Empty, Loading, Notice, Panel, Pill, Stat, statusTone, tableStyles, useLoad,
} from "../../components/ui";

export default function OverviewTab({ onOpenApplication }: { onOpenApplication: (id: string) => void }) {
  const [days, setDays] = useState(30);
  const [scope, setScope] = useState<"pipeline" | "all">("pipeline");
  const { data, error, loading, reload } = useLoad(() => getOverview(days, 7, scope), [days, scope]);

  if (loading && !data) return <Loading text="Loading the pipeline overview..." />;
  if (error && !data) return <Notice kind="error">{error}</Notice>;
  if (!data) return null;

  const widest = Math.max(1, ...data.funnel.map((f) => f.reached));
  const a = data.attention;

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>Recent results:</span>
          {[7, 30, 90].map((d) => (
            <Btn key={d} small kind={days === d ? "primary" : "ghost"} onClick={() => setDays(d)}>{d} days</Btn>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>Stuck list:</span>
          <Btn small kind={scope === "pipeline" ? "primary" : "ghost"} onClick={() => setScope("pipeline")}>Automated pipeline</Btn>
          <Btn small kind={scope === "all" ? "primary" : "ghost"} onClick={() => setScope("all")}>Include imported data</Btn>
          <Btn small kind="ghost" onClick={() => void reload()}>Refresh</Btn>
        </div>
      </div>

      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))" }}>
        <Stat label="Applications" value={data.totals.applications} />
        <Stat label="Open right now" value={data.totals.open} tone="accent" />
        <Stat label="Joined" value={data.totals.joined} tone="green" />
        <Stat label="Rejected" value={data.totals.rejected} tone="red" />
        <Stat label="Withdrawn" value={data.totals.withdrawn} tone="amber" />
      </div>

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))" }}>
        <Panel title="Hiring funnel">
          <div style={{ display: "grid", gap: 8 }}>
            {data.funnel.map((row) => (
              <div key={row.stage}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "var(--text)", marginBottom: 3 }}>
                  <span style={{ fontWeight: 600 }}>{row.stage}</span>
                  <span style={{ color: "var(--text-secondary)" }}>
                    {row.reached}
                    {row.fromPreviousStage !== null && <> · {row.fromPreviousStage}% of previous</>}
                  </span>
                </div>
                <div style={{ height: 9, background: "var(--bg-elevated)", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ width: `${(row.reached / widest) * 100}%`, height: "100%", background: "var(--accent)", borderRadius: 99 }} />
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Needs attention">
          <div style={{ display: "grid", gap: 8, fontSize: 13, color: "var(--text)" }}>
            <Row label="Offers waiting for an answer" value={a.offersAwaitingAnswer} warn={a.offersExpiringWithin2Days > 0 ? `${a.offersExpiringWithin2Days} expire within 2 days` : undefined} />
            <Row label="Interviews in the next 7 days" value={a.interviewsNext7Days} />
            <Row label="Interview slots not yet chosen" value={a.interviewSlotsAwaitingCandidate} />
            <Row label="Invitations waiting for an answer" value={a.invitationsAwaitingAnswer} />
            <Row label="Employees onboarding" value={a.employeesOnboarding} />
          </div>
        </Panel>
      </div>

      <Panel title={`Stuck for more than ${a.stuckAfterDays} days (${a.stuckCount})`}>
        {a.stuck.length === 0 ? (
          <Empty>Nothing is stuck. Every application is moving.</Empty>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyles.table}>
              <thead>
                <tr>
                  {["Application", "Candidate", "Job", "Stage", "Days in stage", ""].map((h) => (
                    <th key={h} style={tableStyles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {a.stuck.map((row) => (
                  <tr key={row.applicationId}>
                    <td style={tableStyles.td}>#{row.applicationId}</td>
                    <td style={tableStyles.td}>{row.candidate ?? "—"}</td>
                    <td style={tableStyles.td}>{row.job ?? "—"}</td>
                    <td style={tableStyles.td}><Pill tone={statusTone(row.status)}>{row.status}</Pill></td>
                    <td style={tableStyles.td}>{row.daysInStage}</td>
                    <td style={tableStyles.td}><Btn small kind="ghost" onClick={() => onOpenApplication(row.applicationId)}>Open</Btn></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))" }}>
        <Panel title={`Last ${data.recent.windowDays} days`}>
          <div style={{ display: "grid", gap: 8, fontSize: 13, color: "var(--text)" }}>
            <Row label="New applications" value={data.recent.newApplications} />
            <Row label="Offers accepted" value={data.recent.offersAccepted} />
            <Row label="Offers declined" value={data.recent.offersDeclined} />
            <Row label="Employees joined" value={data.recent.joined} />
            <Row label="Emails sent" value={data.recent.emails.sent} warn={data.recent.emails.failed > 0 ? `${data.recent.emails.failed} failed` : undefined} />
          </div>
        </Panel>

        <Panel title="Average days from application">
          <div style={{ display: "grid", gap: 8, fontSize: 13, color: "var(--text)" }}>
            {Object.entries(data.averageDaysFromApplication).map(([stage, value]) => (
              <Row key={stage} label={`to ${stage}`} value={value === null ? "—" : `${value} days`} />
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function Row({ label, value, warn }: { label: string; value: number | string; warn?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, borderBottom: "1px solid var(--border-light)", paddingBottom: 6 }}>
      <span style={{ color: "var(--text-secondary)" }}>{label}</span>
      <span style={{ fontWeight: 700 }}>
        {value}
        {warn && <span style={{ marginLeft: 8, color: "var(--red)", fontWeight: 600, fontSize: 12 }}>{warn}</span>}
      </span>
    </div>
  );
}

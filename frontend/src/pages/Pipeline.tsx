import { useState } from "react";
import { PageShell, Tabs } from "../components/ui";
import ActivityTab from "./pipeline/ActivityTab";
import AutomationTab from "./pipeline/AutomationTab";
import EmployeesTab from "./pipeline/EmployeesTab";
import InvitationsTab from "./pipeline/InvitationsTab";
import OverviewTab from "./pipeline/OverviewTab";
import WorkflowPanel from "./pipeline/WorkflowPanel";
import WorkflowTab from "./pipeline/WorkflowTab";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "workflow", label: "Applications" },
  { id: "invitations", label: "Invitations" },
  { id: "employees", label: "New hires" },
  { id: "activity", label: "Activity" },
  { id: "automation", label: "Automation" },
];

/** The recruiter's control room for the automated hiring pipeline. */
export default function Pipeline() {
  const [tab, setTab] = useState("overview");
  const [openId, setOpenId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <PageShell>
      <h1 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.4px" }}>Hiring Pipeline</h1>
      <p style={{ margin: "0 0 18px", color: "var(--text-secondary)", fontSize: 13.5 }}>
        Everything from application to employee, with the automatic steps and what needs your attention.
      </p>

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      {tab === "overview" && <OverviewTab key={refreshKey} onOpenApplication={setOpenId} />}
      {tab === "workflow" && <WorkflowTab refreshKey={refreshKey} onOpenApplication={setOpenId} />}
      {tab === "invitations" && <InvitationsTab />}
      {tab === "employees" && <EmployeesTab key={refreshKey} />}
      {tab === "activity" && <ActivityTab key={refreshKey} onOpenApplication={setOpenId} />}
      {tab === "automation" && <AutomationTab key={refreshKey} />}

      {openId && (
        <WorkflowPanel
          key={openId}
          applicationId={openId}
          onClose={() => setOpenId(null)}
          onChanged={() => setRefreshKey((k) => k + 1)}
        />
      )}
    </PageShell>
  );
}

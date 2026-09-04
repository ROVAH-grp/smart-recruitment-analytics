import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Applications from "./pages/Applications";
import Candidates from "./pages/Candidates";
import Jobs from "./pages/Jobs";
import Interviews from "./pages/Interviews";
import Offers from "./pages/Offers";
import JoiningRecords from "./pages/JoiningRecords";
import Recruiters from "./pages/Recruiters";
import Sources from "./pages/Sources";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";

const PAGE_META: Record<string, { title: string; subtitle: string }> = {
  dashboard:    { title: "Dashboard",        subtitle: "Recruitment pipeline at a glance" },
  candidates:   { title: "Candidates",       subtitle: "Manage candidate profiles and status" },
  jobs:         { title: "Jobs",             subtitle: "Track open positions and postings" },
  applications: { title: "Applications",     subtitle: "Review and manage all applications" },
  interviews:   { title: "Interviews",       subtitle: "Schedule and review candidate interviews" },
  offers:       { title: "Offers",           subtitle: "Track offer letters and confirmations" },
  joining:      { title: "Joining Records",  subtitle: "Employee onboarding and joining history" },
  recruiters:   { title: "Recruiters",       subtitle: "Recruiter assignments and performance" },
  sources:      { title: "Sources",          subtitle: "Applicant sourcing channel performance" },
  analytics:    { title: "Analytics",        subtitle: "In-depth recruitment performance insights" },
  settings:     { title: "Settings",         subtitle: "Account, company, and system preferences" },
};

function PageContent({ page }: { page: string }) {
  switch (page) {
    case "dashboard":    return <Dashboard />;
    case "candidates":   return <Candidates />;
    case "jobs":         return <Jobs />;
    case "applications": return <Applications />;
    case "interviews":   return <Interviews />;
    case "offers":       return <Offers />;
    case "joining":      return <JoiningRecords />;
    case "recruiters":   return <Recruiters />;
    case "sources":      return <Sources />;
    case "analytics":    return <Analytics />;
    case "settings":     return <Settings />;
    default:             return <Dashboard />;
  }
}

export default function App() {
  const [page, setPage] = useState("dashboard");
  const meta = PAGE_META[page] ?? PAGE_META.dashboard;

  return (
    <div style={{ display: "flex", height: "100vh", background: "var(--bg)", overflow: "hidden" }}>
      <Sidebar active={page} onNavigate={p => setPage(p)} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", marginLeft: "var(--sidebar-width)", minWidth: 0, overflow: "hidden" }}>
        <Navbar title={meta.title} subtitle={meta.subtitle} page={page} />
        <main style={{ flex: 1, overflowY: "auto" }}>
          <PageContent page={page} />
        </main>
      </div>
    </div>
  );
}

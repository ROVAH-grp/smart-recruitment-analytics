import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Applications from "./pages/Applications";
import Candidates from "./pages/Candidates";
import CandidateDetail from "./pages/CandidateDetail";
import Jobs from "./pages/Jobs";
import Interviews from "./pages/Interviews";
import Offers from "./pages/Offers";
import JoiningRecords from "./pages/JoiningRecords";
import Recruiters from "./pages/Recruiters";
import Sources from "./pages/Sources";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import AccessDenied from "./pages/AccessDenied";
import MyJourney from "./pages/MyJourney";
import type { JourneyFocus } from "./pages/MyJourney";
import Pipeline from "./pages/Pipeline";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import StaffAccounts from "./pages/StaffAccounts";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { useAuth } from "./context/AuthContext";

/**
 * Links in our emails open the app with an address such as
 * /reset-password?token=..., /activate?token=..., /offers/<token>,
 * /interviews/<id> or /invitations/<token>. There is no router in this app,
 * so the address is read once when the app starts.
 */
type DeepLink =
  | { kind: "reset" | "activate"; token: string }
  | { kind: "focus"; focus: JourneyFocus }
  | null;

function readDeepLink(): DeepLink {
  const path = window.location.pathname.replace(/\/+$/, "");
  const token = new URLSearchParams(window.location.search).get("token");

  if ((path === "/reset-password" || path === "/activate") && token) {
    return { kind: path === "/activate" ? "activate" : "reset", token };
  }

  const match = path.match(/^\/(invitations|offers|interviews)\/([^/]+)$/);
  if (match) {
    const kinds = { invitations: "invitation", offers: "offer", interviews: "interview" } as const;
    return { kind: "focus", focus: { kind: kinds[match[1] as keyof typeof kinds], id: decodeURIComponent(match[2]) } };
  }

  return null;
}

const PAGE_META: Record<string, { title: string; subtitle: string }> = {
  pipeline: {
    title: "Hiring Pipeline",
    subtitle: "Overview, applications, interviews, offers and automation",
  },
  journey: {
    title: "My Hiring Journey",
    subtitle: "Apply, choose interview times and answer offers",
  },
  employee: {
    title: "My Dashboard",
    subtitle: "Your onboarding and employee details",
  },
  staff: {
    title: "Staff Accounts",
    subtitle: "Create logins for recruiters",
  },
  dashboard: {
    title: "Dashboard",
    subtitle: "Recruitment pipeline at a glance",
  },
  candidates: {
    title: "Candidates",
    subtitle: "Manage candidate profiles and status",
  },
  "candidate-detail": {
    title: "Candidate Profile",
    subtitle: "Candidate information and recruitment activity",
  },
  jobs: {
    title: "Jobs",
    subtitle: "Track open positions and postings",
  },
  applications: {
    title: "Applications",
    subtitle: "Review and manage all applications",
  },
  interviews: {
    title: "Interviews",
    subtitle: "Schedule and review candidate interviews",
  },
  offers: {
    title: "Offers",
    subtitle: "Track offer letters and confirmations",
  },
  joining: {
    title: "Joining Records",
    subtitle: "Employee onboarding and joining history",
  },
  recruiters: {
    title: "Recruiters",
    subtitle: "Recruiter assignments and performance",
  },
  sources: {
    title: "Sources",
    subtitle: "Applicant sourcing channel performance",
  },
  analytics: {
    title: "Analytics",
    subtitle: "In-depth recruitment performance insights",
  },
  settings: {
    title: "Settings",
    subtitle: "Account, company, and system preferences",
  },
};

interface PageContentProps {
  page: string;
  candidateId: string | null;
  applicationCandidateId: string | null;
  onCandidateClick: (candidateId: string) => void;
  onCandidateBack: () => void;
  onCandidateApplications: (candidateId: string) => void;
  journeyFocus: JourneyFocus | null;
  onJourneyFocusUsed: () => void;
}

function PageContent({
  page,
  candidateId,
  applicationCandidateId,
  onCandidateClick,
  onCandidateBack,
  onCandidateApplications,
  journeyFocus,
  onJourneyFocusUsed,
}: PageContentProps) {
  switch (page) {
    case "pipeline":
      return <Pipeline />;

    case "journey":
      return <MyJourney focus={journeyFocus} onFocusUsed={onJourneyFocusUsed} />;

    case "employee":
      return <EmployeeDashboard />;

    case "staff":
      return <StaffAccounts />;

    case "dashboard":
      return <Dashboard />;

    case "candidates":
      return <Candidates onCandidateClick={onCandidateClick} />;

    case "candidate-detail":
      if (!candidateId) {
        return <Candidates onCandidateClick={onCandidateClick} />;
      }

      return (
        <CandidateDetail
          candidateId={candidateId}
          onBack={onCandidateBack}
          onViewApplications={onCandidateApplications}
        />
      );

    case "applications":
      return <Applications candidateId={applicationCandidateId} />;

    case "jobs":
      return <Jobs />;

    case "interviews":
      return <Interviews />;

    case "offers":
      return <Offers />;

    case "joining":
      return <JoiningRecords />;

    case "recruiters":
      return <Recruiters />;

    case "sources":
      return <Sources />;

    case "analytics":
      return <Analytics />;

    case "settings":
      return <Settings />;

    default:
      return <Dashboard />;
  }
}

export default function App() {
  const { user, isAuthenticated } = useAuth();

  const [selectedPage, setPage] = useState("dashboard");
  const page = user?.role === "EMPLOYEE" ? "employee" : selectedPage;
  const [candidateId, setCandidateId] = useState<string | null>(null);
  const [applicationCandidateId, setApplicationCandidateId] =
    useState<string | null>(null);
const [showRegister, setShowRegister] = useState(false);
const [showForgotPassword, setShowForgotPassword] = useState(false);
const [deepLink] = useState<DeepLink>(readDeepLink);
const [resetToken, setResetToken] = useState<string | null>(
  deepLink && deepLink.kind !== "focus" ? deepLink.token : null,
);
const [resetMode, setResetMode] = useState<"reset" | "activate">(
  deepLink?.kind === "activate" ? "activate" : "reset",
);
const [journeyFocus, setJourneyFocus] = useState<JourneyFocus | null>(
  deepLink?.kind === "focus" ? deepLink.focus : null,
);
const [showAccessDenied, setShowAccessDenied] = useState(false);

  const openCandidate = (id: string) => {
    setCandidateId(id);
    setPage("candidate-detail");
  };

  const closeCandidate = () => {
    setCandidateId(null);
    setPage("candidates");
  };

  const openCandidateApplications = (id: string) => {
    setCandidateId(null);
    setApplicationCandidateId(id);
    setPage("applications");
  };

const canAccessPage = (pageId: string) => {
  if (!user) return false;

  if (user.role === "ADMIN") {
    return pageId !== "journey" && pageId !== "employee";
  }

  if (user.role === "EMPLOYEE") {
    return pageId === "employee";
  }

  if (user.role === "RECRUITER") {
    return [
      "pipeline",
      "dashboard",
      "candidates",
      "jobs",
      "applications",
      "interviews",
      "offers",
      "joining",
      "analytics",
      "settings",
    ].includes(pageId);
  }

  if (user.role === "CANDIDATE") {
    return [
      "journey",
      "dashboard",
      "jobs",
      "applications",
      "interviews",
      "offers",
      "joining",
      "settings",
    ].includes(pageId);
  }

  return false;
};

 useEffect(() => {
  if (deepLink) {
    window.history.replaceState(null, "", "/");
  }
}, [deepLink]);

 // Where each kind of user lands after signing in.
 useEffect(() => {
  if (!user) return;

  if (user.role === "EMPLOYEE") {
    setPage("employee");
  } else if (user.role === "CANDIDATE" && journeyFocus) {
    setPage("journey");
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [user?.userId]);

 useEffect(() => {
  if (
    isAuthenticated &&
    page !== "dashboard" &&
    !canAccessPage(page)
  ) {
    setShowAccessDenied(true);
  }
}, [isAuthenticated, page, user]);

   // Not logged in → show authentication pages
  if (!isAuthenticated) {
  if (showRegister) {
    return (
      <Register
        onBackToLogin={() => setShowRegister(false)}
        onRegistered={() => setShowRegister(false)}
      />
    );
  }

  if (showForgotPassword) {
  return (
    <ForgotPassword
      onBackToLogin={() => setShowForgotPassword(false)}
      onResetPassword={(token) => {
        setResetToken(token);
        setResetMode("reset");
        setShowForgotPassword(false);
      }}
    />
  );
}

if (resetToken) {
  return (
    <ResetPassword
      token={resetToken}
      mode={resetMode}
      onBackToLogin={() => {
        setResetToken(null);
        setResetMode("reset");
      }}
    />
  );
}

  return (
    <Login
  onLoginSuccess={() => {
    setPage("dashboard");
  }}
  onRegisterClick={() => {
    setShowRegister(true);
  }}
  onForgotPassword={() => {
    setShowForgotPassword(true);
  }}
/>
  );
}

if (showAccessDenied) {
  return (
    <AccessDenied
      onBackToDashboard={() => {
        setShowAccessDenied(false);
        setPage("dashboard");
      }}
    />
  );
}

  const meta = PAGE_META[page] ?? PAGE_META.dashboard;

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "var(--bg)",
        overflow: "hidden",
      }}
    >
      <Sidebar
        active={page === "candidate-detail" ? "candidates" : page}
        onNavigate={(p) => {
          setCandidateId(null);
          setApplicationCandidateId(null);
          setPage(p);
        }}
      />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          marginLeft: "var(--sidebar-width)",
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        <Navbar
          title={meta.title}
          subtitle={meta.subtitle}
          page={page}
        />

        <main
          style={{
            flex: 1,
            overflowY: "auto",
          }}
        >
          <PageContent
            page={page}
            candidateId={candidateId}
            applicationCandidateId={applicationCandidateId}
            onCandidateClick={openCandidate}
            onCandidateBack={closeCandidate}
            onCandidateApplications={openCandidateApplications}
            journeyFocus={journeyFocus}
            onJourneyFocusUsed={() => setJourneyFocus(null)}
          />
        </main>
      </div>
    </div>
  );
}
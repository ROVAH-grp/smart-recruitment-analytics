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

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { useAuth } from "./context/AuthContext";

const PAGE_META: Record<string, { title: string; subtitle: string }> = {
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
}

function PageContent({
  page,
  candidateId,
  applicationCandidateId,
  onCandidateClick,
  onCandidateBack,
  onCandidateApplications,
}: PageContentProps) {
  switch (page) {
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

  const [page, setPage] = useState("dashboard");
  const [candidateId, setCandidateId] = useState<string | null>(null);
  const [applicationCandidateId, setApplicationCandidateId] =
    useState<string | null>(null);
const [showRegister, setShowRegister] = useState(false);
const [showForgotPassword, setShowForgotPassword] = useState(false);
const [resetToken, setResetToken] = useState<string | null>(null);
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
    return true;
  }

  if (user.role === "RECRUITER") {
    return [
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
        setShowForgotPassword(false);
      }}
    />
  );
}

if (resetToken) {
  return (
    <ResetPassword
      token={resetToken}
      onBackToLogin={() => {
        setResetToken(null);
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
          />
        </main>
      </div>
    </div>
  );
}
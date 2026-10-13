import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

interface NavItem {
  id: string;
  label: string;
  icon: ReactNode;
  badge?: number;
}

interface SidebarProps {
  active: string;
  onNavigate: (id: string) => void;
}

const sections = [
  {
    label: "OVERVIEW",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><rect x="2" y="2" width="7" height="7" rx="1.5"/><rect x="11" y="2" width="7" height="7" rx="1.5"/><rect x="11" y="11" width="7" height="7" rx="1.5"/><rect x="2" y="11" width="7" height="7" rx="1.5"/></svg>,
      },
    ],
  },
  {
    label: "HIRING AUTOMATION",
    items: [
      {
        id: "pipeline",
        label: "Hiring Pipeline",
        icon: <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><path d="M3 4h14M5 9h10M7 14h6"/><circle cx="10" cy="17.5" r="0.8" fill="currentColor" stroke="none"/></svg>,
      },
      {
        id: "journey",
        label: "My Journey",
        icon: <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><circle cx="4" cy="15" r="1.6"/><circle cx="16" cy="5" r="1.6"/><path d="M5.5 14C9 14 8 6 14.4 5.4"/></svg>,
      },
      {
        id: "employee",
        label: "My Dashboard",
        icon: <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><rect x="3" y="3" width="14" height="14" rx="2"/><path d="M7 10l2 2 4-4"/></svg>,
      },
      {
        id: "staff",
        label: "Staff Accounts",
        icon: <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><circle cx="8" cy="6" r="3"/><path d="M2 17c0-3 2.7-5 6-5"/><path d="M15 11v6M12 14h6"/></svg>,
      },
    ],
  },
  {
    label: "PIPELINE",
    items: [
      {
        id: "candidates",
        label: "Candidates",
        badge: 24,
        icon: <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><circle cx="10" cy="6" r="3.5"/><path d="M3 17c0-3.5 3.13-6 7-6s7 2.5 7 6"/></svg>,
      },
      {
        id: "jobs",
        label: "Jobs",
        badge: 8,
        icon: <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><rect x="2" y="6" width="16" height="12" rx="2"/><path d="M13 6V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2"/></svg>,
      },
      {
        id: "applications",
        label: "Applications",
        badge: 12,
        icon: <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><path d="M12 2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z"/><polyline points="12,2 12,7 17,7"/><line x1="8" y1="12" x2="12" y2="12"/><line x1="8" y1="15" x2="10" y2="15"/></svg>,
      },
      {
        id: "interviews",
        label: "Interviews",
        badge: 5,
        icon: <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><rect x="2" y="3" width="16" height="16" rx="2"/><line x1="13" y1="1" x2="13" y2="5"/><line x1="7" y1="1" x2="7" y2="5"/><line x1="2" y1="9" x2="18" y2="9"/><circle cx="10" cy="13" r="1.5" fill="currentColor" stroke="none"/></svg>,
      },
      {
        id: "offers",
        label: "Offers",
        badge: 3,
        icon: <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><polyline points="20,6 11,13 2,6"/><rect x="2" y="4" width="18" height="14" rx="2"/></svg>,
      },
      {
        id: "joining",
        label: "Joining Records",
        icon: <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><path d="M9 11l2 2 4-4"/><rect x="2" y="2" width="16" height="16" rx="2"/></svg>,
      },
    ],
  },
  {
    label: "MANAGEMENT",
    items: [
      {
        id: "recruiters",
        label: "Recruiters",
        icon: <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><path d="M14 17v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 2 15.5V17"/><circle cx="7" cy="6" r="3.5"/><path d="M19 17v-1.5a3.5 3.5 0 0 0-2.5-3.37"/><path d="M13.5 2.63a3.5 3.5 0 0 1 0 6.74"/></svg>,
      },
      {
        id: "sources",
        label: "Sources",
        icon: <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><circle cx="15" cy="4" r="2.5"/><circle cx="5" cy="10" r="2.5"/><circle cx="15" cy="16" r="2.5"/><line x1="7.5" y1="11.3" x2="12.5" y2="14.7"/><line x1="12.5" y1="5.3" x2="7.5" y2="8.7"/></svg>,
      },
    ],
  },
  {
    label: "INSIGHTS",
    items: [
      {
        id: "analytics",
        label: "Analytics",
        icon: <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><line x1="15" y1="17" x2="15" y2="8"/><line x1="10" y1="17" x2="10" y2="3"/><line x1="5" y1="17" x2="5" y2="11"/></svg>,
      },
      {
        id: "settings",
        label: "Settings",
        icon: <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><circle cx="10" cy="10" r="2.5"/><path d="M10 1.5v2M10 16.5v2M1.5 10h2M16.5 10h2M4.04 4.04l1.42 1.42M14.54 14.54l1.42 1.42M4.04 15.96l1.42-1.42M14.54 5.46l1.42-1.42"/></svg>,
      },
    ],
  },
];

export default function Sidebar({
  active,
  onNavigate,
}: SidebarProps) {
  const { user, logout } = useAuth();

  const role = user?.role;

  const canSee = (id: string) => {
    if (role === "ADMIN") {
      return id !== "journey" && id !== "employee";
    }

    if (role === "RECRUITER") {
      return !["recruiters", "staff", "journey", "employee"].includes(id);
    }

    if (role === "EMPLOYEE") {
      return id === "employee";
    }

    if (role === "CANDIDATE") {
      return [
        "dashboard",
        "journey",
        "jobs",
        "applications",
        "interviews",
        "offers",
        "joining",
        "settings",
      ].includes(id);
    }

    return false;
  };

  const visibleSections = sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => canSee(item.id)),
    }))
    .filter((section) => section.items.length > 0);

  const displayName =
    user?.email?.split("@")[0] || "User";

  const roleLabel =
    role === "ADMIN"
      ? "Administrator"
      : role === "RECRUITER"
        ? "Recruiter"
        : role === "EMPLOYEE"
          ? "Employee"
          : "Candidate";

  return (
    <aside
      style={{
        width: "var(--sidebar-width)",
        minWidth: "var(--sidebar-width)",
        height: "100vh",
        background: "var(--sidebar-bg)",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 100,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(79,110,247,0.6), transparent)",
        }}
      />

      {/* Logo */}
      <div
        style={{
          padding: "20px 18px 16px",
          borderBottom: "1px solid var(--sidebar-border)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background:
                "linear-gradient(135deg, #4F6EF7 0%, #818CF8 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 4px 12px rgba(79,110,247,0.4)",
            }}
          >
            <svg viewBox="0 0 20 20" fill="none" width="16" height="16">
              <path
                d="M10 2L2.5 6.5l7.5 4 7.5-4L10 2z"
                stroke="white"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <path
                d="M2.5 10.5l7.5 4 7.5-4"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2.5 14l7.5 4 7.5-4"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.5"
              />
            </svg>
          </div>

          <div>
            <div
              style={{
                color: "#F9FAFB",
                fontWeight: 700,
                fontSize: 15,
                letterSpacing: "-0.3px",
                lineHeight: 1.1,
              }}
            >
              RecruitFlow
            </div>

            <div
              style={{
                color: "var(--sidebar-text)",
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: "0.8px",
                textTransform: "uppercase",
                marginTop: 1,
              }}
            >
              Analytics
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav
        style={{
          flex: 1,
          padding: "10px 10px 10px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 0,
        }}
      >
        {visibleSections.map((section) => (
          <div
            key={section.label}
            style={{ marginBottom: 4 }}
          >
            <div
              style={{
                padding: "10px 10px 5px",
                fontSize: 9.5,
                fontWeight: 700,
                letterSpacing: "1px",
                color: "var(--sidebar-text)",
                textTransform: "uppercase",
              }}
            >
              {section.label}
            </div>

            {section.items.map((item) => {
              const isActive = active === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                    padding: "8px 10px",
                    borderRadius: 8,
                    border: "none",
                    cursor: "pointer",
                    width: "100%",
                    textAlign: "left",
                    background: isActive
                      ? "var(--sidebar-item-active)"
                      : "transparent",
                    color: isActive
                      ? "var(--sidebar-text-active)"
                      : "var(--sidebar-text)",
                    fontFamily: "inherit",
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 400,
                    marginBottom: 1,
                    position: "relative",
                    transition: "all 0.15s ease",
                    boxShadow: isActive
                      ? "inset 0 0 0 1px rgba(79,110,247,0.2)"
                      : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.05)";
                      e.currentTarget.style.color =
                        "rgba(209,213,219,0.9)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background =
                        "transparent";
                      e.currentTarget.style.color =
                        "var(--sidebar-text)";
                    }
                  }}
                >
                  {isActive && (
                    <span
                      style={{
                        position: "absolute",
                        left: 0,
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: 3,
                        height: 16,
                        borderRadius: "0 2px 2px 0",
                        background: "var(--sidebar-indicator)",
                      }}
                    />
                  )}

                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 18,
                      height: 18,
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </span>

                  <span
                    style={{
                      flex: 1,
                      letterSpacing: "-0.1px",
                    }}
                  >
                    {item.label}
                  </span>

                  {item.badge !== undefined && (
                    <span
                      style={{
                        fontSize: 10.5,
                        fontWeight: 700,
                        background: isActive
                          ? "rgba(79,110,247,0.35)"
                          : "rgba(255,255,255,0.08)",
                        color: isActive
                          ? "#A5B4FC"
                          : "var(--sidebar-text)",
                        padding: "1px 6px",
                        borderRadius: 99,
                        letterSpacing: "0",
                        lineHeight: "16px",
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div
        style={{
          padding: "12px 12px 14px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background:
                "linear-gradient(135deg, #4F6EF7 0%, #818CF8 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13.5,
              fontWeight: 700,
              color: "#fff",
              flexShrink: 0,
              textTransform: "uppercase",
            }}
          >
            {displayName.charAt(0)}
          </div>

          <div
            style={{
              flex: 1,
              minWidth: 0,
            }}
          >
            <div
              style={{
                color: "rgba(249,250,251,0.9)",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "-0.1px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {displayName}
            </div>

            <div
              style={{
                color: "var(--sidebar-text)",
                fontSize: 11,
                marginTop: 1,
              }}
            >
              {roleLabel}
            </div>
          </div>

          <button
            onClick={logout}
            title="Logout"
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--sidebar-text)",
            }}
          >
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              width="13"
              height="13"
            >
              <path d="M6 14H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h3" />
              <polyline points="11,11 14,8 11,5" />
              <line x1="14" y1="8" x2="6" y2="8" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}
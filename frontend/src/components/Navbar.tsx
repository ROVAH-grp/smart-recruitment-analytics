import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { getCandidate } from "../api/candidates";

interface NavbarProps {
  title: string;
  subtitle?: string;
  page?: string;
}

const BREADCRUMBS: Record<string, string[]> = {
  dashboard: ["Home", "Dashboard"],
  candidates: ["Home", "Candidates"],
  jobs: ["Home", "Jobs"],
  applications: ["Home", "Applications"],
  interviews: ["Home", "Interviews"],
  offers: ["Home", "Offers"],
  joining: ["Home", "Joining Records"],
  recruiters: ["Home", "Recruiters"],
  sources: ["Home", "Sources"],
  analytics: ["Home", "Analytics"],
  settings: ["Home", "Settings"],
};

function formatDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function Navbar({
  title,
  subtitle,
  page,
}: NavbarProps) {
  const { theme, toggle } = useTheme();
 const { user, profileVersion } = useAuth();

  const [notifOpen, setNotifOpen] = useState(false);
  const [candidateName, setCandidateName] = useState("User");

  const crumbs = BREADCRUMBS[page || "dashboard"] || ["Home", title];

  useEffect(() => {
    const loadUserName = async () => {
      if (user?.role === "CANDIDATE" && user.candidateId) {
        try {
          const candidate = await getCandidate(user.candidateId);
          setCandidateName(candidate.candidateName);
        } catch (error) {
          console.error("Failed to load candidate name:", error);
        }
      } else if (user?.email) {
        setCandidateName(user.email.split("@")[0]);
      }
    };

    loadUserName();
 }, [user, profileVersion]);

  const notifications = [
    {
      icon: "📋",
      text: "New application from Riya Desai",
      time: "2m ago",
      unread: true,
    },
    {
      icon: "📅",
      text: "Interview scheduled with Aryan Mehta",
      time: "18m ago",
      unread: true,
    },
    {
      icon: "✅",
      text: "Offer accepted by Priya Sharma",
      time: "1h ago",
      unread: false,
    },
    {
      icon: "📊",
      text: "Weekly pipeline report is ready",
      time: "3h ago",
      unread: false,
    },
  ];

  const isDark = theme === "dark";

  return (
    <header
      style={{
        height: 58,
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        position: "sticky",
        top: 0,
        zIndex: 50,
        gap: 16,
      }}
    >
      {/* Left: breadcrumb + title */}
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            marginBottom: 1,
          }}
        >
          {crumbs.map((c, i) => (
            <span
              key={c}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              {i > 0 && (
                <svg
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="var(--text-tertiary)"
                  strokeWidth="1.5"
                  width="10"
                  height="10"
                >
                  <polyline points="4,2 8,6 4,10" />
                </svg>
              )}

              <span
                style={{
                  fontSize: 11.5,
                  color:
                    i === crumbs.length - 1
                      ? "var(--accent)"
                      : "var(--text-tertiary)",
                  fontWeight:
                    i === crumbs.length - 1 ? 600 : 400,
                }}
              >
                {c}
              </span>
            </span>
          ))}
        </div>

        <h1
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: "var(--text)",
            margin: 0,
            letterSpacing: "-0.3px",
            lineHeight: 1,
          }}
        >
          {title}
        </h1>

        {subtitle && (
          <div
            style={{
              fontSize: 11,
              color: "var(--text-tertiary)",
              marginTop: 4,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>

      {/* Right */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexShrink: 0,
        }}
      >
        {/* Date chip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "5px 11px",
            borderRadius: 8,
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            fontSize: 12,
            fontWeight: 500,
            color: "var(--text-secondary)",
          }}
        >
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="12"
            height="12"
          >
            <rect x="1" y="3" width="14" height="12" rx="2" />
            <line x1="5" y1="1" x2="5" y2="5" />
            <line x1="11" y1="1" x2="11" y2="5" />
            <line x1="1" y1="7" x2="15" y2="7" />
          </svg>

          {formatDate()}
        </div>

        {/* Search */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: "6px 11px",
            width: 185,
          }}
        >
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="var(--text-tertiary)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="13"
            height="13"
          >
            <circle cx="7" cy="7" r="5" />
            <line x1="13" y1="13" x2="10" y2="10" />
          </svg>

          <input
            placeholder="Quick search…"
            style={{
              border: "none",
              background: "transparent",
              outline: "none",
              fontSize: 12.5,
              color: "var(--text)",
              fontFamily: "inherit",
              width: "100%",
              letterSpacing: "-0.1px",
            }}
          />

          <kbd
            style={{
              fontSize: 10,
              color: "var(--text-tertiary)",
              background: "var(--border-light)",
              border: "1px solid var(--border)",
              borderRadius: 4,
              padding: "1px 4px",
              fontFamily: "inherit",
              flexShrink: 0,
            }}
          >
            ⌘K
          </kbd>
        </div>

        {/* Dark / Light toggle */}
        <button
          onClick={toggle}
          title={
            isDark
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
          style={{
            width: 36,
            height: 36,
            borderRadius: 9,
            background: isDark
              ? "rgba(129,140,248,0.15)"
              : "var(--bg-elevated)",
            border: `1px solid ${
              isDark
                ? "rgba(129,140,248,0.3)"
                : "var(--border)"
            }`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: isDark
              ? "var(--accent)"
              : "var(--text-secondary)",
            flexShrink: 0,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "opacity 0.2s, transform 0.3s",
              opacity: isDark ? 0 : 1,
              transform: isDark
                ? "rotate(90deg) scale(0.5)"
                : "rotate(0deg) scale(1)",
              position: "absolute",
            }}
          >
            <svg
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              width="16"
              height="16"
            >
              <circle cx="10" cy="10" r="4" />
              <line x1="10" y1="1" x2="10" y2="3.5" />
              <line x1="10" y1="16.5" x2="10" y2="19" />
              <line x1="1" y1="10" x2="3.5" y2="10" />
              <line x1="16.5" y1="10" x2="19" y2="10" />
              <line x1="3.5" y1="3.5" x2="5.4" y2="5.4" />
              <line x1="14.6" y1="14.6" x2="16.5" y2="16.5" />
              <line x1="16.5" y1="3.5" x2="14.6" y2="5.4" />
              <line x1="5.4" y1="14.6" x2="3.5" y2="16.5" />
            </svg>
          </span>

          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "opacity 0.2s, transform 0.3s",
              opacity: isDark ? 1 : 0,
              transform: isDark
                ? "rotate(0deg) scale(1)"
                : "rotate(-90deg) scale(0.5)",
              position: "absolute",
            }}
          >
            <svg
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              width="16"
              height="16"
            >
              <path d="M17.5 11.9A7.5 7.5 0 1 1 8.1 2.5a5.8 5.8 0 0 0 9.4 9.4z" />
            </svg>
          </span>
        </button>

        {/* Notification bell */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setNotifOpen((v) => !v)}
            style={{
              width: 36,
              height: 36,
              borderRadius: 9,
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--text-secondary)",
              position: "relative",
            }}
          >
            <svg
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              width="16"
              height="16"
            >
              <path d="M10 2a6 6 0 0 0-6 6c0 4.5-2 6-2 6h16s-2-1.5-2-6a6 6 0 0 0-6-6z" />
              <path d="M11.73 18a2 2 0 0 1-3.46 0" />
            </svg>

            <span
              className="pulse-dot"
              style={{
                position: "absolute",
                top: 7,
                right: 7,
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "var(--red-mid)",
                border: "2px solid var(--surface)",
              }}
            />
          </button>

          {notifOpen && (
            <div
              className="scale-in"
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                width: 316,
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                boxShadow: "var(--shadow-lg)",
                zIndex: 200,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "14px 16px 10px",
                  borderBottom: "1px solid var(--border-light)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: 13.5,
                    fontWeight: 700,
                    color: "var(--text)",
                  }}
                >
                  Notifications
                </span>

                <span
                  style={{
                    fontSize: 11.5,
                    color: "var(--accent)",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                  onClick={() => setNotifOpen(false)}
                >
                  Mark all read
                </span>
              </div>

              {notifications.map((n, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    padding: "11px 16px",
                    background: n.unread
                      ? "var(--accent-light)"
                      : "transparent",
                    borderBottom:
                      i < notifications.length - 1
                        ? "1px solid var(--border-light)"
                        : "none",
                    cursor: "pointer",
                  }}
                >
                  <span
                    style={{
                      fontSize: 15,
                      lineHeight: 1.4,
                      flexShrink: 0,
                    }}
                  >
                    {n.icon}
                  </span>

                  <div
                    style={{
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12.5,
                        color: "var(--text)",
                        fontWeight: n.unread ? 600 : 400,
                        lineHeight: 1.4,
                      }}
                    >
                      {n.text}
                    </div>

                    <div
                      style={{
                        fontSize: 11.5,
                        color: "var(--text-tertiary)",
                        marginTop: 2,
                      }}
                    >
                      {n.time}
                    </div>
                  </div>

                  {n.unread && (
                    <div
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: "var(--accent)",
                        flexShrink: 0,
                        marginTop: 4,
                      }}
                    />
                  )}
                </div>
              ))}

              <div
                style={{
                  padding: "10px 16px",
                  textAlign: "center",
                }}
              >
                <span
                  style={{
                    fontSize: 12.5,
                    color: "var(--accent)",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  View all notifications
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "4px 10px 4px 4px",
            borderRadius: 10,
            border: "1px solid var(--border)",
            background: "var(--bg-elevated)",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              background:
                "linear-gradient(135deg, var(--accent-dark), var(--accent))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 700,
              color: "#fff",
            }}
          >
            {candidateName.charAt(0).toUpperCase()}
          </div>

          <span
            style={{
              fontSize: 12.5,
              fontWeight: 600,
              color: "var(--text)",
            }}
          >
            {candidateName}
          </span>

          <svg
            viewBox="0 0 12 12"
            fill="none"
            stroke="var(--text-tertiary)"
            strokeWidth="1.5"
            width="10"
            height="10"
          >
            <polyline points="2,4 6,8 10,4" />
          </svg>
        </div>
      </div>
    </header>
  );
}
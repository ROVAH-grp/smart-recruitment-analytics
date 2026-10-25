import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { updateCandidate } from "../api/candidates";

export default function Settings() {
  const { user, refreshProfile } = useAuth();

  const [fullName, setFullName] = useState(
    user?.candidateId
      ? "Sarah Mitchell"
      : user?.email?.split("@")[0] || "",
  );

  const [saved, setSaved] = useState(false);

  const handleSaveProfile = async () => {
    if (user?.role === "CANDIDATE" && user.candidateId) {
      try {
        await updateCandidate(user.candidateId, {
          candidateName: fullName,
        });

        // Tell Navbar to reload the candidate name
        refreshProfile();

        setSaved(true);

        setTimeout(() => {
          setSaved(false);
        }, 2000);
      } catch (error) {
        console.error(
          "Failed to update candidate profile:",
          error,
        );

        alert(
          "Failed to update your profile. Please try again.",
        );
      }

      return;
    }

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  const sections = [
    {
      title: "Profile Settings",
      fields: [
        {
          label: "Full Name",
          value: fullName,
          type: "text",
          editable: true,
        },
        {
          label: "Email",
          value: user?.email || "",
          type: "email",
          editable: false,
        },
        {
          label: "Phone",
          value: "+91 98765 11111",
          type: "text",
          editable: true,
        },
        {
          label: "Role",
          value: user?.role || "",
          type: "text",
          editable: false,
        },
      ],
    },
    {
      title: "Company Settings",
      fields: [
        {
          label: "Company Name",
          value: "Acme Technologies Ltd.",
          type: "text",
          editable: true,
        },
        {
          label: "Industry",
          value: "Information Technology",
          type: "text",
          editable: true,
        },
        {
          label: "Default Currency",
          value: "INR (₹)",
          type: "text",
          editable: true,
        },
        {
          label: "Working Hours",
          value: "9 AM – 6 PM IST",
          type: "text",
          editable: true,
        },
      ],
    },
  ];

  return (
    <div style={{ padding: "28px 28px 40px" }}>
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "var(--text)",
            margin: "0 0 4px",
            letterSpacing: "-0.4px",
          }}
        >
          Settings
        </h1>

        <p
          style={{
            fontSize: 13,
            color: "var(--text-secondary)",
            margin: 0,
          }}
        >
          Manage your account and system preferences.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 18,
        }}
      >
        {sections.map((section) => (
          <div
            key={section.title}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              boxShadow: "var(--shadow-sm)",
              padding: "20px 22px",
            }}
          >
            <h2
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "var(--text)",
                margin: "0 0 18px",
                letterSpacing: "-0.2px",
              }}
            >
              {section.title}
            </h2>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              {section.fields.map((field) => (
                <div key={field.label}>
                  <label
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "var(--text-secondary)",
                      display: "block",
                      marginBottom: 5,
                      letterSpacing: "0.2px",
                    }}
                  >
                    {field.label}
                  </label>

                  <input
                    type={field.type}
                    value={field.value}
                    readOnly={
                      field.label === "Email" ||
                      field.label === "Role"
                    }
                    onChange={(e) => {
                      if (field.label === "Full Name") {
                        setFullName(e.target.value);
                      }
                    }}
                    style={{
                      width: "100%",
                      border: "1px solid var(--border)",
                      borderRadius: 7,
                      padding: "8px 12px",
                      fontSize: 13.5,
                      fontFamily: "inherit",
                      color: "var(--text)",
                      outline: "none",
                      background: "var(--bg)",
                    }}
                  />
                </div>
              ))}
            </div>

            <button
              onClick={
                section.title === "Profile Settings"
                  ? handleSaveProfile
                  : undefined
              }
              style={{
                marginTop: 18,
                padding: "9px 18px",
                background: "var(--accent)",
                color: "#fff",
                border: "none",
                borderRadius: 7,
                fontSize: 13.5,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Save Changes
            </button>

            {section.title === "Profile Settings" && saved && (
              <span
                style={{
                  marginLeft: 12,
                  fontSize: 13,
                  color: "#16a34a",
                }}
              >
                Saved successfully
              </span>
            )}
          </div>
        ))}

        {/* Notifications */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            boxShadow: "var(--shadow-sm)",
            padding: "20px 22px",
          }}
        >
          <h2
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "var(--text)",
              margin: "0 0 18px",
            }}
          >
            Notifications
          </h2>

          {[
            { label: "New Application Submitted", on: true },
            { label: "Interview Scheduled", on: true },
            { label: "Offer Accepted/Declined", on: true },
            { label: "Weekly Pipeline Report", on: false },
            { label: "Job Closing Reminders", on: true },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "9px 0",
                borderBottom: "1px solid var(--border-light)",
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  color: "var(--text)",
                }}
              >
                {item.label}
              </span>

              <div
                style={{
                  width: 36,
                  height: 20,
                  borderRadius: 99,
                  background: item.on
                    ? "var(--accent)"
                    : "var(--border)",
                  position: "relative",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: "#fff",
                    position: "absolute",
                    top: 2,
                    left: item.on ? 18 : 2,
                    transition: "left 0.2s",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Danger Zone */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid #FEE2E2",
            borderRadius: "var(--radius)",
            boxShadow: "var(--shadow-sm)",
            padding: "20px 22px",
          }}
        >
          <h2
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#DC2626",
              margin: "0 0 14px",
            }}
          >
            Danger Zone
          </h2>

          <p
            style={{
              fontSize: 13,
              color: "var(--text-secondary)",
              marginBottom: 16,
            }}
          >
            These actions are irreversible. Please proceed with
            caution.
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <button
              style={{
                padding: "9px 18px",
                background: "transparent",
                color: "#DC2626",
                border: "1px solid #FCA5A5",
                borderRadius: 7,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                textAlign: "left",
              }}
            >
              Export All Data
            </button>

            <button
              style={{
                padding: "9px 18px",
                background: "#FEF2F2",
                color: "#DC2626",
                border: "1px solid #FCA5A5",
                borderRadius: 7,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                textAlign: "left",
              }}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default function Settings() {
  const sections = [
    {
      title: "Profile Settings",
      fields: [
        { label: "Full Name", value: "Sarah Mitchell", type: "text" },
        { label: "Email", value: "sarah.mitchell@company.com", type: "email" },
        { label: "Phone", value: "+91 98765 11111", type: "text" },
        { label: "Role", value: "HR Manager", type: "text" },
      ],
    },
    {
      title: "Company Settings",
      fields: [
        { label: "Company Name", value: "Acme Technologies Ltd.", type: "text" },
        { label: "Industry", value: "Information Technology", type: "text" },
        { label: "Default Currency", value: "INR (₹)", type: "text" },
        { label: "Working Hours", value: "9 AM – 6 PM IST", type: "text" },
      ],
    },
  ];

  return (
    <div style={{ padding: "28px 28px 40px" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: "var(--text)", margin: "0 0 4px", letterSpacing: "-0.4px" }}>Settings</h1>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0 }}>Manage your account and system preferences.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        {sections.map(section => (
          <div key={section.title} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", boxShadow: "var(--shadow-sm)", padding: "20px 22px" }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", margin: "0 0 18px", letterSpacing: "-0.2px" }}>{section.title}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {section.fields.map(field => (
                <div key={field.label}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 5, letterSpacing: "0.2px" }}>{field.label}</label>
                  <input
                    type={field.type}
                    defaultValue={field.value}
                    style={{ width: "100%", border: "1px solid var(--border)", borderRadius: 7, padding: "8px 12px", fontSize: 13.5, fontFamily: "inherit", color: "var(--text)", outline: "none", background: "var(--bg)" }}
                  />
                </div>
              ))}
            </div>
            <button style={{ marginTop: 18, padding: "9px 18px", background: "var(--accent)", color: "#fff", border: "none", borderRadius: 7, fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              Save Changes
            </button>
          </div>
        ))}

        {/* Notifications */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", boxShadow: "var(--shadow-sm)", padding: "20px 22px" }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", margin: "0 0 18px" }}>Notifications</h2>
          {[
            { label: "New Application Submitted", on: true },
            { label: "Interview Scheduled", on: true },
            { label: "Offer Accepted/Declined", on: true },
            { label: "Weekly Pipeline Report", on: false },
            { label: "Job Closing Reminders", on: true },
          ].map(item => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid var(--border-light)" }}>
              <span style={{ fontSize: 13, color: "var(--text)" }}>{item.label}</span>
              <div style={{ width: 36, height: 20, borderRadius: 99, background: item.on ? "var(--accent)" : "var(--border)", position: "relative", cursor: "pointer" }}>
                <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, left: item.on ? 18 : 2, transition: "left 0.2s" }} />
              </div>
            </div>
          ))}
        </div>

        {/* Danger Zone */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--red-border)", borderRadius: "var(--radius)", boxShadow: "var(--shadow-sm)", padding: "20px 22px" }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: "var(--red)", margin: "0 0 14px" }}>Danger Zone</h2>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 16 }}>These actions are irreversible. Please proceed with caution.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button style={{ padding: "9px 18px", background: "transparent", color: "var(--red)", border: "1px solid var(--red-border)", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>
              Export All Data
            </button>
            <button style={{ padding: "9px 18px", background: "var(--red-light)", color: "var(--red)", border: "1px solid var(--red-border)", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface AccessDeniedProps {
  onBackToDashboard: () => void;
}

export default function AccessDenied({
  onBackToDashboard,
}: AccessDeniedProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "var(--bg)",
      }}
    >
      <div
        style={{
          textAlign: "center",
          maxWidth: 500,
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            marginBottom: 12,
          }}
        >
          403
        </div>

        <h1 style={{ marginBottom: 8 }}>Access Denied</h1>

        <p
          style={{
            color: "var(--text-secondary)",
            marginBottom: 24,
          }}
        >
          You don't have permission to access this page.
        </p>

        <button
          type="button"
          onClick={onBackToDashboard}
          style={{
            padding: "11px 20px",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
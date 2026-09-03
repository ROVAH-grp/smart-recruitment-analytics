import { FormEvent, useState } from "react";
import { useAuth } from "../context/AuthContext";

type RegisterProps = {
  onBackToLogin: () => void;
  onRegistered: () => void;
};

export default function Register({
  onBackToLogin,
  onRegistered,
}: RegisterProps) {
  const { register, loading } = useAuth();

  const [role, setRole] = useState<"CANDIDATE" | "RECRUITER">(
    "CANDIDATE",
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [candidateId, setCandidateId] = useState("");
  const [recruiterId, setRecruiterId] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    try {
      await register({
        email,
        password,
        role,
        ...(role === "CANDIDATE"
          ? { candidateId }
          : { recruiterId: Number(recruiterId) }),
      });

      setSuccess("Registration successful. Redirecting to login...");

      setTimeout(() => {
        onRegistered();
      }, 1200);
    } catch (err) {
      let message = "Registration failed.";

      if (err instanceof Error) {
        try {
          const parsed = JSON.parse(err.message);

          if (Array.isArray(parsed?.message)) {
            message = parsed.message.join(", ");
          } else if (typeof parsed?.message === "string") {
            message = parsed.message;
          }
        } catch {
          if (err.message) {
            message = err.message;
          }
        }
      }

      setError(message);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "32px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ marginBottom: "28px" }}>
          <h1
            style={{
              margin: 0,
              fontSize: "28px",
              color: "var(--text)",
            }}
          >
            Create Account
          </h1>

          <p
            style={{
              marginTop: "8px",
              color: "var(--muted)",
            }}
          >
            Register for Smart Recruitment Analytics
          </p>
        </div>

        {error && (
          <div
            style={{
              marginBottom: "18px",
              padding: "12px 14px",
              borderRadius: "8px",
              background: "#fee2e2",
              color: "#b91c1c",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              marginBottom: "18px",
              padding: "12px 14px",
              borderRadius: "8px",
              background: "#dcfce7",
              color: "#15803d",
              fontSize: "14px",
            }}
          >
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label
            style={{
              display: "block",
              marginBottom: "7px",
              color: "var(--text)",
              fontWeight: 600,
            }}
          >
            Account Type
          </label>

          <select
            value={role}
            onChange={(e) =>
              setRole(e.target.value as "CANDIDATE" | "RECRUITER")
            }
            style={inputStyle}
          >
            <option value="CANDIDATE">Candidate</option>
            <option value="RECRUITER">Recruiter</option>
          </select>

          <label style={labelStyle}>Email</label>

          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            style={inputStyle}
          />

          <label style={labelStyle}>Password</label>

          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimum 6 characters"
            style={inputStyle}
          />

          {role === "CANDIDATE" ? (
            <>
              <label style={labelStyle}>Candidate ID</label>

              <input
                type="text"
                required
                value={candidateId}
                onChange={(e) => setCandidateId(e.target.value)}
                placeholder="Example: C0001"
                style={inputStyle}
              />

              <p style={hintStyle}>
                Enter the Candidate ID already present in the recruitment
                system.
              </p>
            </>
          ) : (
            <>
              <label style={labelStyle}>Recruiter ID</label>

              <input
                type="number"
                required
                min={1}
                value={recruiterId}
                onChange={(e) => setRecruiterId(e.target.value)}
                placeholder="Example: 1"
                style={inputStyle}
              />

              <p style={hintStyle}>
                Enter the Recruiter ID already present in the recruitment
                system.
              </p>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              marginTop: "14px",
              padding: "13px",
              border: "none",
              borderRadius: "8px",
              cursor: loading ? "not-allowed" : "pointer",
              background: "var(--primary)",
              color: "white",
              fontWeight: 600,
              fontSize: "15px",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <button
          type="button"
          onClick={onBackToLogin}
          style={{
            width: "100%",
            marginTop: "16px",
            padding: "11px",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            background: "transparent",
            color: "var(--text)",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  marginTop: "16px",
  marginBottom: "7px",
  color: "var(--text)",
  fontWeight: 600,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px",
  border: "1px solid var(--border)",
  borderRadius: "8px",
  background: "var(--bg)",
  color: "var(--text)",
  fontSize: "14px",
};

const hintStyle: React.CSSProperties = {
  marginTop: "6px",
  marginBottom: 0,
  fontSize: "12px",
  color: "var(--muted)",
};
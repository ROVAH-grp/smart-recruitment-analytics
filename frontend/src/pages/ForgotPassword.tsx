import { FormEvent, useState } from "react";
import { forgotPassword } from "../api/auth";

interface ForgotPasswordProps {
  onBackToLogin: () => void;
  onResetPassword: (token: string) => void;
}

export default function ForgotPassword({
  onBackToLogin,
  onResetPassword,
}: ForgotPasswordProps) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await forgotPassword(email);
      setMessage(response.message);

      const resetToken = (
        response as { message: string; resetToken?: string }
      ).resetToken;

      if (resetToken) {
        setToken(resetToken);
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to request password reset.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        backgroundColor: "#f8fafc",
        color: "#0f172a",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          backgroundColor: "#ffffff",
          color: "#0f172a",
          borderRadius: 16,
          padding: 32,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h1
          style={{
            marginBottom: 8,
            color: "#0f172a",
            fontSize: 28,
            fontWeight: 700,
          }}
        >
          Forgot Password?
        </h1>

        <p
          style={{
            color: "#64748b",
            marginBottom: 24,
          }}
        >
          Enter your email address to request a password reset.
        </p>

        <form onSubmit={handleSubmit}>
          <label
            style={{
              display: "block",
              marginBottom: 8,
              color: "#334155",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="candidate@test.com"
            style={{
              width: "100%",
              padding: "12px 14px",
              marginBottom: 16,
              border: "1px solid #cbd5e1",
              borderRadius: 8,
              boxSizing: "border-box",
              backgroundColor: "#ffffff",
              color: "#0f172a",
              outline: "none",
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              border: "none",
              borderRadius: 8,
              cursor: loading ? "not-allowed" : "pointer",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              fontWeight: 600,
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {message && (
          <p
            style={{
              marginTop: 20,
              color: "#334155",
              lineHeight: 1.5,
            }}
          >
            {message}
          </p>
        )}

        {token && (
          <div style={{ marginTop: 16 }}>
            <p
              style={{
                fontSize: 13,
                color: "#64748b",
                marginBottom: 8,
              }}
            >
              Local development reset token:
            </p>

            <div
              style={{
                padding: 10,
                marginBottom: 10,
                borderRadius: 8,
                backgroundColor: "#f1f5f9",
                color: "#334155",
                fontSize: 12,
                wordBreak: "break-all",
              }}
            >
              {token}
            </div>

            <button
              type="button"
              onClick={() => onResetPassword(token)}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #cbd5e1",
                borderRadius: 8,
                cursor: "pointer",
                backgroundColor: "#ffffff",
                color: "#2563eb",
                fontWeight: 600,
              }}
            >
              Continue to Reset Password
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={onBackToLogin}
          style={{
            width: "100%",
            marginTop: 16,
            padding: "10px",
            border: "none",
            backgroundColor: "transparent",
            color: "#2563eb",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          ← Back to Login
        </button>
      </div>
    </div>
  );
}
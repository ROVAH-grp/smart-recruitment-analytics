import { FormEvent, useState } from "react";
import { resetPassword } from "../api/auth";

interface ResetPasswordProps {
  token: string;
  onBackToLogin: () => void;
}

export default function ResetPassword({
  token,
  onBackToLogin,
}: ResetPasswordProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    setMessage("");
    setLoading(true);

    try {
      const response = await resetPassword(token, newPassword);

      setMessage(response.message);
      setSuccess(true);
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to reset password."
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
        background: "#f8fafc",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#fff",
          borderRadius: 16,
          padding: 32,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ marginBottom: 8 }}>Reset Password</h1>

        <p style={{ color: "#64748b", marginBottom: 24 }}>
          Enter your new password below.
        </p>

        {!success && (
          <form onSubmit={handleSubmit}>
            <label>New Password</label>

            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              style={{
                width: "100%",
                padding: "12px 14px",
                marginTop: 8,
                marginBottom: 16,
                border: "1px solid #cbd5e1",
                borderRadius: 8,
                boxSizing: "border-box",
              }}
            />

            <label>Confirm Password</label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              style={{
                width: "100%",
                padding: "12px 14px",
                marginTop: 8,
                marginBottom: 20,
                border: "1px solid #cbd5e1",
                borderRadius: 8,
                boxSizing: "border-box",
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
              }}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        {message && (
          <p
            style={{
              marginTop: 20,
              color: success ? "#15803d" : "#dc2626",
            }}
          >
            {message}
          </p>
        )}

        {success && (
          <button
            type="button"
            onClick={onBackToLogin}
            style={{
              width: "100%",
              marginTop: 16,
              padding: "12px",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            ← Back to Login
          </button>
        )}

        {!success && (
          <button
            type="button"
            onClick={onBackToLogin}
            style={{
              width: "100%",
              marginTop: 16,
              padding: "10px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            ← Back to Login
          </button>
        )}
      </div>
    </div>
  );
}
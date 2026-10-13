import { FormEvent, useState } from "react";
import { resetPassword } from "../api/auth";
import { errorMessage } from "../components/ui";

const PASSWORD_RULE = /^(?=.*[A-Za-z])(?=.*\d).{8,72}$/;

interface ResetPasswordProps {
  /** From the emailed link. When missing, the person can paste it from the email. */
  token: string | null;
  /** "activate" is used for new recruiter and employee accounts. */
  mode?: "reset" | "activate";
  onBackToLogin: () => void;
}

export default function ResetPassword({
  token,
  mode = "reset",
  onBackToLogin,
}: ResetPasswordProps) {
  const [pastedToken, setPastedToken] = useState("");
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

    if (!PASSWORD_RULE.test(newPassword)) {
      setMessage(
        "Password must be 8 to 72 characters and contain at least one letter and one number.",
      );
      return;
    }

    const activeToken = token ?? pastedToken.trim();

    if (!activeToken) {
      setMessage("Please paste the token from your email.");
      return;
    }

    setMessage("");
    setLoading(true);

    try {
      const response = await resetPassword(activeToken, newPassword);

      setMessage(response.message);
      setSuccess(true);
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setMessage(errorMessage(error, "Failed to reset password."));
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
        <h1 style={{ marginBottom: 8 }}>
          {mode === "activate" ? "Activate Your Account" : "Reset Password"}
        </h1>

        <p style={{ color: "#64748b", marginBottom: 24 }}>
          {mode === "activate"
            ? "Choose your own password to finish setting up your account."
            : "Enter your new password below."}
          {" "}Use at least 8 characters with a letter and a number.
        </p>

        {!success && (
          <form onSubmit={handleSubmit}>
            {token === null && (
              <>
                <label>Token from your email</label>

                <input
                  type="text"
                  value={pastedToken}
                  onChange={(e) => setPastedToken(e.target.value)}
                  required
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
              </>
            )}

            <label>New Password</label>

            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
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
              minLength={8}
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
              {loading
                ? "Saving..."
                : mode === "activate"
                  ? "Activate Account"
                  : "Reset Password"}
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
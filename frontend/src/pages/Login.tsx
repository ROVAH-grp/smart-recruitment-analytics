import { FormEvent, useState } from "react";
import { useAuth } from "../context/AuthContext";

interface LoginProps {
  onLoginSuccess: () => void;
  onRegisterClick: () => void;
  onForgotPassword: () => void;
}

export default function Login({
  onLoginSuccess,
  onRegisterClick,
  onForgotPassword,
}: LoginProps) {
  const { login, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    try {
      await login(email, password);
      onLoginSuccess();
    } catch (err) {
      console.error(err);

      let message = "Invalid email or password.";

      if (err instanceof Error) {
        try {
          const parsed = JSON.parse(err.message);

          if (Array.isArray(parsed?.message)) {
            message = parsed.message.join(", ");
          } else if (typeof parsed?.message === "string") {
            message = parsed.message;
          }
        } catch {
          // Keep default message
        }
      }

      setError(message);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        backgroundColor: "#020617",
        color: "#0f172a",
      }}
    >
      <div className="w-full max-w-md">
        <div
          className="rounded-2xl shadow-xl p-8"
          style={{
            backgroundColor: "#ffffff",
            color: "#0f172a",
          }}
        >
          <div className="text-center mb-8">
            <h1
              className="text-3xl font-bold"
              style={{ color: "#0f172a" }}
            >
              Smart Recruitment
            </h1>

            <p
              className="mt-2"
              style={{ color: "#64748b" }}
            >
              Sign in to your account
            </p>
          </div>

          {error && (
            <div
              className="mb-5 rounded-lg px-4 py-3 text-sm"
              style={{
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#b91c1c",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#334155" }}
              >
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
                required
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                style={{
                  color: "#0f172a",
                  backgroundColor: "#ffffff",
                  borderColor: "#cbd5e1",
                }}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#334155" }}
              >
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                required
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                style={{
                  color: "#0f172a",
                  backgroundColor: "#ffffff",
                  borderColor: "#cbd5e1",
                }}
              />
            </div>

            <div className="text-right">
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-sm"
                style={{
                  color: "#2563eb",
                  background: "transparent",
                }}
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg py-3 font-semibold transition hover:bg-blue-700 disabled:opacity-60"
              style={{
                backgroundColor: "#2563eb",
                color: "#ffffff",
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div
            className="mt-6 text-center text-sm"
            style={{ color: "#475569" }}
          >
            Don't have an account?{" "}
            <button
              type="button"
              onClick={onRegisterClick}
              className="font-semibold"
              style={{
                color: "#2563eb",
                background: "transparent",
              }}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
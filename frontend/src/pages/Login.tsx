import { FormEvent, useState } from "react";
import { useAuth } from "../context/AuthContext";

interface LoginProps {
  onLoginSuccess: () => void;
  onRegisterClick: () => void;
}

export default function Login({
  onLoginSuccess,
  onRegisterClick,
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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900">
              Smart Recruitment
            </h1>

            <p className="text-slate-500 mt-2">
              Sign in to your account
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="text-right">
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-700"
                onClick={() => alert("Forgot password will be added next.")}
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={onRegisterClick}
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
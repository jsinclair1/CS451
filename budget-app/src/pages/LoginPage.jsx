import { useState } from "react";
import { Wallet, ArrowLeft } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function LoginPage({ onBack, onSuccess, onNavigate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed. Please try again.");
        return;
      }

      // Store token and user in localStorage
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      onSuccess(data.user);
    } catch (err) {
      setError(`Unable to connect to the server. Try again later. Var: ${API_BASE_URL}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page d-flex align-items-center justify-content-center">
      <div className="container-fluid px-4 px-xl-5">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-11 col-xl-10">
            <div className="row g-0 auth-wrapper overflow-hidden">
              <div className="col-lg-6 auth-left-panel d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex align-items-center gap-2 mb-4">
                    <span className="sidebar-logo-badge d-inline-flex align-items-center justify-content-center">
                      <Wallet size={18} />
                    </span>
                    <span className="text-white fw-bold fs-4">ExpenseApp</span>
                  </div>

                  <div className="auth-badge mb-4">Welcome Back</div>

                  <h1 className="auth-title mb-3">
                    Log in to continue tracking your finances
                  </h1>

                  <p className="auth-subtitle mb-4">
                    Access your dashboard, monitor budgets, review transactions,
                    and stay on top of your financial goals.
                  </p>
                </div>

                <div className="auth-info-box mt-4">
                  <h6 className="fw-bold mb-3 text-white">What you can access</h6>
                  <ul className="mb-0 ps-3 text-white auth-info-list">
                    <li>Monthly dashboard overview</li>
                    <li>Budget progress by category</li>
                    <li>Transaction history and reports</li>
                    <li>Profile and account settings</li>
                  </ul>
                </div>
              </div>

              <div className="col-lg-6 auth-right-panel bg-white">
                <button
                  className="btn btn-link text-decoration-none px-0 mb-3 auth-back-btn"
                  onClick={onBack}
                >
                  <ArrowLeft size={16} className="me-2" />
                  Back to Home
                </button>

                <h2 className="fw-bold mb-2 auth-form-title">Login</h2>
                <p className="text-secondary mb-4 auth-form-subtitle">
                  Enter your account details to access your budgeting dashboard.
                </p>

                {error && (
                  <div className="alert alert-danger py-2 mb-3" role="alert">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Email Address</label>
                    <input
                      type="email"
                      className="form-control auth-input"
                      placeholder="name@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Password</label>
                    <input
                      type="password"
                      className="form-control auth-input"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="rememberMe"
                      />
                      <label className="form-check-label text-secondary" htmlFor="rememberMe">
                        Remember me
                      </label>
                    </div>

                    <button
                      type="button"
                      className="btn btn-link p-0 text-decoration-none auth-link-btn"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-brand w-100 py-3 mb-3"
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </button>

                  <div className="text-center text-secondary">
                    Don&apos;t have an account?{" "}
                    <button
                      type="button"
                      className="btn btn-link p-0 text-decoration-none auth-link-btn fw-semibold"
                      onClick={() => onNavigate("register")}
                    >
                      Register
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

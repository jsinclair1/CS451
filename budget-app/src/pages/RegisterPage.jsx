import { useState } from "react";
import { Wallet, ArrowLeft } from "lucide-react";
import { api } from "../api";

export default function RegisterPage({ onBack, onSuccess }) {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/api/register", {
        email,
        password,
        display_name: displayName,
      });

      const data = await res.json();

      if (!res.ok) {
        // Show password requirement errors if present
        if (data.requirements) {
          setError(`Password must contain: ${data.requirements.join(", ")}`);
        } else {
          setError(data.error || "Registration failed. Please try again.");
        }
        return;
      }

      onSuccess();
    } catch (err) {
      setError("Unable to connect to the server. Please try again.");
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
                    <span className="text-white fw-bold fs-4">GeoBudget</span>
                  </div>

                  <div className="auth-badge mb-4">
                    Create Account
                  </div>

                  <h1 className="auth-title mb-3">
                    Start managing your finances today
                  </h1>
                </div>

                <div className="auth-info-box mt-4">
                  <h6 className="fw-bold mb-3 text-white">Benefits</h6>
                  <ul className="mb-0 ps-3 text-white auth-info-list">
                    <li>Track every transaction</li>
                    <li>Create monthly budgets</li>
                    <li>Analyze spending habits</li>
                    <li>Access detailed financial reports</li>
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

                <h2 className="fw-bold mb-2 auth-form-title">
                  Register
                </h2>

                <p className="text-secondary mb-4 auth-form-subtitle">
                  Create your GeoBudget account.
                </p>

                {error && (
                  <div className="alert alert-danger py-2 mb-3" role="alert">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Full Name</label>
                    <input
                      type="text"
                      className="form-control auth-input"
                      placeholder="John Doe"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      required
                    />
                  </div>

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

                  <div className="mb-4">
                    <label className="form-label fw-semibold">Confirm Password</label>
                    <input
                      type="password"
                      className="form-control auth-input"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-brand w-100 py-3 mb-3"
                    disabled={loading}
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </button>
                </form>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

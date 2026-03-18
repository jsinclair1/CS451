import { Wallet, ArrowLeft } from "lucide-react";

export default function RegisterPage({ onBack, onSuccess }) {
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

                  <div className="auth-badge mb-4">
                    Create Account
                  </div>

                  <h1 className="auth-title mb-3">
                    Start managing your finances today
                  </h1>

                  <p className="auth-subtitle">
                    Create an account to begin tracking expenses, managing budgets,
                    and analyzing your financial habits.
                  </p>

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
                  Create your ExpenseApp account.
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    onSuccess();
                  }}
                >

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="form-control auth-input"
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control auth-input"
                      placeholder="name@gmail.com"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control auth-input"
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      className="form-control auth-input"
                      placeholder="••••••••"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-brand w-100 py-3 mb-3"
                  >
                    Create Account
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
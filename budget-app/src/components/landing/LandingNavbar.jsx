import { Wallet } from "lucide-react";

export default function LandingNavbar({ onNavigate }) {
  return (
    <nav className="navbar navbar-expand-lg landing-navbar py-3">
      <div className="container-fluid px-4 px-xl-5">
        <div className="navbar-brand d-flex align-items-center gap-2">
          <span className="nav-logo-badge d-flex align-items-center justify-content-center">
            <Wallet size={18} />
          </span>
          <span className="brand-text">ExpenseApp</span>
        </div>

        <div className="ms-auto d-flex align-items-center gap-3">
          <button
            className="btn btn-link text-secondary text-decoration-none landing-login-btn"
            onClick={() => onNavigate("login")}
          >
            Login
          </button>

          <button
            className="btn btn-brand"
            onClick={() => onNavigate("register")}
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}
import { Wallet } from "lucide-react";

export default function LandingNavbar({ onNavigate }) {
  return (
    <nav className="navbar navbar-expand-lg landing-navbar py-3">
      <div className="container-fluid px-4 px-xl-5">
        <a
          className="navbar-brand d-flex align-items-center gap-2"
          href="#"
          onClick={(e) => e.preventDefault()}
        >
          <span className="nav-logo-badge d-inline-flex align-items-center justify-content-center">
            <Wallet size={18} />
          </span>
          <span className="brand-text">GeoBudget</span>
        </a>

        <div className="collapse navbar-collapse show">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-3">
            <li className="nav-item">
              <button
                className="btn btn-link text-secondary fw-medium text-decoration-none"
                onClick={() => onNavigate("login")}
              >
                Login
              </button>
            </li>
            <li className="nav-item">
              <button className="btn btn-brand" onClick={() => onNavigate("register")}>
                Register
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

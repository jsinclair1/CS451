import { Wallet } from "lucide-react";

export default function LandingFooter() {
  return (
    <footer className="footer-section">
      <div className="container-fluid px-4 px-xl-5">
        <div className="row gy-4">
          <div className="col-lg-3">
            <div className="d-flex align-items-center gap-2 mb-3 text-white fw-bold fs-5">
              <span className="sidebar-logo-badge d-inline-flex align-items-center justify-content-center">
                <Wallet size={18} />
              </span>
              ExpenseApp
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <h6>Product</h6>
            <div className="d-flex flex-column gap-2">
              <a className="footer-link" href="#features">Features</a>
              <a className="footer-link" href="#pricing">Pricing</a>
              <a className="footer-link" href="#faq">FAQ</a>
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <h6>Company</h6>
            <div className="d-flex flex-column gap-2">
              <a className="footer-link" href="#about">About</a>
              <a className="footer-link" href="#blog">Blog</a>
              <a className="footer-link" href="#contact">Contact</a>
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <h6>Legal</h6>
            <div className="d-flex flex-column gap-2">
              <a className="footer-link" href="#privacy">Privacy</a>
              <a className="footer-link" href="#terms">Terms</a>
              <a className="footer-link" href="#security">Security</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
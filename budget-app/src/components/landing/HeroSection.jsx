export default function HeroSection({ onNavigate }) {
  return (
    <section className="hero-section">
      <div className="container-fluid px-4 px-xl-5">
        <div className="row align-items-center g-5">
          <div className="col-lg-5 col-xl-4">
            <div className="hero-badge mb-4">✨ Powered by your capstone stack</div>

            <h1 className="hero-title mb-4">Take Control of Your Finances Today</h1>

            <p className="hero-subtitle mb-4">
              Track expenses, manage budgets, and achieve your financial goals
              with a polished full-stack budgeting web application built with
              React, Bootstrap, Python, and PostgreSQL.
            </p>

            <div className="d-flex flex-wrap gap-3 mb-5">
              <button className="btn btn-light-hero" onClick={() => onNavigate("register")}>
                Start Free Trial
              </button>
              <button className="btn btn-outline-hero" onClick={() => onNavigate("dashboard")}>
                Learn More
              </button>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="hero-card">
              <div className="d-flex justify-content-between align-items-center mb-3 px-1">
                <h5 className="mb-0 fw-bold text-dark">This Month</h5>
                <span className="text-secondary small">October 2025</span>
              </div>

              <div className="hero-spend-box mb-3">
                <div className="small opacity-75 mb-1">Total Spent</div>
                <div className="display-6 fw-bold mb-1">$3,247.85</div>
                <div className="small opacity-75">↓ 12% from last month</div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-6">
                  <div className="mini-box food-box h-100">
                    <div className="mini-box-label">Food</div>
                    <div className="mini-box-value">$847</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="mini-box transport-box h-100">
                    <div className="mini-box-label">Transport</div>
                    <div className="mini-box-value">$234</div>
                  </div>
                </div>
              </div>

              <div className="d-flex flex-column gap-2 px-1">
                {[
                  ["Pizza Night", "-$45.00"],
                  ["Gas Station", "-$60.00"],
                  ["Coffee Shop", "-$12.50"],
                ].map(([title, amount]) => (
                  <div key={title} className="d-flex justify-content-between align-items-center small">
                    <div className="d-flex align-items-center gap-2 text-dark">
                      <span className="txn-dot"></span>
                      <span>{title}</span>
                    </div>
                    <span className="fw-semibold text-secondary">{amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default function HeroSection({ onNavigate }) {
  return (
    <section className="hero-section">
      <div className="container-fluid px-4 px-xl-5">
        <div className="row align-items-center g-5">
          <div className="col-lg-5">
            <div className="hero-badge mb-3">Built for your capstone project</div>

            <h1 className="hero-title mb-3">Take Control of Your Finances</h1>

            <p className="hero-subtitle mb-4">
              Track expenses, manage budgets, and understand where your money goes.
            </p>

            <div className="d-flex gap-3 flex-wrap">
              <button
                className="btn btn-light-hero"
                onClick={() => onNavigate("register")}
              >
                Get Started
              </button>

              <button
                className="btn btn-outline-hero"
                onClick={() => onNavigate("dashboard")}
              >
                View App
              </button>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="hero-card">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0 fw-bold">This Month</h5>
                <span className="text-secondary small">Oct 2025</span>
              </div>

              <div className="hero-spend-box mb-3">
                <div className="small opacity-75 mb-1">Total Spent</div>
                <h2 className="mb-1 fw-bold">$3,247</h2>
                <div className="small opacity-75">↓ 12% from last month</div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-6">
                  <div className="mini-box food-box">
                    <div className="mini-box-label">Food</div>
                    <div className="mini-box-value">$847</div>
                  </div>
                </div>

                <div className="col-6">
                  <div className="mini-box transport-box">
                    <div className="mini-box-label">Transport</div>
                    <div className="mini-box-value">$234</div>
                  </div>
                </div>
              </div>

              <div className="d-flex flex-column gap-2">
                <div className="d-flex justify-content-between small">
                  <div className="d-flex align-items-center gap-2">
                    <span className="txn-dot"></span>
                    <span>Pizza</span>
                  </div>
                  <span>-45</span>
                </div>

                <div className="d-flex justify-content-between small">
                  <div className="d-flex align-items-center gap-2">
                    <span className="txn-dot"></span>
                    <span>Gas</span>
                  </div>
                  <span>-60</span>
                </div>

                <div className="d-flex justify-content-between small">
                  <div className="d-flex align-items-center gap-2">
                    <span className="txn-dot"></span>
                    <span>Coffee</span>
                  </div>
                  <span>-12</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default function CTASection({ onNavigate }) {
  return (
    <section className="cta-section text-center">
      <div className="container-fluid px-4 px-xl-5">
        <h3 className="cta-title">Ready to Take Control of Your Finances?</h3>
        <p className="cta-text mb-4">
          Join thousands of users who are already tracking their expenses smarter.
        </p>
        <div className="d-flex justify-content-center flex-wrap gap-3">
          <button className="btn btn-light-hero" onClick={() => onNavigate("register")}>
            Start Your Free Trial
          </button>
          <button className="btn btn-outline-hero" onClick={() => onNavigate("dashboard")}>
            View Demo
          </button>
        </div>
      </div>
    </section>
  );
}
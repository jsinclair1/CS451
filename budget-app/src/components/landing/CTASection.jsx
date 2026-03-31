export default function CTASection({ onNavigate }) {
  return (
    <section className="section-spacer">
      <div className="container-fluid px-4 px-xl-5">
        <div className="cta-section text-center">
          <h3 className="cta-title mb-3">Start managing your finances today</h3>
          <p className="cta-text mb-4">
            Build better spending habits and keep your budget in check.
          </p>

          <button
            className="btn btn-light-hero"
            onClick={() => onNavigate("register")}
          >
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
}
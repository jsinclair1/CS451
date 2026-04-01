export default function CTASection({ onNavigate }) {
  return (
    <section className="cta-section text-center">
      <div className="container-fluid px-4 px-xl-5">
        <h3 className="cta-title">Ready to Take Control of Your Finances?</h3>
        <div className="d-flex justify-content-center flex-wrap gap-3">
          <button className="btn btn-light-hero" onClick={() => onNavigate("register")}>
            Register
          </button>
        </div>
      </div>
    </section>
  );
}
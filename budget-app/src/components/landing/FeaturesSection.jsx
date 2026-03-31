import {
  BarChart3,
  Wallet,
  Receipt,
  Tags,
  PieChart,
  Smartphone,
} from "lucide-react";

const featureCards = [
  {
    title: "Dashboard",
    text: "Get a quick snapshot of your spending, balances, and budget activity.",
    icon: BarChart3,
  },
  {
    title: "Budgets",
    text: "Set limits for categories and stay on track throughout the month.",
    icon: Wallet,
  },
  {
    title: "Transactions",
    text: "Track purchases, expenses, and income in one organized place.",
    icon: Receipt,
  },
  {
    title: "Categories",
    text: "Group your spending into categories for cleaner financial tracking.",
    icon: Tags,
  },
  {
    title: "Insights",
    text: "Understand where your money goes and identify spending trends faster.",
    icon: PieChart,
  },
  {
    title: "Mobile",
    text: "Use the app smoothly across desktop, tablet, and phone screens.",
    icon: Smartphone,
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="section-spacer features-section">
      <div className="container-fluid px-4 px-xl-5">
        <div className="text-center mb-5">
          <h2 className="section-title">Features</h2>
          <p className="section-subtitle">
            Simple and effective tools for managing your finances.
          </p>
        </div>

        <div className="row g-4">
          {featureCards.map((card) => {
            const Icon = card.icon;

            return (
              <div className="col-md-6 col-xl-4" key={card.title}>
                <div className="feature-card h-100">
                  <div className="feature-icon">
                    <Icon size={20} />
                  </div>
                  <h5>{card.title}</h5>
                  <p>{card.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
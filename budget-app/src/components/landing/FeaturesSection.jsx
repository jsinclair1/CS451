import {
  BarChart3,
  RefreshCcw,
  SquareDashedBottomCode,
  Zap,
  Tags,
  Smartphone,
} from "lucide-react";

const featureCards = [
  {
    title: "Interactive Dashboard",
    text: "Beautiful charts and real-time statistics to visualize your spending patterns.",
    icon: BarChart3,
    boxClass: "feature-card card-lilac",
    iconClass: "icon-purple",
  },
  {
    title: "Recurring Expenses",
    text: "Set up automatic recurring expenses that are generated based on your schedule.",
    icon: RefreshCcw,
    boxClass: "feature-card card-blue",
    iconClass: "icon-blue",
  },
  {
    title: "Budget Management",
    text: "Set budgets for categories and get alerts when you're approaching limits.",
    icon: SquareDashedBottomCode,
    boxClass: "feature-card card-green",
    iconClass: "icon-green",
  },
  {
    title: "Real-time Updates",
    text: "Instantly refresh your financial picture as transactions and budgets change.",
    icon: Zap,
    boxClass: "feature-card card-yellow",
    iconClass: "icon-yellow",
  },
  {
    title: "Category Tags",
    text: "Organize expenses with customizable categories and clearer budget tracking.",
    icon: Tags,
    boxClass: "feature-card card-pink",
    iconClass: "icon-pink",
  },
  {
    title: "Mobile Responsive",
    text: "Track expenses on any device with a polished responsive web application layout.",
    icon: Smartphone,
    boxClass: "feature-card card-indigo",
    iconClass: "icon-indigo",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="section-spacer bg-white">
      <div className="container-fluid px-4 px-xl-5">
        <div className="text-center">
          <h2 className="section-title">Powerful Features</h2>
          <p className="section-subtitle">
            Everything you need to manage your expenses efficiently
          </p>
        </div>

        <div className="row g-4 feature-grid">
          {featureCards.map((card) => {
            const Icon = card.icon;
            return (
              <div className="col-md-6 col-xl-4" key={card.title}>
                <div className={card.boxClass}>
                  <div className={`feature-icon ${card.iconClass}`}>
                    <Icon size={18} />
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
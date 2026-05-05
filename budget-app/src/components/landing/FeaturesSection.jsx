import React from 'react';
import { LayoutDashboard, Tags, Wallet, Receipt } from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      title: "Dashboard",
      desc: "Get a comprehensive overview of your financial health, 6-month trends, and monthly summaries at a single glance.",
      icon: LayoutDashboard,
      cardClass: "card-lilac",
      iconClass: "icon-purple"
    },
    {
      title: "Categories",
      desc: "Organize your transactions with custom color-coded categories to clearly track exactly where your money is going.",
      icon: Tags,
      cardClass: "card-green",
      iconClass: "icon-green"
    },
    {
      title: "Budgets",
      desc: "Set specific monthly limits for your categories and visually track your progress so you never overspend.",
      icon: Wallet,
      cardClass: "card-blue",
      iconClass: "icon-blue"
    },
    {
      title: "Expenses",
      desc: "Log your daily transactions effortlessly and maintain an accurate, searchable history of your income and spending.",
      icon: Receipt,
      cardClass: "card-pink",
      iconClass: "icon-pink"
    }
  ];

  return (
    <section className="section-spacer">
      <div className="container">
        <div className="text-center mx-auto mb-5" style={{ maxWidth: '600px' }}>
          <h2 className="section-title">Everything you need.</h2>
          <p className="section-subtitle">
            A streamlined experience built around four core features to help you master your money without the clutter.
          </p>
        </div>

        {/* Changed to a 2x2 grid on medium screens, and 4-across on extra-large screens */}
        <div className="row g-4 feature-grid justify-content-center">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div className="col-md-6 col-xl-3" key={i}>
                <div className={`card feature-card ${feature.cardClass} h-100`}>
                  <div className={`feature-icon ${feature.iconClass}`}>
                    <Icon size={20} strokeWidth={2.5} />
                  </div>
                  <h5>{feature.title}</h5>
                  <p>{feature.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
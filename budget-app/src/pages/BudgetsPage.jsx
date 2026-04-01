import {
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  TriangleAlert,
} from "lucide-react";

import Sidebar from '../components/landing/Sidebar';

const budgetCards = [
  {
    title: "Overall Budget",
    subtitle: "Monthly Limit",
    budget: "$5,000.00",
    progress: "67.9%",
    progressValue: 67.9,
    spent: "$3,393.31",
    remaining: "$1,606.69",
    status: "On Track",
    statusClass: "bgp-status-green",
    headerClass: "bgp-card-header-slate",
    progressClass: "bgp-progress-green",
    statusIcon: CircleCheck,
  },
  {
    title: "Education",
    subtitle: "Monthly Limit",
    budget: "$900.00",
    progress: "88.9%",
    progressValue: 88.9,
    spent: "$800.00",
    remaining: "$100.00",
    status: "Warning",
    statusClass: "bgp-status-yellow",
    headerClass: "bgp-card-header-orange",
    progressClass: "bgp-progress-orange",
    statusIcon: TriangleAlert,
  },
];

export default function BudgetsPage({ onNavigate }) {
  return (
    <div className="dashboard-page">
      <Sidebar onNavigate={onNavigate} activeTab="budgets" />
      <div className="dashboard-main">
        <div className="dashboard-content">
          <div className="dashboard-hero">
            <div>
              <h1 className="dashboard-hero-title">Budgets</h1>
              <p className="dashboard-hero-subtitle">Plan and track your spending limits</p>
            </div>

            <div className="d-flex align-items-center gap-2">
              <button className="btn dashboard-month-btn">
                <ChevronLeft size={16} />
              </button>
              <span className="dashboard-month-text">March 2026</span>
              <button className="btn dashboard-month-btn">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="bgp-shell">
            <div className="bgp-summary-card">
              <h4 className="bgp-section-title">Overall Budget Summary</h4>

              <div className="row g-4 mt-1 mb-3">
                <div className="col-md-6 col-xl-3">
                  <div className="bgp-label">Total Budget</div>
                  <div className="bgp-value">$5,900.00</div>
                </div>

                <div className="col-md-6 col-xl-3">
                  <div className="bgp-label">Total Spent</div>
                  <div className="bgp-value text-primary">$4,193.31</div>
                </div>

                <div className="col-md-6 col-xl-3">
                  <div className="bgp-label">Remaining</div>
                  <div className="bgp-value text-success">$1,706.69</div>
                </div>

                <div className="col-md-6 col-xl-3">
                  <div className="bgp-label">Usage</div>
                  <div className="bgp-value">71.1%</div>
                </div>
              </div>

              <div className="progress bgp-summary-progress">
                <div className="progress-bar bgp-progress-green" style={{ width: "71.1%" }}></div>
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
              <h4 className="bgp-section-title mb-0">Category Budgets</h4>

              <button
                className="btn btn-brand d-inline-flex align-items-center gap-2"
                onClick={() => onNavigate("add-budget")}
              >
                <Plus size={16} />
                Create Budget
              </button>
            </div>

            <div className="row g-4">
              {budgetCards.map((card) => {
                const StatusIcon = card.statusIcon;

                return (
                  <div className="col-md-6 col-xl-4" key={card.title}>
                    <div className="bgp-budget-card">
                      <div className={`bgp-card-header ${card.headerClass}`}>
                        <div>
                          <h5 className="bgp-card-title">{card.title}</h5>
                          <div className="bgp-card-subtitle">{card.subtitle}</div>
                        </div>

                        <div className="d-flex gap-2">
                          <button className="btn bgp-card-action-btn">
                            <Pencil size={14} />
                          </button>
                          <button className="btn bgp-card-action-btn">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="bgp-card-body">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <span className="bgp-label">Budget</span>
                          <span className="bgp-card-value">{card.budget}</span>
                        </div>

                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="bgp-label">Progress</span>
                          <span className={card.progressClass === 'bgp-progress-orange' ? 'text-warning fw-bold' : 'bgp-progress-percent'}>
                            {card.progress}
                          </span>
                        </div>

                        <div className="progress bgp-card-progress mb-4">
                          <div
                            className={`progress-bar ${card.progressClass}`}
                            style={{ width: `${card.progressValue}%` }}
                          ></div>
                        </div>

                        <div className="d-flex justify-content-between mb-2">
                          <span className="bgp-label">Spent</span>
                          <span className="fw-semibold">{card.spent}</span>
                        </div>

                        <div className="d-flex justify-content-between mb-4">
                          <span className="bgp-label">Remaining</span>
                          <span className="fw-semibold text-success">{card.remaining}</span>
                        </div>

                        <div className={`bgp-status-box ${card.statusClass}`}>
                          <StatusIcon size={16} />
                          <span>{card.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

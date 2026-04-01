import {
  LayoutDashboard,
  Receipt,
  Wallet,
  RefreshCcw,
  Tags,
  Bell,
  ChevronLeft,
  ChevronRight,
  FolderGit2,
  BookOpen,
  Plus,
  DollarSign,
  BadgeDollarSign,
  Tag,
  Repeat,
  Circle,
} from "lucide-react";

import Sidebar from '../components/landing/Sidebar';

const summaryCards = [
  {
    title: "Total Spent",
    value: "$3,393.31",
    subtext: "Under budget by $1606.69",
    borderClass: "summary-border-purple",
    iconClass: "summary-icon-purple",
    icon: DollarSign,
  },
  {
    title: "Monthly Budget",
    value: "$5,000.00",
    subtext: "67.9% used",
    rightText: "$1606.69 left",
    borderClass: "summary-border-blue",
    iconClass: "summary-icon-blue",
    icon: BadgeDollarSign,
    progress: 67.9,
  },
  {
    title: "Categories",
    value: "9",
    subtext: "Active spending categories",
    borderClass: "summary-border-green",
    iconClass: "summary-icon-green",
    icon: Tag,
  },
  {
    title: "Recurring",
    value: "5",
    subtext: "Active subscriptions",
    borderClass: "summary-border-orange",
    iconClass: "summary-icon-orange",
    icon: Repeat,
  },
];

const categoryLegend = [
  { name: "Housing", percent: "35.4% of total", amount: "$1,200.00", color: "#6366f1" },
  { name: "Education", percent: "23.6% of total", amount: "$800.00", color: "#f97316" },
  { name: "Shopping", percent: "15.2% of total", amount: "$515.97", color: "#ec4899" },
];

const recentExpenses = [
  { name: "manunuzi", date: "Oct 19, 2025", amount: "-$200.00", color: "#f59e0b" },
  { name: "Internet Service", date: "Oct 18, 2025", amount: "-$59.99", color: "#60a5fa" },
  { name: "Rent Payment", date: "Oct 18, 2025", amount: "-$1,200.00", color: "#818cf8" },
  { name: "Spotify Premium", date: "Oct 18, 2025", amount: "-$9.99", color: "#60a5fa" },
  { name: "Netflix Subscription", date: "Oct 18, 2025", amount: "-$15.99", color: "#60a5fa" },
];

export default function DashboardPage({ onNavigate }) {
  return (
    <div className="dashboard-page">
      <Sidebar onNavigate={onNavigate} activeTab="dashboard" />
      <div className="dashboard-main">
        <div className="dashboard-content">
          <div className="dashboard-hero">
            <div>
              <h1 className="dashboard-hero-title">Dashboard</h1>
              <p className="dashboard-hero-subtitle">Welcome back, Demo User!</p>
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

          <div className="row g-4 mb-4">
            {summaryCards.map((card) => {
              const Icon = card.icon;
              return (
                <div className="col-md-6 col-xl-3" key={card.title}>
                  <div className={`dashboard-summary-card ${card.borderClass}`}>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <div className="dashboard-summary-title">{card.title}</div>
                        <div className="dashboard-summary-value">{card.value}</div>
                      </div>
                      <div className={`dashboard-summary-icon ${card.iconClass}`}>
                        <Icon size={14} />
                      </div>
                    </div>

                    {card.progress ? (
                      <>
                        <div className="d-flex justify-content-between small text-secondary mb-1">
                          <span>{card.subtext}</span>
                          <span>{card.rightText}</span>
                        </div>
                        <div className="progress dashboard-progress">
                          <div
                            className="progress-bar dashboard-progress-bar"
                            style={{ width: `${card.progress}%` }}
                          />
                        </div>
                      </>
                    ) : (
                      <div className="dashboard-summary-subtext">{card.subtext}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="row g-4 mb-4">
            <div className="col-xl-6">
              <div className="dashboard-panel h-100">
                <h5 className="dashboard-panel-title">6-Month Spending Trend</h5>
                <div className="dashboard-chart-box">
                  <svg viewBox="0 0 520 320" className="w-100 h-100">
                    <defs>
                      <linearGradient id="areaFill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="rgba(168,85,247,0.28)" />
                        <stop offset="100%" stopColor="rgba(168,85,247,0.04)" />
                      </linearGradient>
                    </defs>

                    {[60, 140, 220, 300, 380, 460].map((x) => (
                      <line key={x} x1={x} y1="25" x2={x} y2="280" stroke="#e9e9ef" strokeWidth="1" />
                    ))}
                    {[40, 90, 140, 190, 240].map((y) => (
                      <line key={y} x1="40" y1={y} x2="480" y2={y} stroke="#e9e9ef" strokeWidth="1" />
                    ))}

                    <path
                      d="M 60 205 C 95 198, 110 192, 140 188
                         S 205 170, 220 162
                         S 285 182, 300 190
                         S 365 205, 380 198
                         S 440 115, 460 50
                         L 460 280 L 60 280 Z"
                      fill="url(#areaFill)"
                    />
                    <path
                      d="M 60 205 C 95 198, 110 192, 140 188
                         S 205 170, 220 162
                         S 285 182, 300 190
                         S 365 205, 380 198
                         S 440 115, 460 50"
                      fill="none"
                      stroke="#a855f7"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />

                    {[
                      [60, 205],
                      [140, 188],
                      [220, 162],
                      [300, 190],
                      [380, 198],
                      [460, 50],
                    ].map(([cx, cy], i) => (
                      <circle key={i} cx={cx} cy={cy} r="5" fill="#a855f7" />
                    ))}
                  </svg>
                </div>
              </div>
            </div>

            <div className="col-xl-6">
              <div className="dashboard-panel h-100">
                <h5 className="dashboard-panel-title">Spending by Category</h5>
                <div className="dashboard-donut-wrap">
                  <div className="dashboard-donut-chart"></div>
                  <div className="dashboard-donut-legend">
                    {[
                      ["Housing", "#6366f1"],
                      ["Education", "#f97316"],
                      ["Shopping", "#ec4899"],
                      ["Food & Dining", "#ef4444"],
                      ["Transportation", "#f59e0b"],
                      ["Entertainment", "#8b5cf6"],
                      ["Utilities", "#3b82f6"],
                      ["Personal Care", "#9333ea"],
                      ["Healthcare", "#22c55e"],
                    ].map(([label, color]) => (
                      <div key={label} className="dashboard-legend-item">
                        <span className="dashboard-legend-dot" style={{ background: color }}></span>
                        <span>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4 mb-4">
            <div className="col-xl-6">
              <div className="dashboard-panel h-100">
                <h5 className="dashboard-panel-title">Top Spending Categories</h5>

                <div className="d-grid gap-3 mt-3">
                  {categoryLegend.map((item) => (
                    <div key={item.name} className="dashboard-category-row">
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="dashboard-category-icon"
                          style={{ background: `${item.color}18`, color: item.color }}
                        >
                          <Circle size={10} fill={item.color} stroke={item.color} />
                        </div>
                        <div>
                          <div className="fw-semibold">{item.name}</div>
                          <div className="small text-secondary">{item.percent}</div>
                        </div>
                      </div>
                      <div className="fw-semibold text-secondary">{item.amount}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-xl-6">
              <div className="dashboard-panel h-100">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="dashboard-panel-title mb-0">Recent Expenses</h5>
                  <button className="btn btn-link dashboard-view-link">View All</button>
                </div>

                <div className="d-grid gap-2 mt-3">
                  {recentExpenses.map((item) => (
                    <div key={item.name} className="dashboard-expense-row">
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="dashboard-expense-icon"
                          style={{ background: `${item.color}20` }}
                        >
                          <span style={{ width: 8, height: 8, borderRadius: "50%", background: item.color, display: "inline-block" }}></span>
                        </div>
                        <div>
                          <div className="fw-semibold">{item.name}</div>
                          <div className="small text-secondary">{item.date}</div>
                        </div>
                      </div>
                      <div className="fw-semibold text-secondary">{item.amount}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-md-4">
              <button className="btn dashboard-action-card dashboard-action-purple w-100">
                <Plus size={18} />
                <span>
                  <strong>Add Expense</strong>
                  <small>Record new expense</small>
                </span>
              </button>
            </div>
            <div className="col-md-4">
              <button className="btn dashboard-action-card dashboard-action-blue w-100">
                <RefreshCcw size={18} />
                <span>
                  <strong>Recurring</strong>
                  <small>Manage subscriptions</small>
                </span>
              </button>
            </div>
            <div className="col-md-4">
              <button className="btn dashboard-action-card dashboard-action-green w-100">
                <Tags size={18} />
                <span>
                  <strong>Categories</strong>
                  <small>Organize expenses</small>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

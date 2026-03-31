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
  TriangleAlert,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const summaryCards = [
  {
    title: "Total Spent",
    value: "$3,393.31",
    subtext: "Under budget by $1,606.69",
    borderClass: "summary-border-purple",
    iconClass: "summary-icon-purple",
    icon: DollarSign,
  },
  {
    title: "Monthly Budget",
    value: "$5,000.00",
    subtext: "67.9% used",
    rightText: "$1,606.69 left",
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

const monthlyTrendData = [
  { month: "May", amount: 2200 },
  { month: "Jun", amount: 2600 },
  { month: "Jul", amount: 2450 },
  { month: "Aug", amount: 2900 },
  { month: "Sep", amount: 3100 },
  { month: "Oct", amount: 3393 },
];

const spendingData = [
  { name: "Housing", value: 1200, color: "#6366f1" },
  { name: "Education", value: 800, color: "#f97316" },
  { name: "Shopping", value: 516, color: "#ec4899" },
  { name: "Food", value: 420, color: "#ef4444" },
  { name: "Transport", value: 220, color: "#f59e0b" },
  { name: "Utilities", value: 237, color: "#3b82f6" },
];

const topCategoryRows = [
  {
    name: "Housing",
    percent: "35.4% of total",
    amount: "$1,200.00",
    color: "#6366f1",
  },
  {
    name: "Education",
    percent: "23.6% of total",
    amount: "$800.00",
    color: "#f97316",
  },
  {
    name: "Shopping",
    percent: "15.2% of total",
    amount: "$515.97",
    color: "#ec4899",
  },
];

const recentExpenses = [
  {
    name: "Manunuzi",
    date: "Oct 19, 2025",
    amount: "-$200.00",
    color: "#f59e0b",
  },
  {
    name: "Internet Service",
    date: "Oct 18, 2025",
    amount: "-$59.99",
    color: "#60a5fa",
  },
  {
    name: "Rent Payment",
    date: "Oct 18, 2025",
    amount: "-$1,200.00",
    color: "#818cf8",
  },
  {
    name: "Spotify Premium",
    date: "Oct 18, 2025",
    amount: "-$9.99",
    color: "#60a5fa",
  },
  {
    name: "Netflix Subscription",
    date: "Oct 18, 2025",
    amount: "-$15.99",
    color: "#60a5fa",
  },
];

const alerts = [
  {
    title: "Suspicious Transaction Alert",
    description:
      "A transaction over $2,000 was detected. Please review recent account activity.",
  },
  {
    title: "Budget Warning",
    description:
      "Your Education category is getting close to its monthly limit.",
  },
];

const sidebarItems = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "transactions", label: "Expenses", icon: Receipt },
  { key: "budgets", label: "Budgets", icon: Wallet },
  { key: "categories", label: "Categories", icon: Tags },
  { key: "profile", label: "Profile", icon: Bell },
];

export default function DashboardPage({ onNavigate }) {
  return (
    <div className="dashboard-page">
      <div className="dashboard-sidebar">
        <div>
          <div className="d-flex align-items-center gap-2 dashboard-brand">
            <div className="dashboard-brand-badge">💳</div>
            <span>ExpenseApp</span>
          </div>

          <div className="dashboard-sidebar-label">Platform</div>

          <div className="d-grid gap-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const active = item.key === "dashboard";

              return (
                <button
                  key={item.key}
                  className={`btn dashboard-nav-btn ${active ? "active" : ""}`}
                  onClick={() => {
                    if (item.key === "dashboard") return;
                    onNavigate(item.key);
                  }}
                >
                  <span className="d-flex align-items-center gap-2">
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="d-grid gap-2 mb-3">
            <button className="btn dashboard-bottom-link">
              <FolderGit2 size={15} />
              <span>Repository</span>
            </button>
            <button className="btn dashboard-bottom-link">
              <BookOpen size={15} />
              <span>Documentation</span>
            </button>
          </div>

          <div className="dashboard-user-box">
            <div className="dashboard-user-avatar">DU</div>
            <div>
              <div className="dashboard-user-name">Demo User</div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-main">
        <div className="dashboard-content">
          <div className="dashboard-hero">
            <div>
              <h1 className="dashboard-hero-title">Dashboard</h1>
              <p className="dashboard-hero-subtitle">
                Welcome back, Demo User!
              </p>
            </div>

            <div className="d-flex align-items-center gap-2">
              <button className="btn dashboard-month-btn">
                <ChevronLeft size={16} />
              </button>
              <span className="dashboard-month-text">October 2025</span>
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
            <div className="col-xl-12">
              <div className="dashboard-panel h-100">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <TriangleAlert size={18} color="#dc2626" />
                  <h5 className="dashboard-panel-title mb-0">
                    Alerts & Notifications
                  </h5>
                </div>

                <div className="d-grid gap-3">
                  {alerts.map((alert) => (
                    <div
                      key={alert.title}
                      className="d-flex align-items-start gap-3 p-3 rounded-4"
                      style={{
                        background: "#fef2f2",
                        border: "1px solid #fecaca",
                      }}
                    >
                      <TriangleAlert
                        size={18}
                        color="#dc2626"
                        style={{ marginTop: 2 }}
                      />
                      <div>
                        <div className="fw-semibold">{alert.title}</div>
                        <div className="small text-secondary">
                          {alert.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4 mb-4">
            <div className="col-xl-6">
              <div className="dashboard-panel h-100">
                <h5 className="dashboard-panel-title">6-Month Spending Trend</h5>

                <div className="dashboard-chart-box">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyTrendData}>
                      <XAxis dataKey="month" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Bar
                        dataKey="amount"
                        radius={[8, 8, 0, 0]}
                        fill="#7c3aed"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="col-xl-6">
              <div className="dashboard-panel h-100">
                <h5 className="dashboard-panel-title">Spending by Category</h5>

                <div className="dashboard-donut-wrap">
                  <div className="dashboard-real-donut">
                    <ResponsiveContainer width="100%" height={240}>
                      <PieChart>
                        <Pie
                          data={spendingData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={55}
                          outerRadius={85}
                          paddingAngle={3}
                        >
                          {spendingData.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="dashboard-donut-legend">
                    {spendingData.map((item) => (
                      <div key={item.name} className="dashboard-legend-item">
                        <span
                          className="dashboard-legend-dot"
                          style={{ background: item.color }}
                        ></span>
                        <span>{item.name}</span>
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
                  {topCategoryRows.map((item) => (
                    <div key={item.name} className="dashboard-category-row">
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="dashboard-category-icon"
                          style={{
                            background: `${item.color}18`,
                            color: item.color,
                          }}
                        >
                          <span
                            style={{
                              width: 10,
                              height: 10,
                              borderRadius: "50%",
                              background: item.color,
                              display: "inline-block",
                            }}
                          ></span>
                        </div>

                        <div>
                          <div className="fw-semibold">{item.name}</div>
                          <div className="small text-secondary">
                            {item.percent}
                          </div>
                        </div>
                      </div>

                      <div className="fw-semibold text-secondary">
                        {item.amount}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-xl-6">
              <div className="dashboard-panel h-100">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="dashboard-panel-title mb-0">Recent Expenses</h5>
                  <button
                    className="btn btn-link dashboard-view-link"
                    onClick={() => onNavigate("transactions")}
                  >
                    View All
                  </button>
                </div>

                <div className="d-grid gap-2 mt-3">
                  {recentExpenses.map((item) => (
                    <div key={item.name} className="dashboard-expense-row">
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="dashboard-expense-icon"
                          style={{ background: `${item.color}20` }}
                        >
                          <span
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              background: item.color,
                              display: "inline-block",
                            }}
                          ></span>
                        </div>

                        <div>
                          <div className="fw-semibold">{item.name}</div>
                          <div className="small text-secondary">{item.date}</div>
                        </div>
                      </div>

                      <div className="fw-semibold text-secondary">
                        {item.amount}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-md-4">
              <button
                className="btn dashboard-action-card dashboard-action-purple w-100"
                onClick={() => onNavigate("add-transaction")}
              >
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
              <button
                className="btn dashboard-action-card dashboard-action-green w-100"
                onClick={() => onNavigate("categories")}
              >
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
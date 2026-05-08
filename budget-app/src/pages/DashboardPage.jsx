import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Circle,
} from "lucide-react";
import Sidebar from "../components/landing/Sidebar";
import { api } from "../api";


const getColorFromId = (id) => {
  const CATEGORY_COLORS = [
    "#6366f1", "#f97316", "#ec4899", "#ef4444",
    "#f59e0b", "#8b5cf6", "#3b82f6", "#9333ea", "#22c55e"
  ];
  const hash = parseInt((id || "0").slice(-4), 16);
  return CATEGORY_COLORS[hash % CATEGORY_COLORS.length];
};

export default function DashboardPage({ onNavigate }) {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchDashboard = async (year, month) => {
    setLoading(true);
    setError("");
    try {
      const monthStr = `${year}-${String(month + 1).padStart(2, "0")}`;
      const res = await api.get(`/api/dashboard?month=${monthStr}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError("Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard(currentYear, currentMonth);
  }, [currentYear, currentMonth]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
    else setCurrentMonth(currentMonth - 1);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
    else setCurrentMonth(currentMonth + 1);
  };

  // ── Donut chart builder ──────────────────────────────────────────────────
  const buildDonut = (categories) => {
    if (!categories || categories.length === 0) return null;
    const total = categories.reduce((s, c) => s + c.amount, 0);
    if (total === 0) return null;

    const cx = 80, cy = 80, r = 60, stroke = 28;
    const circ = 2 * Math.PI * r;
    let offset = 0;
    return categories.map((cat, i) => {
      const dash = (cat.amount / total) * circ;
      const slice = (
        <circle
          key={cat.category_id}
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={getColorFromId(cat.category_id)}
          strokeWidth={stroke}
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeDashoffset={-offset}
          transform={`rotate(-90 ${cx} ${cy})`}
        />
      );
      offset += dash;
      return slice;
    });
  };

  // ── Trend chart builder ──────────────────────────────────────────────────
  const buildTrend = (trend) => {
    if (!trend || trend.length === 0) return null;
    const maxVal = Math.max(...trend.map(t => t.total), 1);
    const W = 900, H = 280, padX = 60, padY = 40;
    const chartW = W - padX * 2;
    const chartH = H - padY * 2;
    const points = trend.map((t, i) => {
      const x = padX + (i / (trend.length - 1)) * chartW;
      const y = padY + chartH - (t.total / maxVal) * chartH;
      return [x, y];
    });

    const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");
    const areaD = pathD + ` L ${points[points.length - 1][0]} ${padY + chartH} L ${points[0][0]} ${padY + chartH} Z`;

    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="w-100 h-100">
        <defs>
          <linearGradient id="areaFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(168,85,247,0.28)" />
            <stop offset="100%" stopColor="rgba(168,85,247,0.04)" />
          </linearGradient>
        </defs>
        {points.map(([x], i) => (
          <line key={i} x1={x} y1={padY} x2={x} y2={padY + chartH} stroke="#e9e9ef" strokeWidth="1" />
        ))}
        <path d={areaD} fill="url(#areaFill)" />
        <path d={pathD} fill="none" stroke="#a855f7" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        {points.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="5" fill="#a855f7" />
            <text x={x} y={padY + chartH + 18} textAnchor="middle" fontSize="13" fill="#888">
              {trend[i].month}
            </text>
          </g>
        ))}
      </svg>
    );
  };

  const summary = data?.summary || {};
  const recentExpenses = (data?.recent_expenses || []).slice(0, 3);
  const categorySpending = data?.category_spending || [];
  const trend = data?.trend || [];
  const netBalance = summary.net_balance || 0;

  const summaryCards = [
    {
      title: "Total Spent",
      value: `$${(summary.total_spent || 0).toFixed(2)}`,
      subtext: summary.budget_remaining >= 0
        ? `Under budget by $${(summary.budget_remaining || 0).toFixed(2)}`
        : `Over budget by $${Math.abs(summary.budget_remaining || 0).toFixed(2)}`,
      borderClass: "summary-border-purple",
      iconClass: "summary-icon-purple",
      icon: DollarSign,
    },
    {
      title: "Total Income",
      value: `$${(summary.total_income || 0).toFixed(2)}`,
      subtext: "Money received this month",
      borderClass: "summary-border-green",
      iconClass: "summary-icon-green",
      icon: TrendingUp,
    },
    {
      title: "Net Balance",
      value: `${netBalance >= 0 ? "+" : "-"}$${Math.abs(netBalance).toFixed(2)}`,
      subtext: netBalance >= 0 ? "You're in the green" : "Spending exceeds income",
      borderClass: netBalance >= 0 ? "summary-border-green" : "summary-border-purple",
      iconClass: netBalance >= 0 ? "summary-icon-green" : "summary-icon-purple",
      icon: netBalance >= 0 ? TrendingUp : TrendingDown,
    },
  ];

  return (
    <div className="dashboard-page">
      <Sidebar onNavigate={onNavigate} activeTab="dashboard" user={user} />
      <div className="dashboard-main">
        <div className="dashboard-content">
          <div className="dashboard-hero">
            <div>
              <h1 className="dashboard-hero-title">Dashboard</h1>
              <p className="dashboard-hero-subtitle">Welcome back, {user.display_name || "User"}!</p>
            </div>
            <div className="d-flex align-items-center gap-2">
              <button className="btn dashboard-month-btn" onClick={handlePrevMonth}>
                <ChevronLeft size={16} />
              </button>
              <span className="dashboard-month-text">{monthNames[currentMonth]} {currentYear}</span>
              <button className="btn dashboard-month-btn" onClick={handleNextMonth}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {error && <div className="alert alert-danger mb-3">{error}</div>}

          {loading ? (
            <div className="text-center py-5">Loading...</div>
          ) : (
            <>
              {/* ── 3 Summary Cards ── */}
              <div className="row g-4 mb-4">
                {summaryCards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <div className="col-md-4" key={card.title}>
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
                        <div className="dashboard-summary-subtext" style={{
                          color: card.title === "Total Spent" && summary.budget_remaining < 0 ? "#ef4444" : "#22c55e"
                        }}>
                          {card.subtext}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ── Full Width Trend Chart ── */}
              <div className="row g-4 mb-4">
                <div className="col-12">
                  <div className="dashboard-panel">
                    <h5 className="dashboard-panel-title">6-Month Spending Trend</h5>
                    <div className="dashboard-chart-box">
                      {buildTrend(trend)}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Donut + Top Categories merged | Recent Expenses ── */}
              <div className="row g-4 mb-4">
                <div className="col-xl-6">
                  <div className="dashboard-panel h-100">
                    <h5 className="dashboard-panel-title">Spending by Category</h5>
                    <div className="dashboard-donut-wrap">
                      <svg viewBox="0 0 160 160" width="160" height="160">
                        {buildDonut(categorySpending)}
                        {categorySpending.length === 0 && (
                          <circle cx="80" cy="80" r="60" fill="none" stroke="#e9e9ef" strokeWidth="28" />
                        )}
                      </svg>
                      <div className="dashboard-donut-legend">
                        {categorySpending.map((cat, i) => (
                          <div key={cat.category_id} className="dashboard-legend-item">
                            <span
                              className="dashboard-legend-dot"
                              style={{ background: getColorFromId(cat.category_id) }}
                            ></span>
                            <span>{cat.category_name}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Top Categories merged below donut */}
                    {categorySpending.length > 0 && (
                      <div className="d-grid gap-3 mt-4">
                        {categorySpending.slice(0, 3).map((item, i) => (
                          <div key={item.category_id} className="dashboard-category-row">
                            <div className="d-flex align-items-center gap-3">
                              <div
                                className="dashboard-category-icon"
                                style={{
                                  background: `${getColorFromId(item.category_id)}18`,
                                  color: getColorFromId(item.category_id)
                                }}
                              >
                                <Circle size={10} fill={getColorFromId(item.category_id)} stroke={getColorFromId(item.category_id)} />
                              </div>
                              <div>
                                <div className="fw-semibold">{item.category_name}</div>
                                <div className="small text-secondary">{item.percent}% of total</div>
                              </div>
                            </div>
                            <div className="fw-semibold text-secondary">${item.amount.toFixed(2)}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Expenses — trimmed to 3 */}
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
                      {recentExpenses.length === 0 ? (
                        <div className="text-secondary">No recent expenses.</div>
                      ) : recentExpenses.map((item, i) => (
                        <div key={item.id} className="dashboard-expense-row">
                          <div className="d-flex align-items-center gap-3">
                            <div
                              className="dashboard-expense-icon"
                              style={{ background: `${getColorFromId(item.category_id)}20` }}
                            >
                              <span style={{
                                width: 8, height: 8, borderRadius: "50%",
                                background: getColorFromId(item.category_id),
                                display: "inline-block"
                              }}></span>
                            </div>
                            <div>
                              <div className="fw-semibold">{item.title}</div>
                              <div className="small text-secondary">{item.date}</div>
                            </div>
                          </div>
                          <div className="fw-semibold text-secondary">-${item.amount.toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

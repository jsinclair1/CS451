import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, CircleCheck, TriangleAlert, XCircle, Download } from "lucide-react";
import Sidebar from "../components/landing/Sidebar";
import { api } from "../api";

export default function ReportsPage({ onNavigate }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
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

  const fetchReports = async (year, month) => {
    setLoading(true);
    setError("");
    try {
      const monthStr = `${year}-${String(month + 1).padStart(2, "0")}`;
      const res = await api.get(`/api/reports?month=${monthStr}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError("Failed to load reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(currentYear, currentMonth);
  }, [currentYear, currentMonth]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
    else setCurrentMonth(currentMonth - 1);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
    else setCurrentMonth(currentMonth + 1);
  };

  const handleExportCSV = () => {
    if (!data) return;

    const monthLabel = `${monthNames[currentMonth]} ${currentYear}`;

    const rows = [
      [`ExpenseApp — Monthly Report: ${monthLabel}`],
      [],
      ["INCOME vs EXPENSES"],
      ["", "Amount"],
      ["Total Income", `$${summary.total_income.toFixed(2)}`],
      ["Total Expenses", `$${summary.total_expenses.toFixed(2)}`],
      ["Net Balance", `$${summary.net_balance >= 0 ? "+" : ""}${summary.net_balance.toFixed(2)}`],
      [],
      ["SPENDING BY CATEGORY"],
      ["Category", "Amount", "% of Total"],
      ...data.category_spending.map(c => [
        c.category_name,
        `$${c.amount.toFixed(2)}`,
        `${c.percent}%`
      ]),
      [],
      ["BUDGET PERFORMANCE"],
      ["Category", "Budget Limit", "Amount Spent", "Remaining", "Status"],
      ...data.budget_performance.map(b => [
        b.category_name,
        `$${b.limit_amount.toFixed(2)}`,
        `$${b.spent.toFixed(2)}`,
        `$${Math.abs(b.remaining).toFixed(2)}${b.remaining < 0 ? " over" : ""}`,
        b.status
      ]),
    ];

    const csv = rows.map(r => r.map(cell => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ExpenseApp-Report-${currentYear}-${String(currentMonth + 1).padStart(2, "0")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status) => {
    if (status === "Over Budget") return <XCircle size={15} className="text-danger" />;
    if (status === "Warning") return <TriangleAlert size={15} className="text-warning" />;
    return <CircleCheck size={15} className="text-success" />;
  };

  const summary = data?.summary || {};
  const categorySpending = data?.category_spending || [];
  const budgetPerformance = data?.budget_performance || [];
  const netBalance = summary.net_balance || 0;

  return (
    <div className="dashboard-page">
      <Sidebar onNavigate={onNavigate} activeTab="reports" user={user} />
      <div className="dashboard-main">
        <div className="dashboard-content">
          <div className="dashboard-hero">
            <div>
              <h1 className="dashboard-hero-title">Reports</h1>
              <p className="dashboard-hero-subtitle">Monthly financial summary</p>
            </div>
            <div className="d-flex align-items-center gap-3">
              <div className="d-flex align-items-center gap-2">
                <button className="btn dashboard-month-btn" onClick={handlePrevMonth}>
                  <ChevronLeft size={16} />
                </button>
                <span className="dashboard-month-text">{monthNames[currentMonth]} {currentYear}</span>
                <button className="btn dashboard-month-btn" onClick={handleNextMonth}>
                  <ChevronRight size={16} />
                </button>
              </div>
              <button
                className="btn btn-brand d-inline-flex align-items-center gap-2"
                onClick={handleExportCSV}
                disabled={!data}
              >
                <Download size={15} />
                Export CSV
              </button>
            </div>
          </div>

          {error && <div className="alert alert-danger mb-3">{error}</div>}

          {loading ? (
            <div className="text-center py-5">Loading...</div>
          ) : (
            <>
              {/* ── Horizontal Summary Bar ── */}
              <div className="dashboard-panel mb-4">
                <div className="d-flex align-items-center justify-content-around flex-wrap gap-3 py-2">
                  <div className="text-center">
                    <div className="transactions-label mb-1">Total Expenses</div>
                    <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#a855f7" }}>
                      ${(summary.total_expenses || 0).toFixed(2)}
                    </div>
                  </div>
                  <div style={{ width: "1px", height: "48px", background: "#ecedf2" }} className="d-none d-md-block" />
                  <div className="text-center">
                    <div className="transactions-label mb-1">Total Income</div>
                    <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#22c55e" }}>
                      ${(summary.total_income || 0).toFixed(2)}
                    </div>
                  </div>
                  <div style={{ width: "1px", height: "48px", background: "#ecedf2" }} className="d-none d-md-block" />
                  <div className="text-center">
                    <div className="transactions-label mb-1">Net Balance</div>
                    <div style={{ fontSize: "1.6rem", fontWeight: 800, color: netBalance >= 0 ? "#22c55e" : "#ef4444" }}>
                      {netBalance >= 0 ? "+" : "-"}${Math.abs(netBalance).toFixed(2)}
                    </div>
                  </div>
                  <div style={{ width: "1px", height: "48px", background: "#ecedf2" }} className="d-none d-md-block" />
                  <div className="text-center">
                    <div className="transactions-label mb-1">Savings Rate</div>
                    <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#3b82f6" }}>
                      {summary.total_income > 0
                        ? `${Math.max(0, Math.round((netBalance / summary.total_income) * 100))}%`
                        : "—"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="row g-4">
                {/* ── Spending by Category Table ── */}
                <div className="col-xl-6">
                  <div className="dashboard-panel h-100">
                    <h5 className="dashboard-panel-title">Spending by Category</h5>
                    {categorySpending.length === 0 ? (
                      <div className="text-secondary mt-3">No expense data for this month.</div>
                    ) : (
                      <div className="table-responsive mt-3">
                        <table className="table transactions-table align-middle mb-0">
                          <thead>
                            <tr>
                              <th>CATEGORY</th>
                              <th>AMOUNT</th>
                              <th>% OF TOTAL</th>
                              <th>BREAKDOWN</th>
                            </tr>
                          </thead>
                          <tbody>
                            {categorySpending.map((cat) => (
                              <tr key={cat.category_id}>
                                <td className="fw-semibold">{cat.category_name}</td>
                                <td>${cat.amount.toFixed(2)}</td>
                                <td>{cat.percent}%</td>
                                <td style={{ width: "120px" }}>
                                  <div className="progress" style={{ height: "6px", borderRadius: "999px", background: "#ecedf2" }}>
                                    <div
                                      className="progress-bar"
                                      style={{ width: `${cat.percent}%`, background: "#a855f7", borderRadius: "999px" }}
                                    />
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Budget Performance ── */}
                <div className="col-xl-6">
                  <div className="dashboard-panel h-100">
                    <h5 className="dashboard-panel-title">Budget Performance</h5>
                    {budgetPerformance.length === 0 ? (
                      <div className="text-secondary mt-3">No budgets set for this month.</div>
                    ) : (
                      <div className="table-responsive mt-3">
                        <table className="table transactions-table align-middle mb-0">
                          <thead>
                            <tr>
                              <th>CATEGORY</th>
                              <th>LIMIT</th>
                              <th>SPENT</th>
                              <th>STATUS</th>
                            </tr>
                          </thead>
                          <tbody>
                            {budgetPerformance.map((b, i) => (
                              <tr key={i}>
                                <td className="fw-semibold">{b.category_name}</td>
                                <td>${b.limit_amount.toFixed(2)}</td>
                                <td>${b.spent.toFixed(2)}</td>
                                <td>
                                  <span className="d-flex align-items-center gap-1">
                                    {getStatusIcon(b.status)}
                                    <span style={{ fontSize: "0.85rem" }}>{b.status}</span>
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
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
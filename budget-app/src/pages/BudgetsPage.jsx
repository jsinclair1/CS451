import { useState, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  TriangleAlert,
  XCircle,
} from "lucide-react";
import Sidebar from "../components/landing/Sidebar";
import EditBudgetModal from "../components/EditBudgetModal";
import { api } from "../api";

export default function BudgetsPage({ onNavigate }) {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-indexed
  const [budgetData, setBudgetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingLimit, setEditingLimit] = useState(null);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const fetchBudgets = async (year, month) => {
    setLoading(true);
    setError("");
    try {
      const monthStr = `${year}-${String(month + 1).padStart(2, "0")}`;
      const res = await api.get(`/api/budgets?month=${monthStr}`);
      const data = await res.json();
      setBudgetData(data);
    } catch (err) {
      setError("Failed to load budgets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets(currentYear, currentMonth);
  }, [currentYear, currentMonth]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDelete = async (limitId) => {
    if (!window.confirm("Are you sure you want to delete this budget?")) return;
    try {
      await api.delete(`/api/budget-limits/${limitId}`);
      fetchBudgets(currentYear, currentMonth);
    } catch (err) {
      setError("Failed to delete budget.");
    }
  };

  const handleEditSaved = () => {
    setEditingLimit(null);
    fetchBudgets(currentYear, currentMonth);
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "Over Budget":
        return { icon: XCircle, statusClass: "bgp-status-red", progressClass: "bgp-progress-red", headerClass: "bgp-card-header-red" };
      case "Warning":
        return { icon: TriangleAlert, statusClass: "bgp-status-yellow", progressClass: "bgp-progress-orange", headerClass: "bgp-card-header-orange" };
      default:
        return { icon: CircleCheck, statusClass: "bgp-status-green", progressClass: "bgp-progress-green", headerClass: "bgp-card-header-slate" };
    }
  };

  const summary = budgetData?.summary || { total_budget: 0, total_spent: 0, remaining: 0, usage_percent: 0 };
  const limits = budgetData?.budget_limits || [];

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

          <div className="bgp-shell">
            <div className="bgp-summary-card">
              <h4 className="bgp-section-title">Overall Budget Summary</h4>

              <div className="row g-4 mt-1 mb-3">
                <div className="col-md-6 col-xl-3">
                  <div className="bgp-label">Total Budget</div>
                  <div className="bgp-value">${summary.total_budget.toFixed(2)}</div>
                </div>
                <div className="col-md-6 col-xl-3">
                  <div className="bgp-label">Total Spent</div>
                  <div className="bgp-value text-primary">${summary.total_spent.toFixed(2)}</div>
                </div>
                <div className="col-md-6 col-xl-3">
                  <div className="bgp-label">Remaining</div>
                  <div className="bgp-value text-success">${summary.remaining.toFixed(2)}</div>
                </div>
                <div className="col-md-6 col-xl-3">
                  <div className="bgp-label">Usage</div>
                  <div className="bgp-value">{summary.usage_percent}%</div>
                </div>
              </div>

              <div className="progress bgp-summary-progress">
                <div
                  className="progress-bar bgp-progress-green"
                  style={{ width: `${Math.min(summary.usage_percent, 100)}%` }}
                ></div>
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

            {loading ? (
              <div className="text-center py-5">Loading...</div>
            ) : limits.length === 0 ? (
              <div className="text-center py-5 text-secondary">No budgets set for this month.</div>
            ) : (
              <div className="row g-4">
                {limits.map((limit) => {
                  const { icon: StatusIcon, statusClass, progressClass, headerClass } = getStatusConfig(limit.status);
                  return (
                    <div className="col-md-6 col-xl-4" key={limit.id}>
                      <div className="bgp-budget-card">
                        <div className={`bgp-card-header ${headerClass}`}>
                          <div>
                            <h5 className="bgp-card-title">{limit.category_name}</h5>
                            <div className="bgp-card-subtitle">Monthly Limit</div>
                          </div>
                          <div className="d-flex gap-2">
                            <button className="btn bgp-card-action-btn" onClick={() => setEditingLimit(limit)}>
                              <Pencil size={14} />
                            </button>
                            <button className="btn bgp-card-action-btn" onClick={() => handleDelete(limit.id)}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        <div className="bgp-card-body">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="bgp-label">Budget</span>
                            <span className="bgp-card-value">${limit.limit_amount.toFixed(2)}</span>
                          </div>

                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="bgp-label">Progress</span>
                            <span className={progressClass === "bgp-progress-orange" ? "text-warning fw-bold" : "bgp-progress-percent"}>
                              {limit.progress}%
                            </span>
                          </div>

                          <div className="progress bgp-card-progress mb-4">
                            <div
                              className={`progress-bar ${progressClass}`}
                              style={{ width: `${Math.min(limit.progress, 100)}%` }}
                            ></div>
                          </div>

                          <div className="d-flex justify-content-between mb-2">
                            <span className="bgp-label">Spent</span>
                            <span className="fw-semibold">${limit.spent.toFixed(2)}</span>
                          </div>

                          <div className="d-flex justify-content-between mb-4">
                            <span className="bgp-label">Remaining</span>
                            <span className="fw-semibold text-success">${Math.max(limit.remaining, 0).toFixed(2)}</span>
                          </div>

                          <div className={`bgp-status-box ${statusClass}`}>
                            <StatusIcon size={16} />
                            <span>{limit.status}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {editingLimit && (
        <EditBudgetModal
          limit={editingLimit}
          onClose={() => setEditingLimit(null)}
          onSaved={handleEditSaved}
        />
      )}
    </div>
  );
}

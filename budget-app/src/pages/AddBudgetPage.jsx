import { useState, useEffect } from "react";
import { X, CalendarDays, BadgeDollarSign, Check } from "lucide-react";
import { api } from "../api";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function AddBudgetPage({ onNavigate }) {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [categoryId, setCategoryId] = useState("");
  const [limitAmount, setLimitAmount] = useState("");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const years = [today.getFullYear() - 1, today.getFullYear(), today.getFullYear() + 1];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/api/categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async () => {
    setError("");

    if (!categoryId || !limitAmount) {
      setError("Category and budget amount are required.");
      return;
    }

    setLoading(true);
    try {
      const monthStr = `${year}-${String(month + 1).padStart(2, "0")}`;
      const res = await api.post("/api/budgets", {
        month: monthStr,
        category_id: categoryId,
        limit_amount: parseFloat(limitAmount),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create budget.");
        return;
      }

      onNavigate("budgets");
    } catch (err) {
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-transaction-page">
      <div className="add-transaction-topbar">
        <div>
          <h1 className="add-transaction-title">Create New Budget</h1>
          <p className="add-transaction-subtitle">Set spending limits for better financial control</p>
        </div>
        <button className="btn add-transaction-close" onClick={() => onNavigate("budgets")}>
          <X size={18} />
        </button>
      </div>

      <div className="add-transaction-content">
        {error && <div className="alert alert-danger mb-3">{error}</div>}

        <div className="add-transaction-card">
          <div className="d-flex align-items-center gap-2 mb-4">
            <CalendarDays size={22} className="text-primary" />
            <h5 className="add-section-title mb-0">Budget Period</h5>
          </div>

          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label transactions-label">Month *</label>
              <select
                className="form-select transactions-input"
                value={month}
                onChange={(e) => setMonth(parseInt(e.target.value))}
              >
                {MONTHS.map((m, i) => (
                  <option key={m} value={i}>{m}</option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label transactions-label">Year *</label>
              <select
                className="form-select transactions-input"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
              >
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="add-transaction-card">
          <div className="d-flex align-items-center gap-2 mb-4">
            <BadgeDollarSign size={22} className="text-primary" />
            <h5 className="add-section-title mb-0">Budget Details</h5>
          </div>

          <div className="row g-3">
            <div className="col-12">
              <label className="form-label transactions-label">Category *</label>
              <select
                className="form-select transactions-input"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <div className="budget-helper-text">
                Select a category to set a spending limit for it this month.
              </div>
            </div>

            <div className="col-12">
              <label className="form-label transactions-label">Budget Amount *</label>
              <input
                type="number"
                className="form-control transactions-input"
                placeholder="$ 0.00"
                value={limitAmount}
                onChange={(e) => setLimitAmount(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>

        <div className="add-transaction-actions">
          <button className="btn add-cancel-btn" onClick={() => onNavigate("budgets")}>
            Cancel
          </button>
          <button
            className="btn btn-brand d-inline-flex align-items-center gap-2"
            onClick={handleSubmit}
            disabled={loading}
          >
            <Check size={16} />
            {loading ? "Saving..." : "Save Budget"}
          </button>
        </div>
      </div>
    </div>
  );
}
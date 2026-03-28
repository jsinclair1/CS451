import { X, CalendarDays, BadgeDollarSign, Check } from "lucide-react";

export default function AddBudgetPage({ onNavigate }) {
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
        <div className="add-transaction-card">
          <div className="d-flex align-items-center gap-2 mb-4">
            <CalendarDays size={22} className="text-primary" />
            <h5 className="add-section-title mb-0">Budget Period</h5>
          </div>

          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label transactions-label">Month *</label>
              <select className="form-select transactions-input">
                <option>October</option>
                <option>November</option>
                <option>December</option>
                <option>January</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label transactions-label">Year *</label>
              <select className="form-select transactions-input">
                <option>2025</option>
                <option>2026</option>
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
              <label className="form-label transactions-label">Category</label>
              <select className="form-select transactions-input">
                <option>Overall Budget (All Categories)</option>
                <option>Housing</option>
                <option>Education</option>
                <option>Utilities</option>
                <option>Food & Dining</option>
                <option>Transportation</option>
                <option>Shopping</option>
              </select>

              <div className="budget-helper-text">
                Leave blank to create an overall budget, or select a category for specific tracking.
              </div>
            </div>

            <div className="col-12">
              <label className="form-label transactions-label">Budget Amount *</label>
              <input type="text" className="form-control transactions-input" placeholder="$ 0.00" />
            </div>
          </div>
        </div>

        <div className="add-transaction-actions">
          <button className="btn add-cancel-btn" onClick={() => onNavigate("budgets")}>
            Cancel
          </button>

          <button className="btn btn-brand d-inline-flex align-items-center gap-2">
            <Check size={16} />
            Save Budget
          </button>
        </div>
      </div>
    </div>
  );
}
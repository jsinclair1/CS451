import { X, Check, FileText, RefreshCcw } from "lucide-react";

export default function AddTransactionPage({ onNavigate }) {
  return (
    <div className="add-transaction-page">
      <div className="add-transaction-topbar">
        <div>
          <h1 className="add-transaction-title">Add New Expense</h1>
          <p className="add-transaction-subtitle">Record a new expense</p>
        </div>

        <button className="btn add-transaction-close" onClick={() => onNavigate("transactions")}>
          <X size={18} />
        </button>
      </div>

      <div className="add-transaction-content">
        <div className="add-transaction-card">
          <h5 className="add-section-title">Basic Information</h5>

          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label transactions-label">Amount *</label>
              <input type="text" className="form-control transactions-input" placeholder="$ 0.00" />
            </div>

            <div className="col-md-6">
              <label className="form-label transactions-label">Date *</label>
              <input type="text" className="form-control transactions-input" value="4/1/26" readOnly />
            </div>

            <div className="col-12">
              <label className="form-label transactions-label">Title *</label>
              <input
                type="text"
                className="form-control transactions-input"
                placeholder="e.g., Grocery Shopping"
              />
            </div>

            <div className="col-12">
              <label className="form-label transactions-label">Category</label>
              <select className="form-select transactions-input">
                <option>Select a category</option>
                <option>Housing</option>
                <option>Utilities</option>
                <option>Food & Dining</option>
                <option>Transportation</option>
                <option>Shopping</option>
              </select>
              <div className="add-category-link">Don&apos;t see your category? Create one</div>
            </div>

            <div className="col-12">
              <label className="form-label transactions-label">Description</label>
              <textarea
                className="form-control transactions-input add-description-box"
                placeholder="Add any additional notes..."
                rows="4"
              ></textarea>
            </div>
          </div>
        </div>

        <div className="add-transaction-card">
          <h5 className="add-section-title">Expense Type</h5>

          <div className="row g-3">
            <div className="col-md-6">
              <div className="expense-type-card active">
                <div className="d-flex align-items-center gap-3">
                  <div className="expense-type-icon purple">
                    <FileText size={18} />
                  </div>
                  <div>
                    <div className="fw-semibold">One-time</div>
                    <div className="expense-type-subtext">Single expense</div>
                  </div>
                </div>
                <Check size={16} className="expense-check-icon" />
              </div>
            </div>

            <div className="col-md-6">
              <div className="expense-type-card">
                <div className="d-flex align-items-center gap-3">
                  <div className="expense-type-icon gray">
                    <RefreshCcw size={18} />
                  </div>
                  <div>
                    <div className="fw-semibold">Recurring</div>
                    <div className="expense-type-subtext">Repeating expense</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="add-transaction-actions">
          <button className="btn add-cancel-btn" onClick={() => onNavigate("transactions")}>
            Cancel
          </button>

          <button className="btn btn-brand d-inline-flex align-items-center gap-2">
            <Check size={16} />
            Save Expense
          </button>
        </div>
      </div>
    </div>
  );
}

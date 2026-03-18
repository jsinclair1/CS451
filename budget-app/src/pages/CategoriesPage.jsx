import { Pencil, Lock } from "lucide-react";

const colors = [
  "#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16", "#22c55e",
  "#10b981", "#06b6d4", "#0ea5e9", "#3b82f6", "#6366f1", "#8b5cf6",
  "#a855f7", "#d946ef", "#ec4899", "#f43f5e", "#fb7185", "#fda4af"
];

const existingCategories = [
  { name: "Education", count: 2, color: "#f97316", locked: true },
  { name: "Entertainment", count: 7, color: "#8b5cf6", locked: true },
  { name: "Food & Dining", count: 9, color: "#ef4444", locked: true },
  { name: "Healthcare", count: 7, color: "#10b981", locked: true },
  { name: "Housing", count: 1, color: "#6366f1", locked: true },
  { name: "Personal Care", count: 2, color: "#a855f7", locked: true },
  { name: "Shopping", count: 4, color: "#ec4899", locked: true },
];

export default function CategoriesPage({ onNavigate }) {
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
            <button className="btn dashboard-nav-btn" onClick={() => onNavigate("dashboard")}>
              Dashboard
            </button>
            <button className="btn dashboard-nav-btn" onClick={() => onNavigate("transactions")}>
              Expenses
            </button>
            <button className="btn dashboard-nav-btn" onClick={() => onNavigate("budgets")}>
              Budgets
            </button>
            <button className="btn dashboard-nav-btn active">Categories</button>
            <button className="btn dashboard-nav-btn">Notification Preference</button>
          </div>
        </div>

        <div>
          <div className="d-grid gap-2 mb-3">
            <button className="btn dashboard-bottom-link">Repository</button>
            <button className="btn dashboard-bottom-link">Documentation</button>
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
          <div className="categories-hero">
            <h1 className="dashboard-hero-title">Categories</h1>
            <p className="dashboard-hero-subtitle">Organize your expenses with custom categories</p>
          </div>

          <div className="row g-4 categories-shell">
            <div className="col-lg-4">
              <div className="categories-card">
                <h5 className="categories-card-title mb-4">Create Category</h5>
                
                <div className="mb-3">
                  <label className="form-label categories-label">Category Name <span className="text-danger">*</span></label>
                  <input type="text" className="form-control categories-input" placeholder="e.g., Food & Dining" />
                </div>

                <div className="mb-4">
                  <label className="form-label categories-label">Color <span className="text-danger">*</span></label>
                  <div className="color-picker-grid">
                    {colors.map((color, index) => (
                      <div 
                        key={index} 
                        className={`color-swatch ${color === "#3b82f6" ? "active" : ""}`} 
                        style={{ backgroundColor: color }}
                      ></div>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="cat-preview-box">
                    <span className="cat-preview-label">Preview:</span>
                    <div className="cat-preview-pill mt-2">
                      <span className="cat-preview-dot"></span>
                      Category Name
                    </div>
                  </div>
                </div>

                <button className="btn btn-success w-100 py-2 fw-bold" style={{ backgroundColor: "#16a34a" }}>
                  Create
                </button>
              </div>
            </div>

            <div className="col-lg-8">
              <div className="categories-card">
                <div className="mb-4">
                  <h5 className="categories-card-title mb-1">Your Categories</h5>
                  <div className="categories-card-subtitle">{existingCategories.length} categories</div>
                </div>

                <div className="categories-list">
                  {existingCategories.map((cat, index) => (
                    <div className="cat-list-item" key={index}>
                      <div className="d-flex align-items-center gap-3">
                        <div className="cat-icon-wrapper" style={{ backgroundColor: `${cat.color}20` }}>
                          <div className="cat-icon-dot" style={{ backgroundColor: cat.color }}></div>
                        </div>
                        <div>
                          <div className="fw-bold text-dark">{cat.name}</div>
                          <div className="text-secondary small">{cat.count} expenses</div>
                        </div>
                      </div>
                      
                      <div className="d-flex gap-3 text-secondary">
                        <button className="btn p-0 text-secondary hover-primary"><Pencil size={16} /></button>
                        {cat.locked && <Lock size={16} className="opacity-50" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
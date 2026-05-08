import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
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

export default function CategoriesPage({ onNavigate }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newName, setNewName] = useState("");
  const [isIncome, setIsIncome] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState("");

  const fetchCategories = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/categories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      setError("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setIsSubmitting(true);
    setError("");
    setSuccess("");
    try {
      const res = await api.post("/api/categories", {
        name: newName.trim(),
        is_income: isIncome,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create category.");
        return;
      }
      setNewName("");
      setIsIncome(false);
      setSuccess("Category created successfully.");
      fetchCategories();
      setTimeout(() => setSuccess(""), 2500);
    } catch (err) {
      setError("Unable to connect to the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      const res = await api.delete(`/api/categories/${id}`);
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to delete category.");
        return;
      }
      fetchCategories();
    } catch (err) {
      setError("Failed to delete category.");
    }
  };

  const expenseCategories = categories.filter(c => !c.is_income);
  const incomeCategories = categories.filter(c => c.is_income);

  return (
    <div className="dashboard-page">
      <Sidebar onNavigate={onNavigate} activeTab="categories" user={user} />
      <div className="dashboard-main">
        <div className="dashboard-content">
          <div className="dashboard-hero">
            <div>
              <h1 className="dashboard-hero-title">Categories</h1>
              <p className="dashboard-hero-subtitle">Organize your expenses with custom categories</p>
            </div>
          </div>

          <div className="row g-4 categories-shell">
            {error && <div className="col-12"><div className="alert alert-danger">{error}</div></div>}

            {/* ── Create Category ── */}
            <div className="col-lg-4">
              <div className="categories-card">
                <h5 className="categories-card-title mb-4">Create Category</h5>

                {success && <div className="alert alert-success py-2 mb-3">{success}</div>}

                <div className="mb-3">
                  <label className="form-label categories-label">Category Name <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control categories-input"
                    placeholder="e.g., Food & Dining"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label categories-label">Type</label>
                  <div className="d-flex gap-2 mt-1">
                    <button
                      className={`btn btn-sm flex-grow-1 ${!isIncome ? "btn-brand" : "btn-outline-secondary"}`}
                      onClick={() => setIsIncome(false)}
                    >
                      Expense
                    </button>
                    <button
                      className={`btn btn-sm flex-grow-1 ${isIncome ? "btn-brand" : "btn-outline-secondary"}`}
                      onClick={() => setIsIncome(true)}
                    >
                      Income
                    </button>
                  </div>
                </div>

                <button
                  className="btn btn-brand w-100 py-2"
                  onClick={handleCreate}
                  disabled={isSubmitting || !newName.trim()}
                >
                  {isSubmitting ? "Creating..." : "Create Category"}
                </button>
              </div>
            </div>

            {/* ── Category List ── */}
            <div className="col-lg-8">
              <div className="categories-card">
                <div className="mb-4">
                  <h5 className="categories-card-title mb-1">Your Categories</h5>
                  <div className="categories-card-subtitle">{categories.length} categories</div>
                </div>

                {loading ? (
                  <div className="text-center text-secondary py-4">Loading...</div>
                ) : categories.length === 0 ? (
                  <div className="text-center text-secondary py-4">No categories found. Create one to get started!</div>
                ) : (
                  <>
                    {expenseCategories.length > 0 && (
                      <>
                        <div className="transactions-label mb-2">Expense</div>
                        {expenseCategories.map((cat, i) => (
                          <div className="cat-list-item" key={cat.id}>
                            <div className="d-flex align-items-center gap-3">
                              <div
                                className="cat-icon-wrapper"
                                style={{ backgroundColor: `${getColorFromId(cat.id)}20` }}
                              >
                                <div
                                  className="cat-icon-dot"
                                  style={{ backgroundColor: getColorFromId(cat.id) }}
                                ></div>
                              </div>
                              <div className="fw-bold">{cat.name}</div>
                            </div>
                            <button
                              className="btn p-0 text-danger opacity-75"
                              onClick={() => handleDelete(cat.id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </>
                    )}

                    {incomeCategories.length > 0 && (
                      <>
                        <div className="transactions-label mb-2 mt-4">Income</div>
                        {incomeCategories.map((cat, i) => (
                          <div className="cat-list-item" key={cat.id}>
                            <div className="d-flex align-items-center gap-3">
                              <div
                                className="cat-icon-wrapper"
                                style={{ backgroundColor: "#dcfce7" }}
                              >
                                <div className="cat-icon-dot" style={{ backgroundColor: "#22c55e" }}></div>
                              </div>
                              <div className="fw-bold">{cat.name}</div>
                            </div>
                            <button
                              className="btn p-0 text-danger opacity-75"
                              onClick={() => handleDelete(cat.id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
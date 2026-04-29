import { useState, useEffect } from "react";
import { Pencil, Lock, Trash2 } from "lucide-react";
import Sidebar from '../components/landing/Sidebar';
import { api } from "../api";

const COLORS = [
  "#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16", "#22c55e",
  "#10b981", "#06b6d4", "#0ea5e9", "#3b82f6", "#6366f1", "#8b5cf6",
  "#a855f7", "#d946ef", "#ec4899", "#f43f5e", "#fb7185", "#fda4af"
];

export default function CategoriesPage({ onNavigate }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // New Category Form State
  const [newName, setNewName] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLORS[9]); // Default to a nice blue
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch categories from your Flask backend
  const fetchCategories = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/categories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      setError("Failed to load categories.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Run the fetch when the page first loads
  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle submitting a new category
  const handleCreateCategory = async () => {
    if (!newName.trim()) return;
    
    setIsSubmitting(true);
    setError("");

    try {
      await api.post("/api/categories", {
        name: newName.trim(),
        color_code: selectedColor,
      });
      
      // Clear form and refresh the list
      setNewName("");
      fetchCategories();
    } catch (err) {
      setError("Failed to create category. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dashboard-page">
      <Sidebar onNavigate={onNavigate} activeTab="categories" user={user} />
      <div className="dashboard-main">
        <div className="dashboard-content">
          <div className="categories-hero">
            <h1 className="dashboard-hero-title">Categories</h1>
            <p className="dashboard-hero-subtitle">Organize your expenses with custom categories</p>
          </div>

          <div className="row g-4 categories-shell">
            {error && <div className="col-12"><div className="alert alert-danger">{error}</div></div>}

            <div className="col-lg-4">
              <div className="categories-card">
                <h5 className="categories-card-title mb-4">Create Category</h5>
                
                <div className="mb-3">
                  <label className="form-label categories-label">Category Name <span className="text-danger">*</span></label>
                  <input 
                    type="text" 
                    className="form-control categories-input" 
                    placeholder="e.g., Food & Dining" 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label categories-label">Color <span className="text-danger">*</span></label>
                  <div className="color-picker-grid">
                    {COLORS.map((color, index) => (
                      <div 
                        key={index} 
                        className={`color-swatch ${color === selectedColor ? "active" : ""}`} 
                        style={{ backgroundColor: color }}
                        onClick={() => setSelectedColor(color)}
                      ></div>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="cat-preview-box">
                    <span className="cat-preview-label">Preview:</span>
                    <div className="cat-preview-pill mt-2" style={{ color: selectedColor, backgroundColor: `${selectedColor}15` }}>
                      <span className="cat-preview-dot" style={{ backgroundColor: selectedColor }}></span>
                      {newName || "Category Name"}
                    </div>
                  </div>
                </div>

                <button 
                  className="btn btn-success w-100 py-2 fw-bold" 
                  style={{ backgroundColor: "#16a34a" }}
                  onClick={handleCreateCategory}
                  disabled={isSubmitting || !newName.trim()}
                >
                  {isSubmitting ? "Creating..." : "Create"}
                </button>
              </div>
            </div>

            <div className="col-lg-8">
              <div className="categories-card">
                <div className="mb-4">
                  <h5 className="categories-card-title mb-1">Your Categories</h5>
                  <div className="categories-card-subtitle">{categories.length} categories</div>
                </div>

                <div className="categories-list">
                  {loading ? (
                    <div className="text-center text-secondary py-4">Loading categories...</div>
                  ) : categories.length === 0 ? (
                    <div className="text-center text-secondary py-4">No categories found. Create one to get started!</div>
                  ) : (
                    categories.map((cat) => {
                      // Fallback in case your database uses 'color' instead of 'color_code'
                      const catColor = cat.color_code || cat.color || "#ccc";
                      
                      return (
                        <div className="cat-list-item" key={cat.id}>
                          <div className="d-flex align-items-center gap-3">
                            <div className="cat-icon-wrapper" style={{ backgroundColor: `${catColor}20` }}>
                              <div className="cat-icon-dot" style={{ backgroundColor: catColor }}></div>
                            </div>
                            <div>
                              <div className="fw-bold text-dark">{cat.name}</div>
                            </div>
                          </div>
                          
                          <div className="d-flex gap-3 text-secondary">
                            <button className="btn p-0 text-secondary hover-primary"><Pencil size={16} /></button>
                            <button className="btn p-0 text-danger opacity-75 hover-primary"><Trash2 size={16} /></button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
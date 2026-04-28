import { useState, useEffect } from "react";
import { X, Check, FileText, RefreshCcw } from "lucide-react";
import { api } from "../api";
import PlacesAutocompleteMap from "../places_autocomplete";


export default function AddTransactionPage({ onNavigate }) {
  const [categories, setCategories] = useState([]);
  const [amount, setAmount] = useState("");
  const [txnDate, setTxnDate] = useState(new Date().toISOString().split("T")[0]);
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [txnType, setTxnType] = useState("one-time");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);

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

    if (!amount || !txnDate || !categoryId) {
      setError("Amount, date, and category are required.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/api/transactions", {
        type: "expense",
        title: title,
        amount: parseFloat(amount),
        txn_date: txnDate,
        category_id: categoryId,
        description: description,
        location_name: location?.name ?? null,
        location_address: location?.address ?? null,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to save transaction.");
        return;
      }

      onNavigate("transactions");
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
          <h1 className="add-transaction-title">Add New Expense</h1>
          <p className="add-transaction-subtitle">Record a new expense</p>
        </div>
        <button className="btn add-transaction-close" onClick={() => onNavigate("transactions")}>
          <X size={18} />
        </button>
      </div>

      <div className="add-transaction-content">
        {error && <div className="alert alert-danger mb-3">{error}</div>}

        <div className="add-transaction-card">
          <h5 className="add-section-title">Basic Information</h5>

          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label transactions-label">Amount *</label>
              <input
                type="number"
                className="form-control transactions-input"
                placeholder="$ 0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label transactions-label">Date *</label>
              <input
                type="date"
                className="form-control transactions-input"
                value={txnDate}
                onChange={(e) => setTxnDate(e.target.value)}
              />
            </div>

            <div className="col-12">
              <label className="form-label transactions-label">Title *</label>
              <input
                type="text"
                className="form-control transactions-input"
                placeholder="e.g., Grocery Shopping"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

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
              <div className="add-category-link">Don&apos;t see your category? Create one</div>
            </div>

            <div className="col-12">
              <label className="form-label transactions-label">Description</label>
              <textarea
                className="form-control transactions-input add-description-box"
                placeholder="Add any additional notes..."
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <div className="col-12">
              <label className="form-label transactions-label">Location</label>
              <PlacesAutocompleteMap onLocationSelect={setLocation} />
              <input
                type="text"
                readOnly
                style={{
                  marginTop: "10px",
                  display: "block",
                  width: "100%",
                  padding: "8px 12px",
                  fontSize: "14px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  background: "#f9f9f9",
                  color: "#374151",
                  boxSizing: "border-box",
                }}
                value={location?.address ?? ""}
                placeholder="No location selected"
              />
            </div>

          </div>
        </div>

        <div className="add-transaction-card">
          <h5 className="add-section-title">Expense Type</h5>

          <div className="row g-3">
            <div className="col-md-6">
              <div
                className={`expense-type-card ${txnType === "one-time" ? "active" : ""}`}
                onClick={() => setTxnType("one-time")}
                style={{ cursor: "pointer" }}
              >
                <div className="d-flex align-items-center gap-3">
                  <div className="expense-type-icon purple">
                    <FileText size={18} />
                  </div>
                  <div>
                    <div className="fw-semibold">One-time</div>
                    <div className="expense-type-subtext">Single expense</div>
                  </div>
                </div>
                {txnType === "one-time" && <Check size={16} className="expense-check-icon" />}
              </div>
            </div>

            <div className="col-md-6">
              <div
                className={`expense-type-card ${txnType === "recurring" ? "active" : ""}`}
                onClick={() => setTxnType("recurring")}
                style={{ cursor: "pointer" }}
              >
                <div className="d-flex align-items-center gap-3">
                  <div className="expense-type-icon gray">
                    <RefreshCcw size={18} />
                  </div>
                  <div>
                    <div className="fw-semibold">Recurring</div>
                    <div className="expense-type-subtext">Repeating expense</div>
                  </div>
                </div>
                {txnType === "recurring" && <Check size={16} className="expense-check-icon" />}
              </div>
            </div>
          </div>
        </div>

        <div className="add-transaction-actions">
          <button className="btn add-cancel-btn" onClick={() => onNavigate("transactions")}>
            Cancel
          </button>
          <button
            className="btn btn-brand d-inline-flex align-items-center gap-2"
            onClick={handleSubmit}
            disabled={loading}
          >
            <Check size={16} />
            {loading ? "Saving..." : "Save Expense"}
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { X, Check } from "lucide-react";
import { api } from "../api";

export default function EditBudgetModal({ limit, onClose, onSaved }) {
  const [limitAmount, setLimitAmount] = useState(limit.limit_amount);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setError("");

    if (!limitAmount || parseFloat(limitAmount) <= 0) {
      setError("Please enter a valid budget amount.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.put(`/api/budget-limits/${limit.id}`, {
        limit_amount: parseFloat(limitAmount),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to update budget.");
        return;
      }

      onSaved();
    } catch (err) {
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold mb-0">Edit Budget — {limit.category_name}</h5>
            <button className="btn add-transaction-close" onClick={onClose}>
              <X size={18} />
            </button>
          </div>

          {error && <div className="alert alert-danger py-2 mb-3">{error}</div>}

          <div className="mb-3">
            <label className="form-label transactions-label">Budget Amount *</label>
            <input
              type="number"
              className="form-control transactions-input"
              value={limitAmount}
              onChange={(e) => setLimitAmount(e.target.value)}
              min="0"
              step="0.01"
            />
          </div>

          <div className="d-flex justify-content-between text-secondary mb-4" style={{ fontSize: "0.875rem" }}>
            <span>Currently spent: <strong>${limit.spent.toFixed(2)}</strong></span>
            <span>Remaining: <strong>${Math.max(limit.remaining, 0).toFixed(2)}</strong></span>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button className="btn add-cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn btn-brand d-inline-flex align-items-center gap-2"
              onClick={handleSave}
              disabled={loading}
            >
              <Check size={16} />
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

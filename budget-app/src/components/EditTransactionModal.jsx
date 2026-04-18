import { useState } from "react";
import { X, Check } from "lucide-react";
import { api } from "../api";

export default function EditTransactionModal({ transaction, categories, onClose, onSaved }) {
  const [amount, setAmount] = useState(transaction.amount);
  const [txnDate, setTxnDate] = useState(transaction.txn_date);
  const [title, setTitle] = useState(transaction.title || "");
  const [categoryId, setCategoryId] = useState(transaction.category_id);
  const [description, setDescription] = useState(transaction.description || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setError("");

    if (!amount || !txnDate || !categoryId) {
      setError("Amount, date, and category are required.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.put(`/api/transactions/${transaction.id}`, {
        type: title,
        amount: parseFloat(amount),
        txn_date: txnDate,
        category_id: categoryId,
        description,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to update transaction.");
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
            <h5 className="fw-bold mb-0">Edit Expense</h5>
            <button className="btn add-transaction-close" onClick={onClose}>
              <X size={18} />
            </button>
          </div>

          {error && <div className="alert alert-danger py-2 mb-3">{error}</div>}

          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label transactions-label">Amount *</label>
              <input
                type="number"
                className="form-control transactions-input"
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
              <label className="form-label transactions-label">Title</label>
              <input
                type="text"
                className="form-control transactions-input"
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
            </div>

            <div className="col-12">
              <label className="form-label transactions-label">Description</label>
              <textarea
                className="form-control transactions-input"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-4">
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

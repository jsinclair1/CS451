import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import Sidebar from "../components/landing/Sidebar";
import EditTransactionModal from "../components/EditTransactionModal";
import { api } from "../api";

export default function TransactionsPage({ onNavigate }) {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Edit modal
  const [editingTransaction, setEditingTransaction] = useState(null);

  const fetchTransactions = async (currentPage = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: currentPage, per_page: 15 });
      if (search) params.append("search", search);
      if (categoryFilter) params.append("category_id", categoryFilter);
      if (startDate) params.append("start_date", startDate);
      if (endDate) params.append("end_date", endDate);

      const res = await api.get(`/api/transactions?${params.toString()}`);
      const data = await res.json();
      setTransactions(data.transactions);
      setTotalPages(data.pages);
      setTotal(data.total);
      setPage(data.page);
    } catch (err) {
      setError("Failed to load transactions.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/api/categories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchTransactions();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;
    try {
      await api.delete(`/api/transactions/${id}`);
      fetchTransactions(page);
    } catch (err) {
      setError("Failed to delete transaction.");
    }
  };

  const handleFilter = () => {
    fetchTransactions(1);
  };

  const handleEditSaved = () => {
    setEditingTransaction(null);
    fetchTransactions(page);
  };

  const formatDate = (isoDate) => {
    const d = new Date(isoDate);
    return {
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      day: d.toLocaleDateString("en-US", { weekday: "long" }),
    };
  };

  const chipColors = [
    "chip-orange", "chip-blue", "chip-purple", "chip-pink",
    "chip-red", "chip-yellow", "chip-magenta"
  ];

  const getCategoryColor = (categoryId) => {
    const index = categories.findIndex((c) => c.id === categoryId);
    return chipColors[index % chipColors.length] || "chip-blue";
  };

  return (
    <div className="dashboard-page">
      <Sidebar onNavigate={onNavigate} activeTab="transactions" />
      <div className="dashboard-main">
        <div className="dashboard-content">
          <div className="transactions-header">
            <div>
              <h1 className="transactions-page-title">Expenses</h1>
              <p className="transactions-page-subtitle">Manage and track your expenses</p>
            </div>
            <button
              className="btn btn-brand d-inline-flex align-items-center gap-2"
              onClick={() => onNavigate("add-transaction")}
            >
              <Plus size={17} />
              Add Expense
            </button>
          </div>

          <div className="transactions-body">
            <div className="transactions-panel mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <h5 className="transactions-panel-title mb-0">Filters</h5>
                <button className="btn btn-link text-decoration-none transactions-show-link" onClick={handleFilter}>
                  Apply Filters
                </button>
              </div>

              <div className="row g-3">
                <div className="col-md-6 col-xl-3">
                  <label className="form-label transactions-label">Search</label>
                  <input
                    type="text"
                    className="form-control transactions-input"
                    placeholder="Search expenses..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <div className="col-md-6 col-xl-3">
                  <label className="form-label transactions-label">Category</label>
                  <select
                    className="form-select transactions-input"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6 col-xl-3">
                  <label className="form-label transactions-label">Start Date</label>
                  <input
                    type="date"
                    className="form-control transactions-input"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div className="col-md-6 col-xl-3">
                  <label className="form-label transactions-label">End Date</label>
                  <input
                    type="date"
                    className="form-control transactions-input"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="transactions-table-panel">
              <div className="table-responsive">
                <table className="table transactions-table align-middle mb-0">
                  <thead>
                    <tr>
                      <th>DATE</th>
                      <th>CATEGORY</th>
                      <th>TITLE</th>
                      <th>DESCRIPTION</th>
                      <th>AMOUNT</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="text-center py-4">Loading...</td>
                      </tr>
                    ) : transactions.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-4">No transactions found.</td>
                      </tr>
                    ) : (
                      transactions.map((item) => {
                        const { date, day } = formatDate(item.txn_date);
                        return (
                          <tr key={item.id}>
                            <td>
                              <div className="fw-semibold">{date}</div>
                              <div className="transactions-day-text">{day}</div>
                            </td>
                            <td>
                              <span className={`transaction-chip ${getCategoryColor(item.category_id)}`}>
                                {item.category_name}
                              </span>
                            </td>
                            <td className="fw-medium">{item.title}</td>
                            <td className="transactions-description">{item.description || "—"}</td>
                            <td className="fw-semibold">${parseFloat(item.amount).toFixed(2)}</td>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <button
                                  className="btn transaction-icon-btn"
                                  onClick={() => setEditingTransaction(item)}
                                >
                                  <Pencil size={14} />
                                </button>
                                <button
                                  className="btn transaction-icon-btn delete"
                                  onClick={() => handleDelete(item.id)}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              <div className="transactions-footer">
                <div className="transactions-results-text">
                  Showing {transactions.length} of {total} results
                </div>
                <div className="transactions-pagination">
                  <button
                    className="btn transactions-page-btn"
                    disabled={page <= 1}
                    onClick={() => fetchTransactions(page - 1)}
                  >
                    <ChevronLeft size={15} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      className={`btn transactions-page-btn ${p === page ? "active" : ""}`}
                      onClick={() => fetchTransactions(p)}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    className="btn transactions-page-btn"
                    disabled={page >= totalPages}
                    onClick={() => fetchTransactions(page + 1)}
                  >
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {editingTransaction && (
        <EditTransactionModal
          transaction={editingTransaction}
          categories={categories}
          onClose={() => setEditingTransaction(null)}
          onSaved={handleEditSaved}
        />
      )}
    </div>
  );
}

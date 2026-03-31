import {
  LayoutDashboard,
  Receipt,
  Wallet,
  Tags,
  Bell,
  FolderGit2,
  BookOpen,
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const transactions = [
  {
    date: "Oct 19, 2025",
    day: "Sunday",
    category: "Education",
    title: "Manunuzi",
    description: "Sample description",
    amount: "$200.00",
    color: "chip-orange",
  },
  {
    date: "Oct 18, 2025",
    day: "Saturday",
    category: "Utilities",
    title: "Internet Service",
    description: "Home internet connection",
    amount: "$59.99",
    color: "chip-blue",
  },
  {
    date: "Oct 18, 2025",
    day: "Saturday",
    category: "Housing",
    title: "Rent Payment",
    description: "Monthly apartment rent",
    amount: "$1,200.00",
    color: "chip-purple",
  },
  {
    date: "Oct 17, 2025",
    day: "Friday",
    category: "Food & Dining",
    title: "Fast Food",
    description: "Quick lunch",
    amount: "$23.45",
    color: "chip-red",
  },
  {
    date: "Oct 16, 2025",
    day: "Thursday",
    category: "Transportation",
    title: "Gas Station",
    description: "Fuel purchase",
    amount: "$65.00",
    color: "chip-yellow",
  },
];

const sidebarItems = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "transactions", label: "Expenses", icon: Receipt },
  { key: "budgets", label: "Budgets", icon: Wallet },
  { key: "categories", label: "Categories", icon: Tags },
  { key: "profile", label: "Profile", icon: Bell },
];

export default function TransactionsPage({ onNavigate }) {
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
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const active = item.key === "transactions";

              return (
                <button
                  key={item.key}
                  className={`btn dashboard-nav-btn ${active ? "active" : ""}`}
                  onClick={() => {
                    if (item.key === "transactions") return;
                    onNavigate(item.key);
                  }}
                >
                  <span className="d-flex align-items-center gap-2">
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="d-grid gap-2 mb-3">
            <button className="btn dashboard-bottom-link">
              <FolderGit2 size={15} />
              <span>Repository</span>
            </button>
            <button className="btn dashboard-bottom-link">
              <BookOpen size={15} />
              <span>Documentation</span>
            </button>
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
          <div className="transactions-header">
            <div>
              <h1 className="transactions-page-title">Expenses</h1>
              <p className="transactions-page-subtitle">
                Manage and track your expenses
              </p>
            </div>

            <button
              className="btn btn-brand d-inline-flex align-items-center gap-2"
              onClick={() => onNavigate("add-transaction")}
            >
              <Plus size={17} />
              Add Expense
            </button>
          </div>

          <div className="transactions-panel mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
              <h5 className="transactions-panel-title mb-0">Filters</h5>
              <button className="btn btn-link text-decoration-none transactions-show-link">
                Show Filters
              </button>
            </div>

            <div className="row g-3">
              <div className="col-md-6 col-xl-3">
                <label className="form-label transactions-label">Search</label>
                <input
                  type="text"
                  className="form-control transactions-input"
                  placeholder="Search expenses..."
                />
              </div>

              <div className="col-md-6 col-xl-3">
                <label className="form-label transactions-label">Category</label>
                <select className="form-select transactions-input">
                  <option>All Categories</option>
                  <option>Housing</option>
                  <option>Utilities</option>
                  <option>Food & Dining</option>
                  <option>Transportation</option>
                  <option>Shopping</option>
                </select>
              </div>

              <div className="col-md-6 col-xl-3">
                <label className="form-label transactions-label">Start Date</label>
                <input
                  type="text"
                  className="form-control transactions-input"
                  value="01/10/2025"
                  readOnly
                />
              </div>

              <div className="col-md-6 col-xl-3">
                <label className="form-label transactions-label">End Date</label>
                <input
                  type="text"
                  className="form-control transactions-input"
                  value="31/10/2025"
                  readOnly
                />
              </div>
            </div>
          </div>

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
                  {transactions.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <div className="fw-semibold">{item.date}</div>
                        <div className="transactions-day-text">{item.day}</div>
                      </td>

                      <td>
                        <span className={`transaction-chip ${item.color}`}>
                          {item.category}
                        </span>
                      </td>

                      <td className="fw-medium">{item.title}</td>
                      <td className="transactions-description">
                        {item.description}
                      </td>
                      <td className="fw-semibold">{item.amount}</td>

                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <button className="btn transaction-icon-btn">
                            <Pencil size={14} />
                          </button>
                          <button className="btn transaction-icon-btn delete">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="transactions-footer">
              <div className="transactions-results-text">
                Showing 1 to 5 of 22 results
              </div>

              <div className="transactions-pagination">
                <button className="btn transactions-page-btn">
                  <ChevronLeft size={15} />
                </button>
                <button className="btn transactions-page-btn active">1</button>
                <button className="btn transactions-page-btn">2</button>
                <button className="btn transactions-page-btn">
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
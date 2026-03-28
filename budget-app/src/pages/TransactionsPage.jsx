import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

const transactions = [
  {
    date: "Oct 19, 2025",
    day: "Sunday",
    category: "Education",
    title: "manunuzi",
    description: "sample description",
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
    date: "Oct 18, 2025",
    day: "Saturday",
    category: "Utilities",
    title: "Spotify Premium",
    description: "Music streaming service",
    amount: "$9.99",
    color: "chip-blue",
  },
  {
    date: "Oct 18, 2025",
    day: "Saturday",
    category: "Utilities",
    title: "Netflix Subscription",
    description: "Monthly streaming subscription",
    amount: "$15.99",
    color: "chip-blue",
  },
  {
    date: "Oct 18, 2025",
    day: "Saturday",
    category: "Education",
    title: "shop",
    description: "—",
    amount: "$600.00",
    color: "chip-orange",
  },
  {
    date: "Oct 17, 2025",
    day: "Friday",
    category: "Personal Care",
    title: "Gym Membership",
    description: "Monthly gym fee",
    amount: "$45.00",
    color: "chip-pink",
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
    title: "Parking Fee",
    description: "Downtown parking",
    amount: "$15.00",
    color: "chip-yellow",
  },
  {
    date: "Oct 16, 2025",
    day: "Thursday",
    category: "Food & Dining",
    title: "Coffee Shop",
    description: "Morning coffee and pastry",
    amount: "$12.50",
    color: "chip-red",
  },
  {
    date: "Oct 15, 2025",
    day: "Wednesday",
    category: "Food & Dining",
    title: "Restaurant Dinner",
    description: "Dinner at Italian restaurant",
    amount: "$78.50",
    color: "chip-red",
  },
  {
    date: "Oct 14, 2025",
    day: "Tuesday",
    category: "Transportation",
    title: "Uber Ride",
    description: "Ride to downtown",
    amount: "$18.75",
    color: "chip-yellow",
  },
  {
    date: "Oct 13, 2025",
    day: "Monday",
    category: "Shopping",
    title: "Online Shopping",
    description: "Amazon purchases",
    amount: "$89.99",
    color: "chip-magenta",
  },
  {
    date: "Oct 13, 2025",
    day: "Monday",
    category: "Food & Dining",
    title: "Grocery Shopping",
    description: "Weekly groceries from Whole Foods",
    amount: "$145.67",
    color: "chip-red",
  },
  {
    date: "Oct 12, 2025",
    day: "Sunday",
    category: "Transportation",
    title: "Gas Station",
    description: "Full tank of gas",
    amount: "$65.00",
    color: "chip-yellow",
  },
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
            <button className="btn dashboard-nav-btn" onClick={() => onNavigate("dashboard")}>
              Dashboard
            </button>
            <button className="btn dashboard-nav-btn active">Expenses</button>
            <button className="btn dashboard-nav-btn" onClick={() => onNavigate("budgets")}>
              Budgets
            </button>
            <button className="btn dashboard-nav-btn" onClick={() => onNavigate("categories")}>
              Categories
            </button>
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
                  <input type="text" className="form-control transactions-input" value="01/10/2025" readOnly />
                </div>

                <div className="col-md-6 col-xl-3">
                  <label className="form-label transactions-label">End Date</label>
                  <input type="text" className="form-control transactions-input" value="31/10/2025" readOnly />
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
                          <span className={`transaction-chip ${item.color}`}>{item.category}</span>
                        </td>

                        <td className="fw-medium">{item.title}</td>
                        <td className="transactions-description">{item.description}</td>
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
                <div className="transactions-results-text">Showing 1 to 15 of 22 results</div>

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
    </div>
  );
}
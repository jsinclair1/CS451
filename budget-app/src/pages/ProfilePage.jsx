import {
  LayoutDashboard,
  Receipt,
  Wallet,
  Tags,
  Bell,
  FolderGit2,
  BookOpen,
  User,
  Mail,
  Lock,
  ShieldCheck,
} from "lucide-react";

const sidebarItems = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "transactions", label: "Expenses", icon: Receipt },
  { key: "budgets", label: "Budgets", icon: Wallet },
  { key: "categories", label: "Categories", icon: Tags },
  { key: "profile", label: "Profile", icon: Bell },
];

export default function ProfilePage({ onNavigate }) {
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
              const active = item.key === "profile";

              return (
                <button
                  key={item.key}
                  className={`btn dashboard-nav-btn ${active ? "active" : ""}`}
                  onClick={() => {
                    if (item.key === "profile") return;
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
              <h1 className="transactions-page-title">Profile & Settings</h1>
              <p className="transactions-page-subtitle">
                Manage your account information and preferences.
              </p>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-lg-6">
              <div className="dashboard-panel h-100">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <User size={18} />
                  <h5 className="dashboard-panel-title mb-0">
                    Personal Information
                  </h5>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Full Name</label>
                  <input
                    type="text"
                    className="form-control auth-input"
                    value="Demo User"
                    readOnly
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Email Address</label>
                  <div className="auth-input-wrap">
                    <Mail size={18} className="auth-input-icon" />
                    <input
                      type="email"
                      className="form-control auth-input"
                      value="demo@expenseapp.com"
                      readOnly
                    />
                  </div>
                </div>

                <button className="btn btn-brand mt-2">Update Profile</button>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="dashboard-panel h-100">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <ShieldCheck size={18} />
                  <h5 className="dashboard-panel-title mb-0">
                    Security Settings
                  </h5>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Current Password
                  </label>
                  <div className="auth-input-wrap">
                    <Lock size={18} className="auth-input-icon" />
                    <input
                      type="password"
                      className="form-control auth-input"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">New Password</label>
                  <div className="auth-input-wrap">
                    <Lock size={18} className="auth-input-icon" />
                    <input
                      type="password"
                      className="form-control auth-input"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button className="btn btn-brand mt-2">Change Password</button>
              </div>
            </div>
          </div>

          <div className="row g-4 mt-1">
            <div className="col-lg-12">
              <div className="dashboard-panel">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <Bell size={18} />
                  <h5 className="dashboard-panel-title mb-0">Preferences</h5>
                </div>

                <div className="d-flex flex-column gap-3">
                  <div className="profile-preference-row">
                    <div>
                      <div className="fw-semibold">Email Notifications</div>
                      <div className="small text-secondary">
                        Receive alerts for suspicious transactions and budget
                        limits.
                      </div>
                    </div>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      defaultChecked
                    />
                  </div>

                  <div className="profile-preference-row">
                    <div>
                      <div className="fw-semibold">
                        Multi-Factor Authentication
                      </div>
                      <div className="small text-secondary">
                        Add an extra layer of login security with verification
                        codes.
                      </div>
                    </div>
                    <input className="form-check-input" type="checkbox" />
                  </div>

                  <div className="profile-preference-row">
                    <div>
                      <div className="fw-semibold">Monthly Summary Emails</div>
                      <div className="small text-secondary">
                        Get a monthly report of your spending and savings
                        progress.
                      </div>
                    </div>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      defaultChecked
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <button className="btn btn-outline-danger">Log Out</button>
          </div>
        </div>
      </div>
    </div>
  );
}
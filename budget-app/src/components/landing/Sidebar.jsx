import React from 'react';
import { LayoutDashboard, Receipt, Wallet, Tags } from "lucide-react";

const sidebarItems = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "transactions", label: "Expenses", icon: Receipt },
  { key: "budgets", label: "Budgets", icon: Wallet },
  { key: "categories", label: "Categories", icon: Tags },
];

export default function Sidebar({ onNavigate, activeTab }) {
  return (
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
            const active = item.key === activeTab;
            return (
              <button
                key={item.key}
                className={`btn dashboard-nav-btn ${active ? "active" : ""}`}
                onClick={() => {
                  if (onNavigate) onNavigate(item.key);
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

      {/* ONLY the Demo User box remains here at the bottom */}
      <div>
        <div className="dashboard-user-box">
          <div className="dashboard-user-avatar">DU</div>
          <div>
            <div className="dashboard-user-name">Demo User</div>
          </div>
        </div>
      </div>
    </div>
  );
}
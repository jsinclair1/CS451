import React, { useState } from 'react';
import { LayoutDashboard, Receipt, Wallet, Tags, LogOut, Menu, X, Settings } from "lucide-react";
import FloatingChat from '../FloatingChat'; // <-- Add this import

const sidebarItems = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "categories", label: "Categories", icon: Tags },
  { key: "budgets", label: "Budgets", icon: Wallet },
  { key: "transactions", label: "Expenses", icon: Receipt },
];

export default function Sidebar({ onNavigate, activeTab, user }) {
  // 2. Add state to hide the sidebar by default
  const [isOpen, setIsOpen] = useState(false);

  const displayName = user?.display_name || user?.name || "Demo User";
  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <>
      {/* 3. The Floating Hamburger Menu Button */}
      <button
        className="sidebar-toggle-btn"
        onClick={() => setIsOpen(true)}
        style={{ display: isOpen ? 'none' : 'grid' }}
      >
        <Menu size={20} />
      </button>

      {/* 4. Dark backdrop overlay (click to close) */}
      {isOpen && (
        <div className="sidebar-backdrop" onClick={() => setIsOpen(false)}></div>
      )}

      {/* 5. The Sidebar itself (adds the 'open' class dynamically) */}
      <div className={`dashboard-sidebar ${isOpen ? "open" : ""}`}>
        <div>
          {/* Header Row with Brand and Close Button */}
          <div className="d-flex justify-content-between align-items-center px-1 mb-3">
            <div className="d-flex align-items-center gap-2 dashboard-brand" style={{ padding: '0.4rem 0' }}>
              <div className="dashboard-brand-badge">💳</div>
              <span>GeoBudget</span>
            </div>
            <button
              className="btn p-1 d-flex text-secondary"
              onClick={() => setIsOpen(false)}
              style={{ border: 'none', background: 'transparent' }}
            >
              <X size={20} />
            </button>
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
                    setIsOpen(false); // Auto-close when a link is clicked
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
          <div className="d-grid gap-2 mb-2">
            {/* 1. Logout Button */}
            <button 
              className="btn dashboard-nav-btn logout-btn" 
              onClick={() => onNavigate("logout")}
              style={{ color: '#ff4d4d' }} 
            >
              <span className="d-flex align-items-center gap-2">
                <LogOut size={16} />
                <span>Logout</span>
              </span>
            </button>

            {/* 2. Settings Button (Sits between Logout and Profile) */}
            <button 
              className={`btn dashboard-nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => {
                if (onNavigate) onNavigate("settings");
                setIsOpen(false);
              }}
            >
              <span className="d-flex align-items-center gap-2">
                <Settings size={16} />
                <span>Settings</span>
              </span>
            </button>
          </div>
          
          {/* 3. Profile Avatar Box (Now Clickable) */}
          <div 
            className="dashboard-user-box"
            onClick={() => {
              if (onNavigate) onNavigate("profile");
              setIsOpen(false);
            }}
            style={{ 
              cursor: 'pointer',
              padding: '0.6rem 0.45rem',
              borderRadius: '0.65rem',
              transition: 'background 0.2s',
              background: activeTab === 'profile' ? 'rgba(255, 255, 255, 0.07)' : 'transparent'
            }}
            onMouseOver={(e) => {
              if (activeTab !== 'profile') e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
            }}
            onMouseOut={(e) => {
              if (activeTab !== 'profile') e.currentTarget.style.background = 'transparent';
            }}
          >
            <div className="dashboard-user-avatar">{initials}</div>
            <div>
              <div className="dashboard-user-name">{displayName}</div>
              <div style={{ fontSize: '0.75rem', color: '#7d8392', marginTop: '2px' }}>View Profile</div>
            </div>
          </div>
        </div>
      </div>

      <FloatingChat /> 
    </>
  );
}
import React from 'react';
import Sidebar from '../components/landing/Sidebar';
import { Bell, Lock, Globe, Moon } from 'lucide-react';

export default function SettingsPage({ onNavigate }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="dashboard-page">
      <Sidebar onNavigate={onNavigate} activeTab="settings" user={user} />
      <div className="dashboard-main">
        <div className="dashboard-content">
          <div className="dashboard-hero" style={{ background: 'linear-gradient(90deg, #3b82f6 0%, #2dd4bf 100%)' }}>
            <h1 className="dashboard-hero-title">Settings</h1>
            <p className="dashboard-hero-subtitle">Customize your app preferences</p>
          </div>

          <div className="row g-4 m-0 p-4">
            <div className="col-12">
              <div className="dashboard-panel">
                <h5 className="dashboard-panel-title mb-4">Preferences</h5>

                <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                  <div className="d-flex align-items-center gap-3">
                    <div className="p-2 bg-light rounded"><Bell size={20} className="text-primary" /></div>
                    <div>
                      <div className="fw-bold">Push Notifications</div>
                      <div className="small text-secondary">Receive alerts when exceeding budgets</div>
                    </div>
                  </div>
                  <div className="form-check form-switch fs-4">
                    <input className="form-check-input cursor-pointer" type="checkbox" defaultChecked />
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                  <div className="d-flex align-items-center gap-3">
                    <div className="p-2 bg-light rounded"><Moon size={20} className="text-primary" /></div>
                    <div>
                      <div className="fw-bold">Dark Mode</div>
                      <div className="small text-secondary">Toggle dark app appearance</div>
                    </div>
                  </div>
                  <div className="form-check form-switch fs-4">
                    <input className="form-check-input cursor-pointer" type="checkbox" />
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                  <div className="d-flex align-items-center gap-3">
                    <div className="p-2 bg-light rounded"><Globe size={20} className="text-primary" /></div>
                    <div>
                      <div className="fw-bold">Currency</div>
                      <div className="small text-secondary">Set your default display currency</div>
                    </div>
                  </div>
                  <select className="form-select w-auto cursor-pointer">
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-3">
                    <div className="p-2 bg-light rounded"><Lock size={20} className="text-primary" /></div>
                    <div>
                      <div className="fw-bold">Change Password</div>
                      <div className="small text-secondary">Update your account security</div>
                    </div>
                  </div>
                  <button className="btn btn-outline-secondary btn-sm">Update</button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/landing/Sidebar';
import { Bell, Lock, Globe, Moon } from 'lucide-react';

export default function SettingsPage({ onNavigate }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // --- Dark Mode State & Logic ---
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-bs-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-bs-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // --- Password Form State & Logic ---
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setPasswordMsg({ type: 'danger', text: 'New passwords do not match!' });
      return;
    }
    
    // Simulate API Call to backend
    setPasswordMsg({ type: 'success', text: 'Password successfully updated!' });
    setTimeout(() => {
      setShowPasswordForm(false);
      setPasswords({ current: '', new: '', confirm: '' });
      setPasswordMsg({ type: '', text: '' });
    }, 2000);
  };

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

                {/* Dark Mode Toggle */}
                <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                  <div className="d-flex align-items-center gap-3">
                    <div className="p-2 bg-light rounded"><Moon size={20} className="text-primary" /></div>
                    <div>
                      <div className="fw-bold">Dark Mode</div>
                      <div className="small text-secondary">Toggle dark app appearance</div>
                    </div>
                  </div>
                  <div className="form-check form-switch fs-4">
                    <input 
                      className="form-check-input cursor-pointer" 
                      type="checkbox" 
                      checked={isDarkMode}
                      onChange={(e) => setIsDarkMode(e.target.checked)}
                    />
                  </div>
                </div>

                {/* Change Password Section */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex align-items-center gap-3">
                    <div className="p-2 bg-light rounded"><Lock size={20} className="text-primary" /></div>
                    <div>
                      <div className="fw-bold">Change Password</div>
                      <div className="small text-secondary">Update your account security</div>
                    </div>
                  </div>
                  <button 
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setShowPasswordForm(!showPasswordForm)}
                  >
                    {showPasswordForm ? 'Cancel' : 'Update'}
                  </button>
                </div>

                {/* Expanding Password Form */}
                {showPasswordForm && (
                  <div className="mt-3 p-4 bg-light rounded border">
                    {passwordMsg.text && (
                      <div className={`alert alert-${passwordMsg.type} py-2`}>
                        {passwordMsg.text}
                      </div>
                    )}
                    <form onSubmit={handlePasswordSubmit}>
                      <div className="mb-3">
                        <label className="form-label small fw-bold">Current Password</label>
                        <input 
                          type="password" 
                          className="form-control" 
                          required
                          value={passwords.current}
                          onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                        />
                      </div>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label small fw-bold">New Password</label>
                          <input 
                            type="password" 
                            className="form-control" 
                            required
                            value={passwords.new}
                            onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label small fw-bold">Confirm New Password</label>
                          <input 
                            type="password" 
                            className="form-control" 
                            required
                            value={passwords.confirm}
                            onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="text-end">
                        <button type="submit" className="btn btn-primary">Save New Password</button>
                      </div>
                    </form>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
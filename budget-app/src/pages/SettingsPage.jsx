import { useState, useEffect } from 'react';
import Sidebar from '../components/landing/Sidebar';
import { Lock, Moon, Check, X } from 'lucide-react';
import { api } from '../api';

export default function SettingsPage({ onNavigate }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // ── Dark Mode ──────────────────────────────────────────────────────────────
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

  // ── Change Password ────────────────────────────────────────────────────────
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPwError("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPwError("New passwords do not match.");
      return;
    }

    setPwLoading(true);
    try {
      const res = await api.put("/api/user/password", {
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.requirements) {
          setPwError(`Password must contain: ${data.requirements.join(", ")}`);
        } else {
          setPwError(data.error || "Failed to change password.");
        }
        return;
      }

      setPwSuccess("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setShowPasswordForm(false);
        setPwSuccess("");
      }, 2000);
    } catch (err) {
      setPwError("Unable to connect to the server.");
    } finally {
      setPwLoading(false);
    }
  };

  const handleCancel = () => {
    setShowPasswordForm(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPwError("");
    setPwSuccess("");
  };

  return (
    <div className="dashboard-page">
      <Sidebar onNavigate={onNavigate} activeTab="settings" user={user} />
      <div className="dashboard-main">
        <div className="dashboard-content">
          <div className="dashboard-hero">
            <div>
              <h1 className="dashboard-hero-title">Settings</h1>
              <p className="dashboard-hero-subtitle">Customize your app preferences</p>
            </div>
          </div>

          <div className="row g-4 m-0 p-4">
            <div className="col-12">
              <div className="dashboard-panel">
                <h5 className="dashboard-panel-title mb-4">Preferences</h5>

                {/* ── Dark Mode Toggle ── */}
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
                      className="form-check-input"
                      type="checkbox"
                      checked={isDarkMode}
                      onChange={(e) => setIsDarkMode(e.target.checked)}
                    />
                  </div>
                </div>

                {/* ── Change Password ── */}
                <div>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-3">
                      <div className="p-2 bg-light rounded"><Lock size={20} className="text-primary" /></div>
                      <div>
                        <div className="fw-bold">Change Password</div>
                        <div className="small text-secondary">Update your account security</div>
                      </div>
                    </div>
                    {!showPasswordForm && (
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => setShowPasswordForm(true)}
                      >
                        Update
                      </button>
                    )}
                  </div>

                  {showPasswordForm && (
                    <div className="mt-4 pt-3 border-top">
                      {pwError && <div className="alert alert-danger py-2 mb-3">{pwError}</div>}
                      {pwSuccess && <div className="alert alert-success py-2 mb-3">{pwSuccess}</div>}

                      <form onSubmit={handleChangePassword}>
                        <div className="mb-3">
                          <label className="form-label transactions-label">Current Password</label>
                          <input
                            type="password"
                            className="form-control transactions-input"
                            placeholder="••••••••"
                            required
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                          />
                        </div>
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label className="form-label transactions-label">New Password</label>
                            <input
                              type="password"
                              className="form-control transactions-input"
                              placeholder="••••••••"
                              required
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                            />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label transactions-label">Confirm New Password</label>
                            <input
                              type="password"
                              className="form-control transactions-input"
                              placeholder="••••••••"
                              required
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="d-flex justify-content-end gap-2">
                          <button
                            type="button"
                            className="btn btn-outline-secondary d-inline-flex align-items-center gap-2"
                            onClick={handleCancel}
                          >
                            <X size={15} />
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="btn btn-brand d-inline-flex align-items-center gap-2"
                            disabled={pwLoading}
                          >
                            <Check size={15} />
                            {pwLoading ? "Saving..." : "Save Password"}
                          </button>
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
    </div>
  );
}

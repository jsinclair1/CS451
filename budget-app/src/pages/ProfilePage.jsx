import { useState, useEffect } from "react";
import { User, Mail, Calendar, Check } from "lucide-react";
import Sidebar from "../components/landing/Sidebar";
import { api } from "../api";

export default function ProfilePage({ onNavigate }) {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "{}"));
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/api/user");
        const data = await res.json();
        setUser(data);
        setDisplayName(data.display_name || "");
      } catch (err) {
        console.error("Failed to load user");
        setDisplayName(user.display_name || "");
      }
    };
    fetchUser();
  }, []);

  const handleSave = async () => {
    setError("");
    setSuccess("");

    if (!displayName.trim()) {
      setError("Display name cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.put("/api/user", { display_name: displayName });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to update profile.");
        return;
      }

      const updated = { ...user, display_name: data.display_name };
      localStorage.setItem("user", JSON.stringify(updated));
      setUser(updated);
      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (isoDate) => {
    if (!isoDate) return "—";
    return new Date(isoDate).toLocaleDateString("en-US", {
      month: "long", day: "numeric", year: "numeric"
    });
  };

  const displayNameValue = user?.display_name || user?.name || "User";
  const initials = displayNameValue
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="dashboard-page">
      <Sidebar onNavigate={onNavigate} activeTab="profile" user={user} />
      <div className="dashboard-main">
        <div className="dashboard-content">
          <div className="dashboard-hero">
            <div>
              <h1 className="dashboard-hero-title">Profile</h1>
              <p className="dashboard-hero-subtitle">Manage your personal information</p>
            </div>
          </div>

          <div className="row g-4">
            {/* ── Left: Avatar + Account Info ── */}
            <div className="col-lg-4">
              <div className="dashboard-panel text-center py-5">
                <div
                  className="mx-auto mb-3 d-flex align-items-center justify-content-center text-white fw-bold"
                  style={{
                    width: "90px", height: "90px", borderRadius: "50%",
                    fontSize: "2rem",
                    background: "linear-gradient(135deg, #a855f7, #6d28ff)"
                  }}
                >
                  {initials}
                </div>
                <h4 className="fw-bold mb-1">{displayNameValue}</h4>
                <p className="text-secondary mb-4" style={{ fontSize: "0.9rem" }}>{user?.email || ""}</p>

                <div className="text-start px-3 d-flex flex-column gap-3 mt-2">
                  <div className="d-flex align-items-center gap-3">
                    <div className="dashboard-summary-icon summary-icon-purple">
                      <User size={14} />
                    </div>
                    <div>
                      <div className="transactions-label">Display Name</div>
                      <div className="fw-semibold" style={{ fontSize: "0.95rem" }}>{displayNameValue}</div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-3">
                    <div className="dashboard-summary-icon summary-icon-blue">
                      <Mail size={14} />
                    </div>
                    <div>
                      <div className="transactions-label">Email</div>
                      <div className="fw-semibold" style={{ fontSize: "0.95rem" }}>{user?.email || "—"}</div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-3">
                    <div className="dashboard-summary-icon summary-icon-green">
                      <Calendar size={14} />
                    </div>
                    <div>
                      <div className="transactions-label">Member Since</div>
                      <div className="fw-semibold" style={{ fontSize: "0.95rem" }}>{formatDate(user?.created_at)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right: Edit Display Name ── */}
            <div className="col-lg-8">
              <div className="dashboard-panel">
                <h5 className="dashboard-panel-title mb-4">Edit Display Name</h5>

                {error && <div className="alert alert-danger py-2 mb-3">{error}</div>}
                {success && <div className="alert alert-success py-2 mb-3">{success}</div>}

                <div className="mb-3">
                  <label className="form-label transactions-label">Display Name</label>
                  <input
                    type="text"
                    className="form-control transactions-input"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your display name"
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label transactions-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control transactions-input"
                    value={user?.email || ""}
                    disabled
                    style={{ background: "#f9fafb", color: "#9ca3af" }}
                  />
                  <div className="mt-1" style={{ fontSize: "0.82rem", color: "#9ca3af" }}>
                    Email address cannot be changed.
                  </div>
                </div>

                <div className="d-flex justify-content-end">
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
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import Sidebar from '../components/landing/Sidebar';
import { User, Mail, Briefcase, GraduationCap } from 'lucide-react';

export default function ProfilePage({ onNavigate }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const displayName = user?.display_name || user?.name || "First Last";
  const initials = displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className="dashboard-page">
      <Sidebar onNavigate={onNavigate} activeTab="profile" user={user} />
      <div className="dashboard-main">
        <div className="dashboard-content">
          <div className="dashboard-hero">
            <h1 className="dashboard-hero-title">Profile</h1>
            <p className="dashboard-hero-subtitle">Manage your personal information</p>
          </div>

          <div className="row g-4 m-0 p-4">
            <div className="col-lg-4">
              <div className="dashboard-panel text-center py-5">
                <div 
                  className="mx-auto mb-3 d-flex align-items-center justify-content-center text-white fw-bold" 
                  style={{ width: '90px', height: '90px', borderRadius: '50%', fontSize: '2rem', background: 'linear-gradient(135deg, #a855f7, #6d28ff)' }}
                >
                  {initials}
                </div>
                <h4 className="fw-bold mb-1">{displayName}</h4>
                <button className="btn btn-outline-primary rounded-pill px-4">Edit Profile</button>
              </div>
            </div>

            <div className="col-lg-8">
              <div className="dashboard-panel">
                <h5 className="dashboard-panel-title mb-4">Personal Details</h5>
                
                <div className="d-flex align-items-center gap-3 mb-4 border-bottom pb-3">
                  <User className="text-secondary" size={20} />
                  <div>
                    <div className="small text-secondary">Full Name</div>
                    <div className="fw-medium">{displayName}</div>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3 mb-4 border-bottom pb-3">
                  <Mail className="text-secondary" size={20} />
                  <div>
                    <div className="small text-secondary">Email Address</div>
                    <div className="fw-medium">{user?.email || "user@example.com"}</div>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3 mb-4 border-bottom pb-3">
                  <GraduationCap className="text-secondary" size={20} />
                  <div>
                    <div className="small text-secondary">Education</div>
                    <div className="fw-medium">University of Missouri-Kansas City (UMKC)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
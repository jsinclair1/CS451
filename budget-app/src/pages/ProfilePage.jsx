export default function ProfilePage({ onNavigate }) {
  return (
    <div className="placeholder-page">
      <div className="placeholder-card">
        <h1 className="fw-bold mb-3">Profile Page</h1>
        <p className="text-secondary mb-4">Your profile/settings page will go here.</p>
        <button className="btn btn-brand" onClick={() => onNavigate("landing")}>Back to Landing</button>
      </div>
    </div>
  );
}
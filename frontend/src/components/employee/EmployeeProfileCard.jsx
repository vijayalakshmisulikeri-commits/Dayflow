export default function EmployeeProfileCard({ profile }) {
  if (!profile) return null;

  return (
    <div className="card">
      <h3>Profile</h3>
      <div className="stat-row"><span>Name</span><span>{profile.name}</span></div>
      <div className="stat-row"><span>Email</span><span>{profile.email}</span></div>
      <div className="stat-row"><span>Role</span><span>{profile.role}</span></div>
      {profile.phone && (
        <div className="stat-row"><span>Phone</span><span>{profile.phone}</span></div>
      )}
      {profile.address && (
        <div className="stat-row"><span>Address</span><span>{profile.address}</span></div>
      )}
    </div>
  );
}

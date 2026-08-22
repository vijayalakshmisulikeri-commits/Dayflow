export default function EmployeeAttendanceCard({ attendanceSummary }) {
  if (!attendanceSummary) return null;

  return (
    <div className="card">
      <h3>This Month's Attendance</h3>
      <div className="stat-row">
        <span>Present</span>
        <span className="badge badge-present">{attendanceSummary.present}</span>
      </div>
      <div className="stat-row">
        <span>Half-day</span>
        <span className="badge badge-half-day">{attendanceSummary.halfDay}</span>
      </div>
      <div className="stat-row">
        <span>Absent</span>
        <span className="badge badge-absent">{attendanceSummary.absent}</span>
      </div>
      <div className="stat-row">
        <span>On Leave</span>
        <span className="badge badge-leave">{attendanceSummary.onLeave}</span>
      </div>
    </div>
  );
}

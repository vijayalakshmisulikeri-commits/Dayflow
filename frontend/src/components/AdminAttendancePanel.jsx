export default function AdminAttendancePanel({ attendanceOverview }) {
  if (!attendanceOverview) return null;

  return (
    <div className="card">
      <h3>Today's Attendance</h3>
      <div className="stat-row"><span>Total Employees</span><span>{attendanceOverview.totalEmployees}</span></div>
      <div className="stat-row">
        <span>Present</span>
        <span className="badge badge-present">{attendanceOverview.present}</span>
      </div>
      <div className="stat-row">
        <span>Half-day</span>
        <span className="badge badge-half-day">{attendanceOverview.halfDay}</span>
      </div>
      <div className="stat-row">
        <span>Absent</span>
        <span className="badge badge-absent">{attendanceOverview.absent}</span>
      </div>
      <div className="stat-row">
        <span>On Leave</span>
        <span className="badge badge-leave">{attendanceOverview.onLeave}</span>
      </div>
      <div className="stat-row"><span>Not Marked Yet</span><span>{attendanceOverview.notMarked}</span></div>
    </div>
  );
}

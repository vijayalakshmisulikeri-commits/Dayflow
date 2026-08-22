import { useEffect, useState, useCallback } from "react";
import { fetchEmployeeDashboard } from "../../api/dashboardApi";
import EmployeeProfileCard from "./EmployeeProfileCard";
import EmployeeAttendanceCard from "./EmployeeAttendanceCard";
import EmployeeLeaveCard from "./EmployeeLeaveCard";
import EmployeePayrollCard from "./EmployeePayrollCard";
import "../../styles/dashboard.css";

// employeeId is the logged-in user's own Mongo _id — get it from
// wherever your login flow stores it (e.g. localStorage.getItem("dayflow_id"))
export default function EmployeeDashboardPage({ employeeId }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(() => {
    setLoading(true);
    fetchEmployeeDashboard(employeeId)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [employeeId]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  if (loading) return <div className="dashboard-page"><p className="loading-text">Loading dashboard...</p></div>;
  if (error) return <div className="dashboard-page"><p className="error-text">{error}</p></div>;
  if (!data) return null;

  return (
    <div className="dashboard-page">
      <h2>My Dashboard</h2>
      <div className="dashboard-grid">
        <EmployeeProfileCard profile={data.profile} />
        <EmployeeAttendanceCard attendanceSummary={data.attendanceSummary} />
        <EmployeeLeaveCard recentLeaves={data.recentLeaves} onLeaveApplied={loadDashboard} />
        <EmployeePayrollCard />
      </div>
    </div>
  );
}

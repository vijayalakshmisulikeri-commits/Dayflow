import { useEffect, useState } from "react";
import { fetchMyPayroll } from "../../api/payrollApi";

export default function EmployeePayrollCard() {
  const [payroll, setPayroll] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyPayroll()
      .then(setPayroll)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="card"><h3>Payroll</h3><p className="loading-text">Loading...</p></div>;
  if (error) return <div className="card"><h3>Payroll</h3><p className="error-text">{error}</p></div>;
  if (!payroll) return null;

  const { salaryStructure, monthlyBreakdown } = payroll;

  return (
    <div className="card">
      <h3>Payroll (Read-only)</h3>
      <div className="stat-row"><span>Fixed Net Salary</span><span>₹{salaryStructure.netSalary}</span></div>
      <div className="stat-row"><span>Working Days</span><span>{monthlyBreakdown.workingDays}</span></div>
      <div className="stat-row"><span>Present Days</span><span>{monthlyBreakdown.presentDays}</span></div>
      <div className="stat-row"><span>Paid Leave Days</span><span>{monthlyBreakdown.paidLeaveDays}</span></div>
      <div className="stat-row"><span>Unpaid Absences</span><span>{monthlyBreakdown.absentDays}</span></div>
      <div className="stat-row">
        <strong>This Month's Payable</strong>
        <strong>₹{monthlyBreakdown.netPayable}</strong>
      </div>
    </div>
  );
}

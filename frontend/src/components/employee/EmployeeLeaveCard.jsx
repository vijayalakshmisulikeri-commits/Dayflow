import { useState } from "react";
import { applyForLeave } from "../../api/leaveApi";

export default function EmployeeLeaveCard({ recentLeaves, onLeaveApplied }) {
  const [showForm, setShowForm] = useState(false);
  const [leaveType, setLeaveType] = useState("paid");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await applyForLeave({ leaveType, startDate, endDate, remarks });
      setShowForm(false);
      setStartDate("");
      setEndDate("");
      setRemarks("");
      if (onLeaveApplied) onLeaveApplied();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="card">
      <h3>Leave Requests</h3>

      {(recentLeaves || []).length === 0 && (
        <p className="loading-text">No leave requests yet.</p>
      )}

      {(recentLeaves || []).map((leave) => (
        <div className="stat-row" key={leave._id}>
          <span>
            {leave.leaveType} · {new Date(leave.startDate).toLocaleDateString()} –{" "}
            {new Date(leave.endDate).toLocaleDateString()}
          </span>
          <span className={`badge badge-${leave.status}`}>{leave.status}</span>
        </div>
      ))}

      {!showForm && (
        <button className="btn btn-save" onClick={() => setShowForm(true)}>
          Apply for Leave
        </button>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginTop: 12 }}>
          <label>
            Type
            <select
              className="input-field"
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
            >
              <option value="paid">Paid</option>
              <option value="sick">Sick</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </label>
          <label>
            Start date
            <input
              className="input-field"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </label>
          <label>
            End date
            <input
              className="input-field"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </label>
          <label>
            Remarks
            <input
              className="input-field"
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </label>
          {error && <p className="error-text">{error}</p>}
          <button className="btn btn-save" type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      )}
    </div>
  );
}

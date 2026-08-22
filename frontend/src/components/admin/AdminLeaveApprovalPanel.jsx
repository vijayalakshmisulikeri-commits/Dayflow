import { useState } from "react";
import { reviewLeave } from "../../api/leaveApi";

export default function AdminLeaveApprovalPanel({ pendingLeaveRequests, onReviewed }) {
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState(null);

  async function handleReview(leaveId, decision) {
    setProcessingId(leaveId);
    setError(null);
    try {
      await reviewLeave(leaveId, decision, "");
      if (onReviewed) onReviewed();
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <div className="card">
      <h3>Pending Leave Approvals ({(pendingLeaveRequests || []).length})</h3>
      {error && <p className="error-text">{error}</p>}

      {(pendingLeaveRequests || []).length === 0 && (
        <p className="loading-text">No pending requests.</p>
      )}

      {(pendingLeaveRequests || []).map((leave) => (
        <div className="stat-row" key={leave._id}>
          <span>
            {leave.employee?.name || "Unknown"} · {leave.leaveType} ·{" "}
            {new Date(leave.startDate).toLocaleDateString()} –{" "}
            {new Date(leave.endDate).toLocaleDateString()}
          </span>
          <span>
            <button
              className="btn btn-approve"
              disabled={processingId === leave._id}
              onClick={() => handleReview(leave._id, "approved")}
            >
              Approve
            </button>
            <button
              className="btn btn-reject"
              disabled={processingId === leave._id}
              onClick={() => handleReview(leave._id, "rejected")}
            >
              Reject
            </button>
          </span>
        </div>
      ))}
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { getMyLeaveRequests } from "../../api/leaveApi";
import "../../styles/attendance-leave.css";

const StatusPill = ({ status }) => (
  <span className={`status-pill ${status?.toLowerCase()}`}>{status}</span>
);

export default function LeaveList({ refreshKey }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getMyLeaveRequests();
        setRequests(res.data || []);
      } catch (err) {
        setError("Couldn't load your leave requests.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [refreshKey]);

  return (
    <div className="hrms-card">
      <h3 className="hrms-section-title">My leave requests</h3>

      {loading ? (
        <p className="hrms-empty">Loading...</p>
      ) : error ? (
        <p className="form-msg error">{error}</p>
      ) : requests.length === 0 ? (
        <p className="hrms-empty">No leave requests yet.</p>
      ) : (
        <table className="hrms-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Dates</th>
              <th>Remarks</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r._id}>
                <td>{r.type}</td>
                <td>
                  {r.startDate} → {r.endDate}
                </td>
                <td className="approval-remarks">{r.remarks || "—"}</td>
                <td>
                  <StatusPill status={r.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

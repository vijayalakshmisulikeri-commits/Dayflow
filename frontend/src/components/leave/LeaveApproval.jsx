import React, { useEffect, useState } from "react";
import { getAllLeaveRequests, decideLeaveRequest } from "../../api/leaveApi";
import "../../styles/attendance-leave.css";

const FILTERS = ["All", "Pending", "Approved", "Rejected"];

const StatusPill = ({ status }) => (
  <span className={`status-pill ${status?.toLowerCase()}`}>{status}</span>
);

export default function LeaveApproval() {
  const [filter, setFilter] = useState("Pending");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actioningId, setActioningId] = useState(null);
  const [commentDrafts, setCommentDrafts] = useState({}); // { [leaveId]: text }

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const statusParam = filter === "All" ? null : filter;
      const res = await getAllLeaveRequests(statusParam);
      setRequests(res.data || []);
    } catch (err) {
      setError("Couldn't load leave requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handleDecision = async (leaveId, decision) => {
    setActioningId(leaveId);
    setError("");
    try {
      await decideLeaveRequest(leaveId, decision, commentDrafts[leaveId] || "");
      // Reflect immediately without waiting for a full reload
      setRequests((prev) =>
        prev.map((r) =>
          r._id === leaveId ? { ...r, status: decision } : r
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't update this request.");
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div className="hrms-card">
      <h3 className="hrms-section-title">Leave approvals</h3>

      <div className="filter-bar">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={filter === f ? "active" : ""}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {error && <p className="form-msg error" style={{ marginBottom: 12 }}>{error}</p>}

      {loading ? (
        <p className="hrms-empty">Loading...</p>
      ) : requests.length === 0 ? (
        <p className="hrms-empty">No requests match this filter.</p>
      ) : (
        <table className="hrms-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Type</th>
              <th>Dates</th>
              <th>Remarks</th>
              <th>Status</th>
              <th>Comment</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r._id}>
                <td>{r.employeeName || r.employeeId}</td>
                <td>{r.type}</td>
                <td>
                  {r.startDate} → {r.endDate}
                </td>
                <td className="approval-remarks">{r.remarks || "—"}</td>
                <td>
                  <StatusPill status={r.status} />
                </td>
                <td>
                  {r.status === "Pending" ? (
                    <input
                      type="text"
                      placeholder="Optional comment"
                      value={commentDrafts[r._id] || ""}
                      onChange={(e) =>
                        setCommentDrafts((prev) => ({
                          ...prev,
                          [r._id]: e.target.value,
                        }))
                      }
                      style={{
                        border: "1px solid var(--border)",
                        borderRadius: 6,
                        padding: "5px 8px",
                        fontSize: 13,
                        width: 150,
                      }}
                    />
                  ) : (
                    <span className="approval-remarks">{r.comment || "—"}</span>
                  )}
                </td>
                <td>
                  {r.status === "Pending" && (
                    <div className="approval-row-actions">
                      <button
                        className="hrms-btn primary"
                        disabled={actioningId === r._id}
                        onClick={() => handleDecision(r._id, "Approved")}
                      >
                        Approve
                      </button>
                      <button
                        className="hrms-btn danger"
                        disabled={actioningId === r._id}
                        onClick={() => handleDecision(r._id, "Rejected")}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

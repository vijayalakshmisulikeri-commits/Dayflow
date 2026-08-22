import React, { useEffect, useState } from "react";
import {
  getDailyAttendance,
  getWeeklyAttendance,
} from "../../api/attendanceApi";
import "../../styles/attendance-leave.css";

// Monday of the current week, as YYYY-MM-DD
const getWeekStart = () => {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  return monday.toISOString().slice(0, 10);
};

const StatusPill = ({ status }) => (
  <span className={`status-pill ${status?.toLowerCase().replace(" ", "-")}`}>
    {status || "—"}
  </span>
);

export default function AttendanceView({ employeeId = null }) {
  const [view, setView] = useState("daily"); // "daily" | "weekly"
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        if (view === "daily") {
          const dateStr = new Date().toISOString().slice(0, 10);
          const res = await getDailyAttendance(dateStr, employeeId);
          // normalize to an array so the table renders the same either way
          setRecords(res.data ? [res.data] : []);
        } else {
          const res = await getWeeklyAttendance(getWeekStart(), employeeId);
          setRecords(res.data || []);
        }
      } catch (err) {
        setError("Couldn't load attendance records.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [view, employeeId]);

  return (
    <div className="hrms-card">
      <h3 className="hrms-section-title">Attendance</h3>

      <div className="attendance-toggle">
        <button
          className={view === "daily" ? "active" : ""}
          onClick={() => setView("daily")}
        >
          Daily
        </button>
        <button
          className={view === "weekly" ? "active" : ""}
          onClick={() => setView("weekly")}
        >
          Weekly
        </button>
      </div>

      {loading ? (
        <p className="hrms-empty">Loading...</p>
      ) : error ? (
        <p className="form-msg error">{error}</p>
      ) : records.length === 0 ? (
        <p className="hrms-empty">No attendance records for this period.</p>
      ) : (
        <table className="hrms-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.date || r._id}>
                <td>{r.date}</td>
                <td>
                  {r.checkInTime
                    ? new Date(r.checkInTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "--:--"}
                </td>
                <td>
                  {r.checkOutTime
                    ? new Date(r.checkOutTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "--:--"}
                </td>
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

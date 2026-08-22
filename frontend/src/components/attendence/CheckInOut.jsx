import React, { useEffect, useState } from "react";
import { checkIn, checkOut, getDailyAttendance } from "../../api/attendanceApi";
import "../../styles/attendance-leave.css";

const formatTime = (iso) => {
  if (!iso) return "--:--";
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function CheckInOut() {
  const [today, setToday] = useState(null); // { checkInTime, checkOutTime, status }
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const loadToday = async () => {
    setLoading(true);
    setError("");
    try {
      const dateStr = new Date().toISOString().slice(0, 10);
      const res = await getDailyAttendance(dateStr);
      setToday(res.data || null);
    } catch (err) {
      setError("Couldn't load today's attendance.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadToday();
  }, []);

  const handleCheckIn = async () => {
    setActionLoading(true);
    setError("");
    try {
      const res = await checkIn();
      setToday(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Check-in failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setActionLoading(true);
    setError("");
    try {
      const res = await checkOut();
      setToday(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Check-out failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const hasCheckedIn = Boolean(today?.checkInTime);
  const hasCheckedOut = Boolean(today?.checkOutTime);

  return (
    <div className="hrms-card">
      <h3 className="hrms-section-title">Today's attendance</h3>

      {loading ? (
        <p className="hrms-empty">Loading...</p>
      ) : (
        <div className="checkin-widget">
          <div className="checkin-status">
            <span className="label">Check-in</span>
            <span className="time">{formatTime(today?.checkInTime)}</span>
          </div>
          <div className="checkin-status">
            <span className="label">Check-out</span>
            <span className="time">{formatTime(today?.checkOutTime)}</span>
          </div>

          {!hasCheckedIn && (
            <button
              className="hrms-btn primary"
              onClick={handleCheckIn}
              disabled={actionLoading}
            >
              {actionLoading ? "Checking in..." : "Check in"}
            </button>
          )}

          {hasCheckedIn && !hasCheckedOut && (
            <button
              className="hrms-btn danger"
              onClick={handleCheckOut}
              disabled={actionLoading}
            >
              {actionLoading ? "Checking out..." : "Check out"}
            </button>
          )}

          {hasCheckedIn && hasCheckedOut && (
            <span className="status-pill present">Day complete</span>
          )}
        </div>
      )}

      {error && <p className="form-msg error" style={{ marginTop: 12 }}>{error}</p>}
    </div>
  );
}

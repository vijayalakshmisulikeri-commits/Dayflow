import React, { useState } from "react";
import { applyForLeave } from "../../api/leaveApi";
import "../../styles/attendance-leave.css";

const LEAVE_TYPES = ["Paid", "Sick", "Unpaid"];

export default function LeaveRequestForm({ onSubmitted }) {
  const [type, setType] = useState(LEAVE_TYPES[0]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null); // { type: "success" | "error", text }

  const resetForm = () => {
    setType(LEAVE_TYPES[0]);
    setStartDate("");
    setEndDate("");
    setRemarks("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!startDate || !endDate) {
      setMessage({ type: "error", text: "Select a start and end date." });
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      setMessage({ type: "error", text: "End date can't be before start date." });
      return;
    }

    setSubmitting(true);
    try {
      await applyForLeave({ type, startDate, endDate, remarks });
      setMessage({ type: "success", text: "Leave request submitted." });
      resetForm();
      if (onSubmitted) onSubmitted();
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Couldn't submit request.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="hrms-card">
      <h3 className="hrms-section-title">Apply for leave</h3>

      <form className="leave-form" onSubmit={handleSubmit}>
        <div className="leave-form-field">
          <label htmlFor="leave-type">Leave type</label>
          <select
            id="leave-type"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            {LEAVE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="leave-form-row">
          <div className="leave-form-field">
            <label htmlFor="start-date">Start date</label>
            <input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="leave-form-field">
            <label htmlFor="end-date">End date</label>
            <input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <div className="leave-form-field">
          <label htmlFor="remarks">Remarks (optional)</label>
          <textarea
            id="remarks"
            placeholder="Add any context for your approver..."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>

        {message && (
          <p className={`form-msg ${message.type}`}>{message.text}</p>
        )}

        <button className="hrms-btn primary" type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit request"}
        </button>
      </form>
    </div>
  );
}

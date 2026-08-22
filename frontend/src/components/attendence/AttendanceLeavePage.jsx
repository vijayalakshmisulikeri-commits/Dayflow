import React, { useState } from "react";
import CheckInOut from "./CheckInOut";
import AttendanceView from "./AttendanceView";
import LeaveRequestForm from "../leave/LeaveRequestForm";
import LeaveList from "../leave/LeaveList";
import LeaveApproval from "../leave/LeaveApproval";

// Example composition. Swap `role` for whatever your auth/user context provides.
export default function AttendanceLeavePage({ role = "Employee" }) {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div
      style={{
        display: "grid",
        gap: 20,
        maxWidth: 900,
        margin: "0 auto",
        padding: "24px 16px",
      }}
    >
      {role === "Admin" ? (
        <LeaveApproval />
      ) : (
        <>
          <CheckInOut />
          <AttendanceView />
          <LeaveRequestForm onSubmitted={() => setRefreshKey((k) => k + 1)} />
          <LeaveList refreshKey={refreshKey} />
        </>
      )}
    </div>
  );
}

import axiosClient from "./axiosClient";

// NOTE: adjust these paths if your routes/leave.js uses different ones.

// Employee: submit a leave request
export const applyForLeave = ({ type, startDate, endDate, remarks }) =>
  axiosClient.post("/leave/apply", { type, startDate, endDate, remarks });

// Employee: view own leave requests
export const getMyLeaveRequests = () => axiosClient.get("/leave/my-requests");

// Admin: view all leave requests (optionally filter by status)
export const getAllLeaveRequests = (status = null) =>
  axiosClient.get("/leave/all", { params: { status } });

// Admin: approve or reject a leave request
export const decideLeaveRequest = (leaveId, decision, comment = "") =>
  axiosClient.patch(`/leave/${leaveId}/decision`, { decision, comment });

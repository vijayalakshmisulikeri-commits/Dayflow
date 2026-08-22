import httpRequest from "./httpClient";

export function fetchMyLeaves(status) {
  const qs = status ? `?status=${status}` : "";
  return httpRequest(`/api/leave/me${qs}`);
}

export function applyForLeave({ leaveType, startDate, endDate, remarks }) {
  return httpRequest("/api/leave/apply", {
    method: "POST",
    body: { leaveType, startDate, endDate, remarks },
  });
}

export function cancelLeave(leaveId) {
  return httpRequest(`/api/leave/${leaveId}`, { method: "DELETE" });
}

export function fetchAllLeaves({ status, employeeId } = {}) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (employeeId) params.set("employeeId", employeeId);
  const qs = params.toString() ? `?${params.toString()}` : "";
  return httpRequest(`/api/leave/all${qs}`);
}

export function reviewLeave(leaveId, decision, adminComment) {
  return httpRequest(`/api/leave/${leaveId}/review`, {
    method: "PATCH",
    body: { decision, adminComment },
  });
}

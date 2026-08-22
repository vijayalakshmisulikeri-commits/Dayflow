import httpRequest from "./httpClient";

export function fetchEmployeeDashboard(employeeId) {
  return httpRequest(`/api/dashboard/employee/${employeeId}`);
}

export function fetchAdminDashboard() {
  return httpRequest("/api/dashboard/admin");
}

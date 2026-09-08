import httpRequest from "./httpClient";

export function fetchMyPayroll(year, month) {
  const params = new URLSearchParams();
  if (year) params.set("year", year);
  if (month) params.set("month", month);
  const qs = params.toString() ? `?${params.toString()}` : "";
  return httpRequest(`/api/payroll/me${qs}`);
}

export function fetchAllPayroll() {
  return httpRequest("/api/payroll");
}

export function fetchEmployeePayroll(employeeId, year, month) {
  const params = new URLSearchParams();
  if (year) params.set("year", year);
  if (month) params.set("month", month);
  const qs = params.toString() ? `?${params.toString()}` : "";
  return httpRequest(`/api/payroll/${employeeId}${qs}`);
}

export function updateEmployeePayroll(employeeId, salaryStructure) {
  return httpRequest(`/api/payroll/${employeeId}`, {
    method: "PUT",
    body: salaryStructure,
  });
}

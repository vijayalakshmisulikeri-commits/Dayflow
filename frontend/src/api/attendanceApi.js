import axiosClient from "./axiosClient";

export const checkIn = () => axiosClient.post("/attendance/check-in");

export const checkOut = () => axiosClient.post("/attendance/check-out");

// Daily attendance for the logged-in employee
export const getDailyAttendance = (date) =>
  axiosClient.get("/attendance/me/daily", { params: { date } });

// Weekly attendance for the logged-in employee
export const getWeeklyAttendance = (weekStart) =>
  axiosClient.get("/attendance/me/weekly", { params: { start: weekStart } });

// Admin: attendance across all employees for a given date
export const getAllAttendance = (date) =>
  axiosClient.get("/attendance/all", { params: { date } });

// Admin: one employee's attendance over a date range
export const getEmployeeAttendance = (employeeId, start, end) =>
  axiosClient.get(`/attendance/employee/${employeeId}`, { params: { start, end } });

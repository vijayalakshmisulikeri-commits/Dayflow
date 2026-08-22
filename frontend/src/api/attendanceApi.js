import axiosClient from "./axiosClient";

// NOTE: adjust these paths if your routes/attendance.js uses different ones.

export const checkIn = () => axiosClient.post("/attendance/check-in");

export const checkOut = () => axiosClient.post("/attendance/check-out");

// Daily attendance for the logged-in employee (or a specific employee if admin)
export const getDailyAttendance = (date, employeeId = null) =>
  axiosClient.get("/attendance/daily", {
    params: { date, employeeId },
  });

// Weekly attendance for the logged-in employee (or a specific employee if admin)
export const getWeeklyAttendance = (weekStart, employeeId = null) =>
  axiosClient.get("/attendance/weekly", {
    params: { weekStart, employeeId },
  });

// Admin: attendance across all employees for a given date
export const getAllAttendance = (date) =>
  axiosClient.get("/attendance/all", { params: { date } });

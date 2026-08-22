const Employee = require("../models/User");
const Attendance = require("../models/Attendance");
const Leave = require("../models/Leave");

/**
 * GET /api/dashboard/admin
 * Access: Admin
 *
 * Returns: employee list, today's attendance overview across everyone,
 * and all pending leave requests awaiting approval.
 */
async function getAdminDashboard(req, res) {
  try {
    const employees = await Employee.find().select("name email role phone");

    const startOfToday = new Date();
    startOfToday.setUTCHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setUTCHours(23, 59, 59, 999);

    const todayAttendance = await Attendance.find({
      date: { $gte: startOfToday, $lte: endOfToday },
    }).populate("employee", "name email");

    const attendanceOverview = {
      totalEmployees: employees.length,
      present: todayAttendance.filter((a) => a.status === "present").length,
      absent: todayAttendance.filter((a) => a.status === "absent").length,
      halfDay: todayAttendance.filter((a) => a.status === "half-day").length,
      onLeave: todayAttendance.filter((a) => a.status === "leave").length,
      notMarked: employees.length - todayAttendance.length,
    };

    const pendingLeaveRequests = await Leave.find({ status: "pending" })
      .sort({ createdAt: -1 })
      .populate("employee", "name email");

    res.status(200).json({
      employees,
      attendanceOverview,
      pendingLeaveRequests,
    });
  } catch (err) {
    console.error("getAdminDashboard error:", err);
    res.status(500).json({ message: "Server error fetching admin dashboard" });
  }
}

module.exports = { getAdminDashboard };

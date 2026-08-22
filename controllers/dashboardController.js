const Employee = require("../models/User");
const Attendance = require("../models/Attendance");
const Leave = require("../models/Leave");
const Payroll = require("../models/Payroll");
const { computeAttendanceAdjustedSalary } = require("../utils/payrollCalc");

/**
 * GET /api/dashboard/employee/:id
 * Access: Employee (own dashboard only)
 *
 * Aggregates: profile, this month's attendance summary, recent leave
 * requests, and a payroll snapshot (attendance-adjusted).
 */
async function getEmployeeDashboard(req, res) {
  try {
    const { id } = req.params;

    if (req.user.role === "Employee" && req.user.id !== id) {
      return res.status(403).json({ message: "Cannot view another employee's dashboard" });
    }

    const employee = await Employee.findById(id).select("name email role phone address");
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const now = new Date();
    const year = now.getUTCFullYear();
    const month = now.getUTCMonth() + 1;
    const startOfMonth = new Date(Date.UTC(year, month - 1, 1));

    const attendanceRecords = await Attendance.find({
      employee: id,
      date: { $gte: startOfMonth },
    });

    const attendanceSummary = {
      present: attendanceRecords.filter((a) => a.status === "present").length,
      absent: attendanceRecords.filter((a) => a.status === "absent").length,
      halfDay: attendanceRecords.filter((a) => a.status === "half-day").length,
      onLeave: attendanceRecords.filter((a) => a.status === "leave").length,
    };

    const recentLeaves = await Leave.find({ employee: id })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("leaveType startDate endDate status remarks adminComment");

    const payroll = await Payroll.findOne({ employee: id });
    let payrollSnapshot = null;
    if (payroll) {
      const breakdown = await computeAttendanceAdjustedSalary(id, payroll, year, month);
      payrollSnapshot = {
        netPayable: breakdown.netPayable,
        payableDays: breakdown.payableDays,
        workingDays: breakdown.workingDays,
      };
    }

    res.status(200).json({
      profile: employee,
      attendanceSummary,
      recentLeaves,
      payrollSnapshot,
    });
  } catch (err) {
    console.error("getEmployeeDashboard error:", err);
    res.status(500).json({ message: "Server error fetching dashboard" });
  }
}

module.exports = { getEmployeeDashboard };

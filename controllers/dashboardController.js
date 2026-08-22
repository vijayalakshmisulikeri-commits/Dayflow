const Employee = require("../models/_employeeStub"); // swap for teammate's real model
const { Attendance, Leave } = require("../models/_teammateStubs"); // swap for real models
const Payroll = require("../models/Payroll");

/**
 * GET /api/dashboard/employee/:id
 * Access: Employee (own dashboard only)
 *
 * Aggregates: profile summary, attendance summary (this month),
 * recent leave requests + their status, and a payroll snapshot.
 * This endpoint doesn't own any of the underlying data — it just
 * pulls a summary slice from each collection for the dashboard cards.
 */
async function getEmployeeDashboard(req, res) {
  try {
    const { id } = req.params;

    // Guard: employees can only view their own dashboard
    if (req.user.role === "Employee" && req.user.id !== id) {
      return res.status(403).json({ message: "Cannot view another employee's dashboard" });
    }

    const employee = await Employee.findById(id).select(
      "name email role employeeIdCode department designation profilePicture"
    );
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Attendance summary for the current month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const attendanceRecords = await Attendance.find({
      employeeId: id,
      date: { $gte: startOfMonth },
    });

    const attendanceSummary = {
      present: attendanceRecords.filter((a) => a.status === "Present").length,
      absent: attendanceRecords.filter((a) => a.status === "Absent").length,
      halfDay: attendanceRecords.filter((a) => a.status === "Half-day").length,
      onLeave: attendanceRecords.filter((a) => a.status === "Leave").length,
    };

    // Most recent leave requests (last 5)
    const recentLeaves = await Leave.find({ employeeId: id })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("leaveType startDate endDate status remarks");

    // Payroll snapshot (net salary only — full breakdown lives at /api/payroll/me)
    const payroll = await Payroll.findOne({ employeeId: id }).select("netSalary payDate");

    res.status(200).json({
      profile: employee,
      attendanceSummary,
      recentLeaves,
      payrollSnapshot: payroll
        ? { netSalary: payroll.netSalary, payDate: payroll.payDate }
        : null,
    });
  } catch (err) {
    console.error("getEmployeeDashboard error:", err);
    res.status(500).json({ message: "Server error fetching dashboard" });
  }
}

module.exports = { getEmployeeDashboard };

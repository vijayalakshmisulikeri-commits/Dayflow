const Payroll = require("../models/Payroll");
const { computeAttendanceAdjustedSalary } = require("../utils/payrollCalc");

/**
 * GET /api/payroll/me
 * Access: Employee (own record only, read-only)
 * Query params: ?year=2026&month=8 (defaults to current month)
 *
 * Returns the fixed salary structure AND an attendance-adjusted
 * payable amount for the requested month (present days + approved
 * paid/sick leave counted, unpaid absences deducted).
 */
async function getMyPayroll(req, res) {
  try {
    const employee = req.user.id;
    const now = new Date();
    const year = parseInt(req.query.year) || now.getUTCFullYear();
    const month = parseInt(req.query.month) || now.getUTCMonth() + 1;

    const payroll = await Payroll.findOne({ employee });

    if (!payroll) {
      return res.status(404).json({ message: "No payroll record found" });
    }

    const monthlyBreakdown = await computeAttendanceAdjustedSalary(
      employee,
      payroll,
      year,
      month
    );

    res.status(200).json({
      salaryStructure: {
        basicSalary: payroll.basicSalary,
        hra: payroll.hra,
        conveyanceAllowance: payroll.conveyanceAllowance,
        medicalAllowance: payroll.medicalAllowance,
        specialAllowance: payroll.specialAllowance,
        deductions: payroll.deductions,
        grossSalary: payroll.grossSalary,
        totalDeductions: payroll.totalDeductions,
        netSalary: payroll.netSalary, // full/fixed net (no attendance adjustment)
      },
      monthlyBreakdown, // attendance-adjusted payable amount for the requested month
    });
  } catch (err) {
    console.error("getMyPayroll error:", err);
    res.status(500).json({ message: "Server error fetching payroll" });
  }
}

module.exports = { getMyPayroll };

const Payroll = require("../models/Payroll");

/**
 * GET /api/payroll/me
 * Access: Employee (own record only, read-only)
 */
async function getMyPayroll(req, res) {
  try {
    const employeeId = req.user.id;

    const payroll = await Payroll.findOne({ employeeId });

    if (!payroll) {
      return res.status(404).json({ message: "No payroll record found" });
    }

    res.status(200).json({
      employeeId: payroll.employeeId,
      basicSalary: payroll.basicSalary,
      hra: payroll.hra,
      conveyanceAllowance: payroll.conveyanceAllowance,
      medicalAllowance: payroll.medicalAllowance,
      specialAllowance: payroll.specialAllowance,
      deductions: payroll.deductions,
      grossSalary: payroll.grossSalary,
      totalDeductions: payroll.totalDeductions,
      netSalary: payroll.netSalary,
      payDate: payroll.payDate,
    });
  } catch (err) {
    console.error("getMyPayroll error:", err);
    res.status(500).json({ message: "Server error fetching payroll" });
  }
}

module.exports = { getMyPayroll };

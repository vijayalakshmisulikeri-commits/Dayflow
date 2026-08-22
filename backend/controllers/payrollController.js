const Payroll = require("../models/Payroll");
const { computeAttendanceAdjustedSalary } = require("../utils/payrollCalc");

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
        netSalary: payroll.netSalary,
      },
      monthlyBreakdown,
    });
  } catch (err) {
    console.error("getMyPayroll error:", err);
    res.status(500).json({ message: "Server error fetching payroll" });
  }
}

module.exports = { getMyPayroll };
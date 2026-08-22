const Payroll = require("../models/Payroll");
const { computeAttendanceAdjustedSalary } = require("../utils/payrollCalc");

/**
 * GET /api/payroll
 * Access: Admin — list every employee's payroll (fixed structure, not attendance-adjusted)
 */
async function getAllPayroll(req, res) {
  try {
    const records = await Payroll.find().populate("employee", "name email role");
    res.status(200).json(records);
  } catch (err) {
    console.error("getAllPayroll error:", err);
    res.status(500).json({ message: "Server error fetching payroll records" });
  }
}

/**
 * GET /api/payroll/:employeeId
 * Access: Admin — one employee's payroll, attendance-adjusted for the given month
 * Query params: ?year=2026&month=8 (defaults to current month)
 */
async function getPayrollByEmployee(req, res) {
  try {
    const { employeeId } = req.params;
    const now = new Date();
    const year = parseInt(req.query.year) || now.getUTCFullYear();
    const month = parseInt(req.query.month) || now.getUTCMonth() + 1;

    const payroll = await Payroll.findOne({ employee: employeeId }).populate(
      "employee",
      "name email role"
    );
    if (!payroll) {
      return res.status(404).json({ message: "No payroll record found for this employee" });
    }

    const monthlyBreakdown = await computeAttendanceAdjustedSalary(
      employeeId,
      payroll,
      year,
      month
    );

    res.status(200).json({ payroll, monthlyBreakdown });
  } catch (err) {
    console.error("getPayrollByEmployee error:", err);
    res.status(500).json({ message: "Server error fetching payroll record" });
  }
}

/**
 * PUT /api/payroll/:employeeId
 * Access: Admin — update salary structure (creates the record if it doesn't exist yet)
 * Body: { basicSalary, hra, conveyanceAllowance, medicalAllowance, specialAllowance, deductions, payDate }
 */
async function updatePayroll(req, res) {
  try {
    const { employeeId } = req.params;
    const {
      basicSalary,
      hra,
      conveyanceAllowance,
      medicalAllowance,
      specialAllowance,
      deductions,
      payDate,
    } = req.body;

    const update = {
      ...(basicSalary !== undefined && { basicSalary }),
      ...(hra !== undefined && { hra }),
      ...(conveyanceAllowance !== undefined && { conveyanceAllowance }),
      ...(medicalAllowance !== undefined && { medicalAllowance }),
      ...(specialAllowance !== undefined && { specialAllowance }),
      ...(deductions !== undefined && { deductions }),
      ...(payDate !== undefined && { payDate }),
    };

    const payroll = await Payroll.findOneAndUpdate(
      { employee: employeeId },
      { $set: update, $setOnInsert: { employee: employeeId } },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({ message: "Payroll updated", payroll });
  } catch (err) {
    console.error("updatePayroll error:", err);
    res.status(500).json({ message: "Server error updating payroll" });
  }
}

module.exports = { getAllPayroll, getPayrollByEmployee, updatePayroll };

const Attendance = require("../models/Attendance");
const Leave = require("../models/Leave");

/**
 * Computes a salary snapshot for one employee for a given month,
 * factoring in actual attendance and approved leave.
 *
 * Rules:
 * - "Working days" = weekdays (Mon–Fri) in the month, used as the divisor for per-day rate.
 * - Present day = full day pay. Half-day = 0.5 day pay.
 * - Approved PAID or SICK leave = counted as a full paid day (company pays for these).
 * - Approved UNPAID leave, or any day with no attendance record and no approved leave
 *   ("absent") = unpaid, reduces salary.
 * - Fixed deductions (PF, tax, etc.) from the Payroll record are NOT prorated —
 *   they apply in full regardless of days present. Adjust here if your team wants proration.
 *
 * @param {ObjectId|string} employeeId
 * @param {Object} payroll - a Payroll mongoose document (for basicSalary/allowances/deductions)
 * @param {number} year
 * @param {number} month - 1-indexed (1 = January)
 */
async function computeAttendanceAdjustedSalary(employeeId, payroll, year, month) {
  const startOfMonth = new Date(Date.UTC(year, month - 1, 1));
  const endOfMonth = new Date(Date.UTC(year, month, 0, 23, 59, 59));

  // Count weekdays in the month = denominator for per-day rate
  let workingDays = 0;
  for (let d = new Date(startOfMonth); d <= endOfMonth; d.setUTCDate(d.getUTCDate() + 1)) {
    const day = d.getUTCDay();
    if (day !== 0 && day !== 6) workingDays++;
  }

  const attendanceRecords = await Attendance.find({
    employee: employeeId,
    date: { $gte: startOfMonth, $lte: endOfMonth },
  });

  const presentDays = attendanceRecords.filter((a) => a.status === "present").length;
  const halfDays = attendanceRecords.filter((a) => a.status === "half-day").length;
  const absentDays = attendanceRecords.filter((a) => a.status === "absent").length;

  const approvedLeaves = await Leave.find({
    employee: employeeId,
    status: "approved",
    startDate: { $lte: endOfMonth },
    endDate: { $gte: startOfMonth },
  });

  // Count paid-leave days that overlap this month (paid + sick are payable; unpaid is not)
  let paidLeaveDays = 0;
  let unpaidLeaveDays = 0;
  for (const leave of approvedLeaves) {
    const start = leave.startDate < startOfMonth ? startOfMonth : leave.startDate;
    const end = leave.endDate > endOfMonth ? endOfMonth : leave.endDate;
    const days = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;

    if (leave.leaveType === "paid" || leave.leaveType === "sick") {
      paidLeaveDays += days;
    } else {
      unpaidLeaveDays += days;
    }
  }

  const grossSalary = payroll.grossSalary; // virtual from Payroll model
  const perDayRate = workingDays > 0 ? grossSalary / workingDays : 0;

  const payableDays = presentDays + halfDays * 0.5 + paidLeaveDays;
  const earnedGross = Math.round(perDayRate * payableDays * 100) / 100;

  const netPayable = Math.round((earnedGross - payroll.totalDeductions) * 100) / 100;

  return {
    year,
    month,
    workingDays,
    presentDays,
    halfDays,
    absentDays,
    paidLeaveDays,
    unpaidLeaveDays,
    payableDays,
    perDayRate: Math.round(perDayRate * 100) / 100,
    grossSalary,
    earnedGross,
    deductions: payroll.totalDeductions,
    netPayable,
  };
}

module.exports = { computeAttendanceAdjustedSalary };

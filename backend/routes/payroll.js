const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/authCheck");
const roleCheck = require("../middleware/roleCheck");
const { getMyPayroll } = require("../controllers/payrollController");
const {
  getAllPayroll,
  getPayrollByEmployee,
  updatePayroll,
} = require("../controllers/adminPayrollController");

// Employee: own payroll, read-only, attendance-adjusted
router.get("/me", verifyToken, roleCheck("Employee"), getMyPayroll);

// Admin: view all payroll records
router.get("/", verifyToken, roleCheck("Admin"), getAllPayroll);

// Admin: view one employee's payroll (attendance-adjusted)
router.get("/:employeeId", verifyToken, roleCheck("Admin"), getPayrollByEmployee);

// Admin: create/update an employee's salary structure
router.put("/:employeeId", verifyToken, roleCheck("Admin"), updatePayroll);

module.exports = router;

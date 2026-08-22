const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");
const { getMyPayroll } = require("../controllers/payrollController");
const {
  getAllPayroll,
  getPayrollByEmployee,
  updatePayroll,
} = require("../controllers/adminPayrollController");

// Employee: own payroll, read-only, attendance-adjusted
router.get("/me", authMiddleware, roleCheck("Employee"), getMyPayroll);

// Admin: view all payroll records
router.get("/", authMiddleware, roleCheck("Admin"), getAllPayroll);

// Admin: view one employee's payroll (attendance-adjusted)
router.get("/:employeeId", authMiddleware, roleCheck("Admin"), getPayrollByEmployee);

// Admin: create/update an employee's salary structure
router.put("/:employeeId", authMiddleware, roleCheck("Admin"), updatePayroll);

module.exports = router;

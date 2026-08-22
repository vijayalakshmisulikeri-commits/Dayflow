const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/authCheck");
const roleCheck = require("../middleware/roleCheck");
const { getEmployeeDashboard } = require("../controllers/dashboardController");
const { getAdminDashboard } = require("../controllers/adminDashboardController");

// Employee: own dashboard
router.get(
  "/employee/:id",
  verifyToken,
  roleCheck("Employee", "Admin"),
  getEmployeeDashboard
);

// Admin: employee list + attendance overview + pending leave approvals
router.get("/admin", verifyToken, roleCheck("Admin"), getAdminDashboard);

module.exports = router;

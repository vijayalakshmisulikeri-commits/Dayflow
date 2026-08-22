const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");
const { getEmployeeDashboard } = require("../controllers/dashboardController");
const { getAdminDashboard } = require("../controllers/adminDashboardController");

// Employee: own dashboard
router.get(
  "/employee/:id",
  authMiddleware,
  roleCheck("Employee", "Admin"),
  getEmployeeDashboard
);

// Admin: employee list + attendance overview + pending leave approvals
router.get("/admin", authMiddleware, roleCheck("Admin"), getAdminDashboard);

module.exports = router;

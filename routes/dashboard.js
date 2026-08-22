const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");
const { getEmployeeDashboard } = require("../controllers/dashboardController");

// GET /api/dashboard/employee/:id — aggregated employee dashboard
router.get(
  "/employee/:id",
  authMiddleware,
  roleCheck("Employee", "Admin"),
  getEmployeeDashboard
);

// Admin dashboard route goes here later once you get to the admin half

module.exports = router;

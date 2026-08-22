const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin } = require('../middleware/authCheck');
const roleCheck = require('../middleware/roleCheck');
const dashboardController = require('../controllers/dashboardController');


// GET /api/dashboard/employee/:id — aggregated employee dashboard
router.get(
  "/employee/:id",
  verifyToken,
  roleCheck("Employee", "Admin"),
  dashboardController.getEmployeeDashboard
);

// Admin dashboard route goes here later once you get to the admin half

module.exports = router;

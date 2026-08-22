/**
 * Usage: roleCheck("Admin") or roleCheck("Admin", "Employee")
 * Must run after authMiddleware, since it reads req.user.role.
 */
function roleCheck(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied for this role" });
    }
    next();
  };
}

module.exports = roleCheck;

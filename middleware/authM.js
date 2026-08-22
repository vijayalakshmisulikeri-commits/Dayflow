// NOTE: This assumes Member 1 (Auth) sets up JWT middleware that attaches
// `req.user = { id, role }` (role is 'employee' or 'hr'/'admin') to the request.
// Swap this out for the real implementation once it's ready — the attendance
// and leave routes only depend on req.user.id and req.user.role existing.

const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'hr')) {
    return res.status(403).json({ message: 'Admin/HR access required' });
  }
  next();
}

module.exports = { verifyToken, requireAdmin };

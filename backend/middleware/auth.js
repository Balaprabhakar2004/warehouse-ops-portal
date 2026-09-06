const jwt = require('jsonwebtoken');

// Verifies the JWT and attaches the user info to req.user
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']; // format: "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user; // { id, role, name }
    next();
  });
}

// Restricts a route to specific roles, e.g. requireRole('admin', 'manager')
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'You do not have permission to do this' });
    }
    next();
  };
}

module.exports = { authenticateToken, requireRole };
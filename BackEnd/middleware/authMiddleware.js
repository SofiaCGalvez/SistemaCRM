const jwt = require("jsonwebtoken");

const TOKEN_COOKIE_NAME = "crm_token";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  // The API supports both SPA requests with Authorization headers and browser
  // sessions that rely on the HTTP-only cookie set during login.
  const token = bearerToken || req.cookies?.[TOKEN_COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired session" });
  }
};

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // Route handlers declare their allowed roles so authorization stays close to each endpoint.
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "You do not have permission to perform this action" });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRoles
};

const jwt = require("jsonwebtoken");


//  Authentication Middleware Verifies JWT token from Authorization header
function authenticateToken(req, res, next) {
  // Get token from header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; 

  if (!token) {
    return res.status(401).json({
      status: "Error",
      message: "Access denied. No token provided.",
      data: null,
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "Error",
        message: "Token expired. Please login again.",
        data: null,
      });
    }
    return res.status(403).json({
      status: "Error",
      message: "Invalid token.",
      data: null,
    });
  }
}

// Authentication Middleware Attaches user if token exists, but doesn't block request
function optionalAuth(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (err) {
      // Token is invalid, but we don't block the request
      req.user = null;
    }
  }

  next();
}

module.exports = {
  authenticateToken,
  optionalAuth,
};
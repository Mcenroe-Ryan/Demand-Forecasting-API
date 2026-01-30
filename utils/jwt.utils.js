const jwt = require("jsonwebtoken");

/**
 * Generate JWT Token
 * @param {Object} payload - User data to encode in token
 * @returns {String} JWT token
 */
function generateToken(payload) {
  return jwt.sign(
    {
      user_id: payload.user_id,
      email: payload.email,
      account_number: payload.account_number,
      auth_method: payload.auth_method,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );
}

/**
 * Verify JWT Token
 * @param {String} token - JWT token to verify
 * @returns {Object} Decoded payload
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
}

module.exports = {
  generateToken,
  verifyToken,
};
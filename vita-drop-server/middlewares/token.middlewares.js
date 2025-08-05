const jwt = require("jsonwebtoken");

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }
  // Remove "Bearer " prefix if present
  const tokenWithoutBearer = token.startsWith("Bearer ")
    ? token.slice(7)
    : token;

  if (!tokenWithoutBearer) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid token format" });
  }

  jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ success: false, message: "Failed to authenticate token" });
    }
    req.user = decoded; // Save the decoded user info to request object
    next();
  });
};

module.exports = { verifyToken };

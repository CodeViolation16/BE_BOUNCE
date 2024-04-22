const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const loginRequired = (req, res, next) => {
  try {
    const tokenString = req.headers.authorization;
    if (!tokenString) throw new Error("Login required");

    const token = tokenString.replace("Bearer ", "");

    jwt.verify(token, JWT_SECRET_KEY, (err, payload) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          throw new Error("Token Expired");
        } else {
          throw new Error("Token is invalid");
        }
      }

      req.userId = payload._id;
      next();
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports = loginRequired;

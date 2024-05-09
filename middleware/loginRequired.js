const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const { sign, verify } = require("jsonwebtoken");

function createTokens(user) {
  const accessToken = sign(
    { username: user.username, id: user._id },
    JWT_SECRET_KEY
  );
  return accessToken;
}

const validateToken = (req, res, next) => {
  const accessToken = req.cookies["access_token"];
  if (!accessToken) return res.status(400).json({ error: "Not Authenticated" });
  try {
    const validToken = verify(accessToken, JWT_SECRET_KEY);
    if (valitToken) {  
      req.authenticated = true;
      return next();
    }
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};
module.exports = { createTokens, validateToken };

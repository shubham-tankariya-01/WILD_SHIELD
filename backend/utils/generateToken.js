const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    {
      user_id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRE || "7d",
    }
  );
};

module.exports = generateToken;

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const TOKEN_COOKIE_NAME = "crm_token";
const TOKEN_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "2h";
const TOKEN_MAX_AGE_MS = Number(process.env.JWT_COOKIE_MAX_AGE_MS || 2 * 60 * 60 * 1000);

const getAuthCookieOptions = () => {
  // Production cross-site deployments need SameSite=None and Secure=true for cookies to work.
  const sameSite = process.env.COOKIE_SAME_SITE || (process.env.NODE_ENV === "production" ? "none" : "lax");
  const secure = process.env.COOKIE_SECURE
    ? process.env.COOKIE_SECURE === "true"
    : sameSite === "none" || process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure,
    sameSite,
    maxAge: TOKEN_MAX_AGE_MS,
    path: "/"
  };
};

const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (
      typeof email !== "string"
      || typeof password !== "string"
      || !["admin", "staff"].includes(role)
    ) {
      return res.status(400).json({ message: "Email, password, and role are required" });
    }

    const user = await User.findOne({
      where: { email: email.trim().toLowerCase(), role }
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Keep only non-sensitive user data in the token payload.
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: TOKEN_EXPIRES_IN }
    );

    res.cookie(TOKEN_COOKIE_NAME, token, getAuthCookieOptions());
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not log in",
      error: error.message
    });
  }
};

const logout = (req, res) => {
  res.clearCookie(TOKEN_COOKIE_NAME, {
    ...getAuthCookieOptions(),
    maxAge: undefined
  });
  res.json({ message: "Logged out successfully" });
};

module.exports = { login, logout, TOKEN_COOKIE_NAME };

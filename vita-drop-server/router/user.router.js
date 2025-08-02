const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//  internal modules
const userSchema = require("../schema/user.schema");
const tokenSchema = require("../schema/token.schema");
const { verifyToken } = require("../middlewares/token.middlewares");

// create a new user
router.post("/register", async (req, res) => {
  try {
    const { email } = req.body;
    const existingUser = await userSchema.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, error: "User already exists" });
    }
    const user = await userSchema.create(req.body);
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "15m", // Default to 15 minutes if not set
      }
    );
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      expires: new Date(
        Date.now() +
          (process.env.JWT_EXPIRES_IN
            ? parseInt(process.env.JWT_EXPIRES_IN) * 60 * 1000
            : 15 * 60 * 1000)
      ),
    }); // 15 minutes expiration
    const refreshToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
      }
    );

    await tokenSchema.create({
      userId: user._id,
      refreshToken: refreshToken,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days expiration
    });
    res.status(201).json({
      success: true,
      user: user,
      accessToken: accessToken,
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// user login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await userSchema.findOne({ email });
  if (!user) {
    return res.status(400).json({ success: false, error: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res
      .status(400)
      .json({ success: false, error: "Invalid credentials" });
  }

  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "15m" } // Default to 15 minutes if not set
  );

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    maxAge: 15 * 60 * 1000,
  });
  const refreshToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d" }
  );

  await tokenSchema.create({
    userId: user._id,
    refreshToken: refreshToken,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days expiration
  });

  res.status(200).json({
    success: true,
    user,
    accessToken,
    message: "Login successful",
  });
});

// get user profile
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await userSchema
      .findById(req.user.id)
      .select("-password -__v -account -createdAt -updatedAt -otp -isActive");
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;

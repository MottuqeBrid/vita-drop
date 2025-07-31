const express = require("express");
const userSchema = require("../schema/user.schema");
const router = express.Router();

// create a new user
router.post("/register", async (req, res) => {
  try {
    const user = await userSchema.create(req.body);
    res.status(201).json({
      success: true,
      user: user,
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});
// get single user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await userSchema.findById(req.params.id);
    res.status(200).json({ success: true, user: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;

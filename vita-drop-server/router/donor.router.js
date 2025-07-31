const express = require("express");
require("dotenv").config();

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Donor route" });
});

module.exports = router;

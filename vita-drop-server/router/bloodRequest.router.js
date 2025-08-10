const express = require("express");
const { verifyToken } = require("../middlewares/token.middlewares");
const bloodRequestSchema = require("../schema/bloodRequest.schema");
const router = express.Router();

router.post("/", verifyToken, async (req, res) => {
  const { bloodGroup, quantity, hospital, reasonForRequest } = req.body;

  try {
    const bloodRequest = await bloodRequestSchema.create({
      bloodGroup,
      quantity,
      hospital,
      reasonForRequest,
      userId: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Blood request created",
      data: bloodRequest,
    });
  } catch (error) {
    console.error("Error creating blood request:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.get("/", verifyToken, async (req, res) => {
  try {
    const bloodRequests = await bloodRequestSchema.find({
      userId: req.user.id,
    });
    res.status(200).json({ success: true, data: bloodRequests });
  } catch (error) {
    console.error("Error fetching blood requests:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const bloodRequest = await bloodRequestSchema.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!bloodRequest) {
      return res.status(404).json({
        success: false,
        message: "Blood request not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blood request deleted",
    });
  } catch (error) {
    console.error("Error deleting blood request:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
router.put("/:id", verifyToken, async (req, res) => {
  const { bloodGroup, quantity, hospital, reasonForRequest } = req.body;

  try {
    const updatedBloodRequest = await bloodRequestSchema.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      {
        ...req.body,
        modifiedBy: {
          userId: req.user.id,
          modifiedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!updatedBloodRequest) {
      return res.status(404).json({
        success: false,
        message: "Blood request not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blood request updated",
      data: updatedBloodRequest,
    });
  } catch (error) {
    console.error("Error updating blood request:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.patch("/:id/fulfill", verifyToken, async (req, res) => {
  try {
    const fulfilledBloodRequest = await bloodRequestSchema.findOneAndUpdate(
      { _id: req.params.id },
      {
        status: "fulfilled",
        fulfilledAt: new Date(),
        fulfilledBy: req.user.id,
        modifiedBy: {
          userId: req.user.id,
          modifiedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!fulfilledBloodRequest) {
      return res.status(404).json({
        success: false,
        message: "Blood request not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blood request fulfilled",
      data: fulfilledBloodRequest,
    });
  } catch (error) {
    console.error("Error fulfilling blood request:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;

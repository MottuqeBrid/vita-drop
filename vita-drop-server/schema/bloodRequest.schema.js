const mongoose = require("mongoose");

const bloodRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    bloodGroup: {
      type: String,
      required: [true, "Blood group is required"],
      enum: {
        values: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        message: "Blood group must be one of: A+, A-, B+, B-, AB+, AB-, O+, O-",
      },
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
    },
    place: {
      type: String,
      required: [true, "Place is required"],
    },
    status: {
      type: String,
      enum: ["pending", "fulfilled", "cancelled"],
      default: "pending",
    },
    requestedAt: {
      type: Date,
      default: Date.now,
    },
    fulfilledAt: {
      type: Date,
    },
    cancelledAt: {
      type: Date,
    },
    fulfilledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    modifiedBy: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        modifiedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reasonForRequest: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BloodRequest", bloodRequestSchema);

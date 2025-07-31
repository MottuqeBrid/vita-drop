const mongoose = require("mongoose");

const donateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    bag: {
      type: Number,
      required: true,
      min: 0,
      default: 1,
    },
    group: {
      type: String,
      required: true,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    patientName: {
      type: String,
    },
    patientAge: {
      type: Number,
      min: 0,
    },
    disease: {
      type: String,
    },
    managedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    hospital: {
      name: String,
      address: String,
    },
    media: {
      type: String,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    note: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donate", donateSchema);

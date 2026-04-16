const mongoose = require("mongoose");

const donorResponseSchema = new mongoose.Schema(
  {
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BloodRequest",
      required: true,
      index: true,
    },
    notificationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Notification",
      default: null,
    },

    requesterUid: { type: String, required: true, index: true },
    donorUid: { type: String, required: true, index: true },

    donorName: { type: String, default: "" },
    donorEmail: { type: String, default: "" },
    donorPhone: { type: String, default: "" },

    status: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
      index: true,
    },

    responseMessage: { type: String, default: "" },
    respondedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

module.exports = mongoose.model("DonorResponse", donorResponseSchema);

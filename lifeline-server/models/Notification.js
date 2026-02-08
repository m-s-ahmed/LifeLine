const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    toUid: { type: String, required: true, index: true }, // যাকে পাঠানো হয়েছে
    fromUid: { type: String, default: "" }, // যিনি পাঠিয়েছেন
    type: { type: String, default: "blood_request" },

    title: { type: String, default: "" },
    message: { type: String, default: "" },

    // request ref
    requestId: { type: mongoose.Schema.Types.ObjectId, ref: "BloodRequest" },

    isRead: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Notification", notificationSchema);

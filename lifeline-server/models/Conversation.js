const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BloodRequest",
      required: true,
      index: true,
    },
    requesterUid: { type: String, required: true, index: true },
    donorUid: { type: String, required: true, index: true },

    requesterName: { type: String, default: "" },
    donorName: { type: String, default: "" },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

conversationSchema.index(
  { requestId: 1, requesterUid: 1, donorUid: 1 },
  { unique: true },
);

module.exports = mongoose.model("Conversation", conversationSchema);

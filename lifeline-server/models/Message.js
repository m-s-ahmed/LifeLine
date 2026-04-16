const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BloodRequest",
      required: true,
      index: true,
    },

    fromUid: { type: String, required: true, index: true },
    toUid: { type: String, required: true, index: true },

    text: { type: String, required: true },

    isRead: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Message", messageSchema);
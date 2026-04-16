const express = require("express");
const router = express.Router();

const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

router.get("/conversations/me", verifyFirebaseToken, async (req, res) => {
  try {
    const uid = req.user?.uid;

    const list = await Conversation.find({
      $or: [{ requesterUid: uid }, { donorUid: uid }],
    }).sort({ updatedAt: -1 });

    return res.json(list);
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Fetch conversations failed", error: e.message });
  }
});

router.get(
  "/messages/:conversationId",
  verifyFirebaseToken,
  async (req, res) => {
    try {
      const uid = req.user?.uid;
      const { conversationId } = req.params;

      const convo = await Conversation.findById(conversationId);
      if (!convo)
        return res.status(404).json({ message: "Conversation not found" });

      if (![convo.requesterUid, convo.donorUid].includes(uid)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const messages = await Message.find({ conversationId }).sort({
        createdAt: 1,
      });
      return res.json(messages);
    } catch (e) {
      return res
        .status(500)
        .json({ message: "Fetch messages failed", error: e.message });
    }
  },
);

router.post(
  "/messages/:conversationId",
  verifyFirebaseToken,
  async (req, res) => {
    try {
      const uid = req.user?.uid;
      const { conversationId } = req.params;
      const { text } = req.body || {};

      const convo = await Conversation.findById(conversationId);
      if (!convo)
        return res.status(404).json({ message: "Conversation not found" });

      if (![convo.requesterUid, convo.donorUid].includes(uid)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      if (!text?.trim()) {
        return res.status(400).json({ message: "Message text is required" });
      }

      const toUid =
        convo.requesterUid === uid ? convo.donorUid : convo.requesterUid;

      const message = await Message.create({
        conversationId,
        requestId: convo.requestId,
        fromUid: uid,
        toUid,
        text: text.trim(),
      });

      return res.status(201).json(message);
    } catch (e) {
      return res
        .status(500)
        .json({ message: "Send message failed", error: e.message });
    }
  },
);

router.get("/conversation-by-request/:requestId", verifyFirebaseToken, async (req, res) => {
  try {
    const uid = req.user?.uid;
    const { requestId } = req.params;

    const convo = await Conversation.findOne({
      requestId,
      $or: [{ requesterUid: uid }, { donorUid: uid }],
    });

    if (!convo) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    return res.json(convo);
  } catch (e) {
    return res.status(500).json({
      message: "Fetch conversation failed",
      error: e.message,
    });
  }
});
module.exports = router;

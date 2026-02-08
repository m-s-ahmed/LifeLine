// routes/notification.routes.js
const express = require("express");
const router = express.Router();

const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");
const Notification = require("../models/Notification");
const BloodRequest = require("../models/BloodRequest");

/**
 * POST /api/notifications/send
 * Send a blood request notification to a donor
 */
router.post("/send", verifyFirebaseToken, async (req, res) => {
  try {
    const fromUid = req.user?.uid;
    const { toUid, requestId } = req.body || {};

    if (!fromUid) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    if (!toUid || !requestId) {
      return res
        .status(400)
        .json({ message: "toUid and requestId are required" });
    }

    // ✅ validate blood request exists
    const reqDoc = await BloodRequest.findById(requestId).select(
      "bloodGroup district hospitalName neededDate status",
    );

    if (!reqDoc) {
      return res.status(404).json({ message: "Blood request not found" });
    }

    if (reqDoc.status && reqDoc.status !== "open") {
      return res
        .status(400)
        .json({ message: "Only open requests can be sent" });
    }

    // ✅ create notification
    const notification = await Notification.create({
      toUid,
      fromUid,
      type: "blood_request",
      requestId,
      title: "Blood Request",
      message: `${reqDoc.bloodGroup} needed at ${reqDoc.hospitalName} (${reqDoc.district})`,
      isRead: false,
    });

    return res.status(201).json({
      message: "Request sent successfully ✅",
      notification,
    });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Send request failed", error: e.message });
  }
});

/**
 * GET /api/notifications/me
 * Logged-in user's notifications (for navbar)
 */
router.get("/me", verifyFirebaseToken, async (req, res) => {
  try {
    const uid = req.user?.uid;

    const list = await Notification.find({ toUid: uid })
      .sort({ createdAt: -1 })
      .limit(50);

    return res.json(list);
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Fetch notifications failed", error: e.message });
  }
});

module.exports = router;

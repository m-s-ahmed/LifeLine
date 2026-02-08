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

    if (!fromUid) return res.status(401).json({ message: "Unauthorized user" });
    if (!toUid || !requestId)
      return res
        .status(400)
        .json({ message: "toUid and requestId are required" });

    // ✅ validate blood request exists
    const reqDoc = await BloodRequest.findById(requestId).select(
      "bloodGroup district hospitalName neededDate status",
    );

    if (!reqDoc)
      return res.status(404).json({ message: "Blood request not found" });

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
 * GET /api/notifications/me?limit=30
 * Logged-in user's notifications (for navbar)
 */
router.get("/me", verifyFirebaseToken, async (req, res) => {
  try {
    const uid = req.user?.uid;
    const limit = Math.min(Number(req.query.limit || 30), 100);

    const list = await Notification.find({ toUid: uid })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("requestId"); // ✅ so frontend can show request summary

    return res.json(list);
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Fetch notifications failed", error: e.message });
  }
});

/**
 * GET /api/notifications/unread-count
 */
router.get("/unread-count", verifyFirebaseToken, async (req, res) => {
  try {
    const uid = req.user?.uid;
    const unread = await Notification.countDocuments({
      toUid: uid,
      isRead: false,
    });
    return res.json({ unread });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Unread count failed", error: e.message });
  }
});

/**
 * PATCH /api/notifications/:id/read
 */
router.patch("/:id/read", verifyFirebaseToken, async (req, res) => {
  try {
    const uid = req.user?.uid;
    const n = await Notification.findById(req.params.id);
    if (!n) return res.status(404).json({ message: "Not found" });

    if (String(n.toUid) !== String(uid))
      return res.status(403).json({ message: "Forbidden" });

    if (!n.isRead) {
      n.isRead = true;
      await n.save();
    }

    return res.json({ message: "Marked read ✅" });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Mark read failed", error: e.message });
  }
});

/**
 * PATCH /api/notifications/mark-all-read/me
 */
router.patch("/mark-all-read/me", verifyFirebaseToken, async (req, res) => {
  try {
    const uid = req.user?.uid;
    await Notification.updateMany(
      { toUid: uid, isRead: false },
      { $set: { isRead: true } },
    );
    return res.json({ message: "All marked read ✅" });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Mark all read failed", error: e.message });
  }
});

/**
 * GET /api/notifications/:id
 * Single notification details (only owner)
 */
router.get("/:id", verifyFirebaseToken, async (req, res) => {
  try {
    const uid = req.user?.uid;

    const n = await Notification.findById(req.params.id).populate("requestId");
    if (!n) return res.status(404).json({ message: "Not found" });

    if (String(n.toUid) !== String(uid))
      return res.status(403).json({ message: "Forbidden" });

    return res.json(n);
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Details fetch failed", error: e.message });
  }
});

module.exports = router;

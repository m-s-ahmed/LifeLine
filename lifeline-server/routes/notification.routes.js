const express = require("express");
const router = express.Router();

const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");
const Notification = require("../models/Notification");
const BloodRequest = require("../models/BloodRequest");

// Send request -> create notification
router.post("/send", verifyFirebaseToken, async (req, res) => {
  try {
    const fromUid = req.user?.uid;
    const { toUid, requestId } = req.body || {};

    if (!toUid || !requestId) {
      return res.status(400).json({ message: "toUid and requestId required" });
    }

    const reqDoc = await BloodRequest.findById(requestId);
    if (!reqDoc) return res.status(404).json({ message: "Request not found" });

    if (String(reqDoc.requesterUid) !== String(fromUid)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const title = `Blood Request: ${reqDoc.bloodGroup} (${reqDoc.district || "-"})`;
    const message = `Need ${reqDoc.units || 1} unit(s) • Hospital: ${
      reqDoc.hospitalName || "-"
    } • Date: ${reqDoc.neededDate || "-"}`;

    const noti = await Notification.create({
      toUid,
      fromUid,
      type: "blood_request",
      title,
      message,
      requestId: reqDoc._id,
      isRead: false,
    });

    return res.status(201).json({ message: "Sent ✅", notification: noti });
  } catch (e) {
    return res.status(500).json({ message: "Send failed", error: e.message });
  }
});

// My notifications (list)
router.get("/me", verifyFirebaseToken, async (req, res) => {
  try {
    const uid = req.user?.uid;

    const limit = Math.min(Number(req.query.limit || 30), 50);

    const list = await Notification.find({ toUid: uid })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("requestId");

    return res.json(list);
  } catch (e) {
    return res.status(500).json({ message: "Fetch failed", error: e.message });
  }
});

// Unread count
router.get("/unread-count", verifyFirebaseToken, async (req, res) => {
  try {
    const uid = req.user?.uid;
    const count = await Notification.countDocuments({
      toUid: uid,
      isRead: false,
    });
    return res.json({ unread: count });
  } catch (e) {
    return res.status(500).json({ message: "Count failed", error: e.message });
  }
});

// Mark one read
router.patch("/:id/read", verifyFirebaseToken, async (req, res) => {
  try {
    const uid = req.user?.uid;
    const { id } = req.params;

    const doc = await Notification.findOneAndUpdate(
      { _id: id, toUid: uid },
      { isRead: true },
      { new: true },
    );

    if (!doc) return res.status(404).json({ message: "Not found" });
    return res.json({ message: "Read ✅", notification: doc });
  } catch (e) {
    return res.status(500).json({ message: "Update failed", error: e.message });
  }
});

// Mark all read
router.patch("/mark-all-read/me", verifyFirebaseToken, async (req, res) => {
  try {
    const uid = req.user?.uid;
    await Notification.updateMany(
      { toUid: uid, isRead: false },
      { isRead: true },
    );
    return res.json({ message: "All marked read ✅" });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Mark all failed", error: e.message });
  }
});

module.exports = router;

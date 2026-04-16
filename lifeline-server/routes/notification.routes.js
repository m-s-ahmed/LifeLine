// routes/notification.routes.js
const express = require("express");
const router = express.Router();

const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");
const Notification = require("../models/Notification");
const BloodRequest = require("../models/BloodRequest");
const DonorResponse = require("../models/DonorResponse");
const Conversation = require("../models/Conversation");

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

    // validate blood request exists
    const reqDoc = await BloodRequest.findById(requestId).select(
      "bloodGroup district hospitalName neededDate status number patientName reason",
    );

    if (!reqDoc)
      return res.status(404).json({ message: "Blood request not found" });

    if (reqDoc.status && reqDoc.status !== "approved") {
      return res
        .status(400)
        .json({ message: "Only open requests can be sent" });
    }
    // message: `${reqDoc.bloodGroup} needed at ${reqDoc.hospitalName} (${reqDoc.district})`,
    //create notification
    const notification = await Notification.create({
      toUid,
      fromUid,
      type: "blood_request",
      requestId,
      title: "Blood Request",
      message: `${reqDoc.bloodGroup} needed at ${reqDoc.hospitalName} (${reqDoc.district}) • Patient: ${
        reqDoc.patientName || "N/A"
      } • Reason: ${reqDoc.reason || "N/A"} • Contact: ${reqDoc.number || "N/A"}`,
      isRead: false,
    });

    return res.status(201).json({
      message: "Request sent successfully",
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
      .populate("requestId"); // so frontend can show request summary

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
 * PATCH /api/notifications/mark-all-read/me
 */
router.patch("/mark-all-read/me", verifyFirebaseToken, async (req, res) => {
  try {
    const uid = req.user?.uid;
    await Notification.updateMany(
      { toUid: uid, isRead: false },
      { $set: { isRead: true } },
    );
    return res.json({ message: "All marked read" });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Mark all read failed", error: e.message });
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

    return res.json({ message: "Marked read" });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Mark read failed", error: e.message });
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

/**
 * DELETE /api/notifications/clear/me
 * Delete all notifications of logged-in user
 */
router.delete("/clear/me", verifyFirebaseToken, async (req, res) => {
  try {
    const uid = req.user?.uid;
    await Notification.deleteMany({ toUid: uid });
    return res.json({ message: "All notifications cleared" });
  } catch (e) {
    return res.status(500).json({ message: "Clear failed", error: e.message });
  }
});

router.post("/:id/respond", verifyFirebaseToken, async (req, res) => {
  try {
    const uid = req.user?.uid;
    const { response, responseMessage } = req.body || {};

    if (!["accepted", "declined"].includes(response)) {
      return res.status(400).json({ message: "Invalid response type" });
    }

    const n = await Notification.findById(req.params.id).populate("requestId");
    if (!n) return res.status(404).json({ message: "Notification not found" });

    if (String(n.toUid) !== String(uid)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (n.type !== "blood_request_forwarded") {
      return res.status(400).json({
        message: "This notification is not respondable",
      });
    }

    const responseDoc = await DonorResponse.findOne({
      notificationId: n._id,
      donorUid: uid,
    });

    if (!responseDoc) {
      return res.status(404).json({ message: "Response record not found" });
    }

    if (responseDoc.status !== "pending") {
      return res.status(400).json({
        message: "You already responded to this request",
      });
    }

    responseDoc.status = response;
    responseDoc.responseMessage = responseMessage || "";
    responseDoc.respondedAt = new Date();
    await responseDoc.save();

    await Notification.create({
      toUid: responseDoc.requesterUid,
      fromUid: uid,
      type: response === "accepted" ? "donor_accepted" : "donor_declined",
      title:
        response === "accepted"
          ? "Donor Accepted Request"
          : "Donor Declined Request",
      message:
        response === "accepted"
          ? `${responseDoc.donorName || "A donor"} accepted your blood request.You can now start chatting.`
          : `${responseDoc.donorName || "A donor"} is not available to donate right now.`,
      requestId: n.requestId?._id || n.requestId,
      isRead: false,
    });

    let conversation = null;

    if (response === "accepted") {
      conversation = await Conversation.findOneAndUpdate(
        {
          requestId: n.requestId?._id || n.requestId,
          requesterUid: responseDoc.requesterUid,
          donorUid: uid,
        },
        {
          $setOnInsert: {
            requesterUid: responseDoc.requesterUid,
            donorUid: uid,
            requestId: n.requestId?._id || n.requestId,
            donorName: responseDoc.donorName || "",
            requesterName: n.requestId?.requesterName || "",
            isActive: true,
          },
        },
        { upsert: true, new: true },
      );
    }

    return res.json({
      message: `Request ${response} successfully`,
      response: responseDoc,
      conversationId: conversation?._id || null,
    });
  } catch (e) {
    return res.status(500).json({
      message: "Response failed",
      error: e.message,
    });
  }
});
module.exports = router;

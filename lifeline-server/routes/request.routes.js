const express = require("express");
const router = express.Router();

const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");
const BloodRequest = require("../models/BloodRequest");

// Create request (logged in user)
// Request will go to admin first
router.post("/", verifyFirebaseToken, async (req, res) => {
  try {
    const uid = req.user?.uid;
    const body = req.body || {};

    if (!body.bloodGroup) {
      return res.status(400).json({ message: "bloodGroup is required" });
    }

    // detect unusual activity: last 7 days request count
    const recentCount = await BloodRequest.countDocuments({
      requesterUid: uid,
      createdAt: {
        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    });

    const unusualActivity = recentCount >= 3;

    const doc = await BloodRequest.create({
      // requester
      requesterUid: uid,
      requesterName: body.requesterName || "",
      requesterEmail: body.requesterEmail || "",
      requesterPhone: body.requesterPhone || "",

      // donor info (if request is for a selected donor from Find Blood)
      donorUid: body.donorUid || "",
      donorName: body.donorName || "",
      donorEmail: body.donorEmail || "",
      donorPhone: body.donorPhone || "",

      // request info
      bloodGroup: body.bloodGroup,
      division: body.division || "",
      district: body.district || "",
      hospitalName: body.hospitalName || "",
      hospitalAddress: body.hospitalAddress || "",
      number: body.number || "",
      patientName: body.patientName || "",
      relation: body.relation || "",
      units: Number(body.units || 1),
      neededDate: body.neededDate || "",
      neededTime: body.neededTime || "",
      reason: body.reason || "",
      note: body.note || "",

      // admin flow
      status: "pending_admin",
      unusualActivity,
    });

    return res.status(201).json({
      message: "Request submitted for admin review",
      request: doc,
    });
  } catch (e) {
    return res.status(500).json({
      message: "Create failed",
      error: e.message,
    });
  }
});

// My requests
router.get("/me", verifyFirebaseToken, async (req, res) => {
  try {
    const uid = req.user?.uid;

    const list = await BloodRequest.find({ requesterUid: uid }).sort({
      createdAt: -1,
    });

    return res.json(list);
  } catch (e) {
    return res.status(500).json({
      message: "Fetch failed",
      error: e.message,
    });
  }
});

// Mark request completed (previously close)
router.patch("/:id/close", verifyFirebaseToken, async (req, res) => {
  try {
    const uid = req.user?.uid;
    const { id } = req.params;

    const doc = await BloodRequest.findOneAndUpdate(
      { _id: id, requesterUid: uid },
      { status: "completed" },
      { new: true },
    );

    if (!doc) {
      return res.status(404).json({ message: "Request not found" });
    }

    return res.json({
      message: "Request marked as completed",
      request: doc,
    });
  } catch (e) {
    return res.status(500).json({
      message: "Close failed",
      error: e.message,
    });
  }
});

// Delete request
router.delete("/:id", verifyFirebaseToken, async (req, res) => {
  try {
    const uid = req.user?.uid;
    const { id } = req.params;

    const ok = await BloodRequest.deleteOne({ _id: id, requesterUid: uid });

    if (!ok.deletedCount) {
      return res.status(404).json({ message: "Not found" });
    }

    return res.json({ message: "Deleted" });
  } catch (e) {
    return res.status(500).json({
      message: "Delete failed",
      error: e.message,
    });
  }
});

module.exports = router;

// previous
// const express = require("express");
// const router = express.Router();

// const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");
// const BloodRequest = require("../models/BloodRequest");

// // Create request (logged in user)
// router.post("/", verifyFirebaseToken, async (req, res) => {
//   try {
//     const uid = req.user?.uid;
//     const body = req.body || {};

//     if (!body.bloodGroup) {
//       return res.status(400).json({ message: "bloodGroup is required" });
//     }

//     const doc = await BloodRequest.create({
//       requesterUid: uid,
//       requesterName: body.requesterName || "",
//       requesterEmail: body.requesterEmail || "",
//       requesterPhone: body.requesterPhone || "",
//       bloodGroup: body.bloodGroup,
//       division: body.division || "",
//       district: body.district || "",
//       hospitalName: body.hospitalName || "",
//       hospitalAddress: body.hospitalAddress || "",
//       number: body.number || "",
//       patientName: body.patientName || "",
//       relation: body.relation || "",
//       units: Number(body.units || 1),
//       neededDate: body.neededDate || "",
//       neededTime: body.neededTime || "",
//       reason: body.reason || "",
//       note: body.note || "",
//       status: "open",
//     });

//     return res.status(201).json({ message: "Request created", request: doc });
//   } catch (e) {
//     return res.status(500).json({ message: "Create failed", error: e.message });
//   }
// });

// // My requests
// router.get("/me", verifyFirebaseToken, async (req, res) => {
//   try {
//     const uid = req.user?.uid;
//     const list = await BloodRequest.find({ requesterUid: uid }).sort({
//       createdAt: -1,
//     });
//     return res.json(list);
//   } catch (e) {
//     return res.status(500).json({ message: "Fetch failed", error: e.message });
//   }
// });

// // Close a request (mark closed)
// router.patch("/:id/close", verifyFirebaseToken, async (req, res) => {
//   try {
//     const uid = req.user?.uid;
//     const { id } = req.params;

//     const doc = await BloodRequest.findOneAndUpdate(
//       { _id: id, requesterUid: uid },
//       { status: "closed" },
//       { new: true },
//     );

//     if (!doc) return res.status(404).json({ message: "Request not found" });
//     return res.json({ message: "Request closed ", request: doc });
//   } catch (e) {
//     return res.status(500).json({ message: "Close failed", error: e.message });
//   }
// });

// // Delete request
// router.delete("/:id", verifyFirebaseToken, async (req, res) => {
//   try {
//     const uid = req.user?.uid;
//     const { id } = req.params;

//     const ok = await BloodRequest.deleteOne({ _id: id, requesterUid: uid });
//     if (!ok.deletedCount) return res.status(404).json({ message: "Not found" });

//     return res.json({ message: "Deleted" });
//   } catch (e) {
//     return res.status(500).json({ message: "Delete failed", error: e.message });
//   }
// });

// module.exports = router;

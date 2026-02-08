const express = require("express");
const router = express.Router();

const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");
const BloodRequest = require("../models/BloodRequest");

// Create request (logged in user)
router.post("/", verifyFirebaseToken, async (req, res) => {
  try {
    const uid = req.user?.uid;
    const body = req.body || {};

    if (!body.bloodGroup) {
      return res.status(400).json({ message: "bloodGroup is required" });
    }

    const doc = await BloodRequest.create({
      requesterUid: uid,
      requesterName: body.requesterName || "",
      requesterEmail: body.requesterEmail || "",
      requesterPhone: body.requesterPhone || "",
      bloodGroup: body.bloodGroup,
      division: body.division || "",
      district: body.district || "",
      hospitalName: body.hospitalName || "",
      hospitalAddress: body.hospitalAddress || "",
      patientName: body.patientName || "",
      relation: body.relation || "",
      units: Number(body.units || 1),
      neededDate: body.neededDate || "",
      neededTime: body.neededTime || "",
      reason: body.reason || "",
      note: body.note || "",
      status: "open",
    });

    return res
      .status(201)
      .json({ message: "Request created ✅", request: doc });
  } catch (e) {
    return res.status(500).json({ message: "Create failed", error: e.message });
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
    return res.status(500).json({ message: "Fetch failed", error: e.message });
  }
});

// Close a request (mark closed)
router.patch("/:id/close", verifyFirebaseToken, async (req, res) => {
  try {
    const uid = req.user?.uid;
    const { id } = req.params;

    const doc = await BloodRequest.findOneAndUpdate(
      { _id: id, requesterUid: uid },
      { status: "closed" },
      { new: true },
    );

    if (!doc) return res.status(404).json({ message: "Request not found" });
    return res.json({ message: "Request closed ✅", request: doc });
  } catch (e) {
    return res.status(500).json({ message: "Close failed", error: e.message });
  }
});

// Delete request
router.delete("/:id", verifyFirebaseToken, async (req, res) => {
  try {
    const uid = req.user?.uid;
    const { id } = req.params;

    const ok = await BloodRequest.deleteOne({ _id: id, requesterUid: uid });
    if (!ok.deletedCount) return res.status(404).json({ message: "Not found" });

    return res.json({ message: "Deleted ✅" });
  } catch (e) {
    return res.status(500).json({ message: "Delete failed", error: e.message });
  }
});

module.exports = router;

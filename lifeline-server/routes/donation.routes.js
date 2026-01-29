const express = require("express");
const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");
const Donation = require("../models/Donation");
const Donor = require("../models/Donor");

const router = express.Router();

/**
 * ✅ Add donation (protected)
 * POST /api/donations
 * body: { date, units, place, note }
 */
router.post("/", verifyFirebaseToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    const { date, units, place, note } = req.body;

    if (!date) return res.status(400).json({ message: "date is required" });

    const donor = await Donor.findOne({ uid });

    const doc = await Donation.create({
      uid,
      donorId: donor?._id,
      date: new Date(date),
      units: Number(units || 1),
      place: place || "",
      note: note || "",
    });

    res.status(201).json(doc);
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
});

/**
 * ✅ Get my donations (protected)
 * GET /api/donations/me
 */
router.get("/me", verifyFirebaseToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    const list = await Donation.find({ uid }).sort({ date: -1 }).limit(50);
    res.json(list);
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
});

/**
 * ✅ Delete donation (optional)
 * DELETE /api/donations/:id
 */
router.delete("/:id", verifyFirebaseToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    const { id } = req.params;

    const deleted = await Donation.findOneAndDelete({ _id: id, uid });
    if (!deleted) return res.status(404).json({ message: "Not found" });

    res.json({ message: "Deleted" });
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
});

module.exports = router;

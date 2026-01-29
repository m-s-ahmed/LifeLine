const express = require("express");
const Donor = require("../models/Donor");
const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");

const router = express.Router();

// Create/Upsert donor profile (protected)
router.put("/me", verifyFirebaseToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    const emailFromToken = req.user.email;

    const payload = { ...req.body, uid, email: emailFromToken };

    const donor = await Donor.findOneAndUpdate(
      { uid },
      { $set: payload },
      { new: true, upsert: true },
    );

    res.json(donor);
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
});

router.get("/me", verifyFirebaseToken, async (req, res) => {
  try {
    const donor = await Donor.findOne({ uid: req.user.uid });
    res.json(donor || null);
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
});

module.exports = router;

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

// Get my donor profile
router.get("/me", verifyFirebaseToken, async (req, res) => {
  try {
    const donor = await Donor.findOne({ uid: req.user.uid });
    res.json(donor || null);
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
});

// Admin check
router.get("/admin-check", verifyFirebaseToken, async (req, res) => {
  try {
    const email = req.query.email;

    if (!email) {
      return res.status(400).json({
        isAdmin: false,
        message: "Email is required",
      });
    }

    const donor = await Donor.findOne({ email });

    return res.json({
      isAdmin: donor?.role === "admin",
    });
  } catch (e) {
    return res.status(500).json({
      isAdmin: false,
      message: "Failed to check admin role",
      error: e.message,
    });
  }
});

module.exports = router;

// previous version
// const express = require("express");
// const Donor = require("../models/Donor");
// const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");

// const router = express.Router();

// // Create/Upsert donor profile (protected)
// router.put("/me", verifyFirebaseToken, async (req, res) => {
//   try {
//     const uid = req.user.uid;
//     const emailFromToken = req.user.email;

//     const payload = { ...req.body, uid, email: emailFromToken };

//     const donor = await Donor.findOneAndUpdate(
//       { uid },
//       { $set: payload },
//       { new: true, upsert: true },
//     );

//     res.json(donor);
//   } catch (e) {
//     res.status(500).json({ message: "Server error", error: e.message });
//   }
// });

// router.get("/me", verifyFirebaseToken, async (req, res) => {
//   try {
//     const donor = await Donor.findOne({ uid: req.user.uid });
//     res.json(donor || null);
//   } catch (e) {
//     res.status(500).json({ message: "Server error", error: e.message });
//   }
// });

// module.exports = router;

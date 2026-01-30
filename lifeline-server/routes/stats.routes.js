const express = require("express");
const router = express.Router();

const Donor = require("../models/Donor");
const Feedback = require("../models/Feedback");

// GET /api/stats/public  -> AboutUs stats
router.get("/public", async (req, res) => {
  try {
    const donorsCount = await Donor.countDocuments();

    const districts = await Donor.distinct("district");
    const districtCoverage = (districts || []).filter(Boolean).length;

    const feedbackCount = await Feedback.countDocuments();

    return res.json({
      donorsCount,
      districtCoverage,
      feedbackCount,
    });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Stats fetch failed", error: e.message });
  }
});

module.exports = router;

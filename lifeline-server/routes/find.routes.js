const express = require("express");
const Donor = require("../models/Donor");

const router = express.Router();

// GET /api/find/donors?bloodGroup=A+&district=Rajshahi&division=Rajshahi
router.get("/donors", async (req, res) => {
  try {
    const { bloodGroup, district, division, availableOnly } = req.query;

    const match = {};
    if (bloodGroup) match.bloodGroup = bloodGroup;
    if (district) match.district = district;
    if (division) match.division = division;

    const pipeline = [
      { $match: match },

      // ✅ Join with donations collection
      {
        $lookup: {
          from: "donations", // collection name must match (usually plural)
          localField: "_id",
          foreignField: "donorId",
          as: "donations",
        },
      },

      // ✅ latest donation বের করা (max date)
      {
        $addFields: {
          lastDonationDate: { $max: "$donations.date" },
        },
      },

      // ✅ projection (privacy)
      {
        $project: {
          _id: 1,
          uid: 1,
          firstName: 1,
          lastName: 1,
          phone: 1,
          bloodGroup: 1,
          district: 1,
          division: 1,
          lastDonationMonth: 1,
          lastDonationYear: 1,
          lastDonationDate: 1,
          updatedAt: 1,
        },
      },

      { $sort: { updatedAt: -1 } },
      { $limit: 80 },
    ];

    let donors = await Donor.aggregate(pipeline);

    // ✅ availableOnly filter (3 months rule using lastDonationDate)
    if (availableOnly === "true") {
      const now = new Date();
      donors = donors.filter((d) => {
        if (!d.lastDonationDate) return true; // no history => show as available (you can change)
        const diffDays = Math.floor(
          (now - new Date(d.lastDonationDate)) / (1000 * 60 * 60 * 24),
        );
        return diffDays >= 90; // 3 months ~ 90 days
      });
    }

    res.json(donors);
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
});

module.exports = router;

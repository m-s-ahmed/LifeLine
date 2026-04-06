// const express = require("express");
// const router = express.Router();

// const BloodRequest = require("../models/BloodRequest");
// const Notification = require("../models/Notification");
// const Donor = require("../models/Donor");

// const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");
// const verifyAdmin = require("../middleware/verifyAdmin");

// // GET all pending requests for admin review
// router.get("/requests", verifyFirebaseToken, verifyAdmin, async (req, res) => {
//   try {
//     const requests = await BloodRequest.find({
//       status: "pending_admin",
//     }).sort({ createdAt: -1 });

//     const enriched = await Promise.all(
//       requests.map(async (r) => {
//         const totalRequests = await BloodRequest.countDocuments({
//           requesterUid: r.requesterUid,
//         });

//         const recentRequests = await BloodRequest.countDocuments({
//           requesterUid: r.requesterUid,
//           createdAt: {
//             $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
//           },
//         });

//         return {
//           ...r.toObject(),
//           totalRequests,
//           recentRequests,
//         };
//       }),
//     );

//     return res.json(enriched);
//   } catch (error) {
//     return res.status(500).json({
//       message: "Failed to load admin requests",
//       error: error.message,
//     });
//   }
// });

// // APPROVE request
// router.patch(
//   "/requests/:id/approve",
//   verifyFirebaseToken,
//   verifyAdmin,
//   async (req, res) => {
//     try {
//       const { id } = req.params;
//       const { note } = req.body || {};

//       const request = await BloodRequest.findById(id);

//       if (!request) {
//         return res.status(404).json({ message: "Request not found" });
//       }

//       request.status = "approved";
//       request.adminReviewedBy = req.adminUser.email || "";
//       request.adminReviewedAt = new Date();
//       request.adminNote = note || "";
//       await request.save();

//       // notify donor only after admin approval
//       if (request.donorUid) {
//         await Notification.create({
//           toUid: request.donorUid,
//           fromUid: req.adminUser.uid || "",
//           type: "approval",
//           title: "Blood Request Approved",
//           message: `${
//             request.requesterName || "A requester"
//           } has sent a verified blood request for ${
//             request.bloodGroup
//           }. Please check the details.`,
//           requestId: request._id,
//           isRead: false,
//         });
//       }

//       // notify requester
//       await Notification.create({
//         toUid: request.requesterUid,
//         fromUid: req.adminUser.uid || "",
//         type: "approval",
//         title: "Request Approved",
//         message:
//           "Your blood request has been approved by admin and forwarded to the donor.",
//         requestId: request._id,
//         isRead: false,
//       });

//       return res.json({ message: "Request approved successfully" });
//     } catch (error) {
//       return res.status(500).json({
//         message: "Failed to approve request",
//         error: error.message,
//       });
//     }
//   },
// );

// // REJECT request
// router.patch(
//   "/requests/:id/reject",
//   verifyFirebaseToken,
//   verifyAdmin,
//   async (req, res) => {
//     try {
//       const { id } = req.params;
//       const { note } = req.body || {};

//       const request = await BloodRequest.findById(id);

//       if (!request) {
//         return res.status(404).json({ message: "Request not found" });
//       }

//       request.status = "rejected";
//       request.adminReviewedBy = req.adminUser.email || "";
//       request.adminReviewedAt = new Date();
//       request.adminNote = note || "";
//       await request.save();

//       await Notification.create({
//         toUid: request.requesterUid,
//         fromUid: req.adminUser.uid || "",
//         type: "rejection",
//         title: "Request Rejected",
//         message:
//           note ||
//           "Your blood request was rejected by admin. Please review your information and try again.",
//         requestId: request._id,
//         isRead: false,
//       });

//       return res.json({ message: "Request rejected successfully" });
//     } catch (error) {
//       return res.status(500).json({
//         message: "Failed to reject request",
//         error: error.message,
//       });
//     }
//   },
// );

// // SEND WARNING TO USER
// router.post(
//   "/users/:uid/warn",
//   verifyFirebaseToken,
//   verifyAdmin,
//   async (req, res) => {
//     try {
//       const { uid } = req.params;
//       const { message } = req.body || {};

//       const donor = await Donor.findOne({ uid });

//       if (!donor) {
//         return res.status(404).json({ message: "User not found" });
//       }

//       donor.warningCount = (donor.warningCount || 0) + 1;
//       donor.lastWarningMessage =
//         message || "Unusual activity detected. Please follow platform rules.";
//       await donor.save();

//       await Notification.create({
//         toUid: uid,
//         fromUid: req.adminUser.uid || "",
//         type: "warning",
//         title: "Warning from Admin",
//         message:
//           message || "Unusual activity detected. Please follow platform rules.",
//         isRead: false,
//       });

//       return res.json({ message: "Warning sent successfully" });
//     } catch (error) {
//       return res.status(500).json({
//         message: "Failed to send warning",
//         error: error.message,
//       });
//     }
//   },
// );

// module.exports = router;

const express = require("express");
const router = express.Router();

const BloodRequest = require("../models/BloodRequest");
const Notification = require("../models/Notification");
const Donor = require("../models/Donor");

const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");
const verifyAdmin = require("../middleware/verifyAdmin");

// -------- helper: donor availability check --------
const MONTH_INDEX = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

function buildLastDonationDate(donor) {
  if (donor.lastDonationDate) {
    const dt = new Date(donor.lastDonationDate);
    return Number.isNaN(dt.getTime()) ? null : dt;
  }

  const m = donor.lastDonationMonth;
  const y = donor.lastDonationYear;

  if (!m || !y) return null;

  const mi = MONTH_INDEX[m];
  const yi = Number(y);

  if (mi === undefined || Number.isNaN(yi)) return null;

  return new Date(yi, mi, 1);
}

function isDonorAvailable(donor) {
  const lastDonationDate = buildLastDonationDate(donor);

  // if no donation history, treat as not eligible for auto-forward
  if (!lastDonationDate) return false;

  const diffDays = Math.floor(
    (Date.now() - lastDonationDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (Number.isNaN(diffDays) || diffDays < 0) return false;

  return diffDays >= 90;
}

// GET all pending requests for admin review
router.get("/requests", verifyFirebaseToken, verifyAdmin, async (req, res) => {
  try {
    const requests = await BloodRequest.find({
      status: "pending_admin",
    }).sort({ createdAt: -1 });

    const enriched = await Promise.all(
      requests.map(async (r) => {
        const totalRequests = await BloodRequest.countDocuments({
          requesterUid: r.requesterUid,
        });

        const recentRequests = await BloodRequest.countDocuments({
          requesterUid: r.requesterUid,
          createdAt: {
            $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        });

        return {
          ...r.toObject(),
          totalRequests,
          recentRequests,
        };
      }),
    );

    return res.json(enriched);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to load admin requests",
      error: error.message,
    });
  }
});

// APPROVE request
router.patch(
  "/requests/:id/approve",
  verifyFirebaseToken,
  verifyAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { note } = req.body || {};

      const request = await BloodRequest.findById(id);

      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }

      request.status = "approved";
      request.adminReviewedBy = req.adminUser.email || "";
      request.adminReviewedAt = new Date();
      request.adminNote = note || "";
      await request.save();

      // requester notification
      await Notification.create({
        toUid: request.requesterUid,
        fromUid: req.adminUser.uid || "",
        type: "approval",
        title: "Request Approved",
        message:
          "Your blood request has been approved by admin and forwarded to matching available donors.",
        requestId: request._id,
        isRead: false,
      });

      // find matching donors
      const candidateDonors = await Donor.find({
        bloodGroup: request.bloodGroup,
        division: request.division,
        district: request.district,
      });

      const matchedAvailableDonors = candidateDonors.filter((donor) => {
        // requester নিজে donor list-এ থাকলে তাকে notify করো না
        if (donor.uid === request.requesterUid) return false;

        return isDonorAvailable(donor);
      });

      // create notifications for all matching available donors
      if (matchedAvailableDonors.length > 0) {
        const notifications = matchedAvailableDonors.map((donor) => ({
          toUid: donor.uid,
          fromUid: req.adminUser.uid || "",
          type: "blood_request_forwarded",
          title: "New Approved Blood Request",
          message:
            `${request.requesterName || "A requester"} needs ${request.bloodGroup} blood.` +
            ` Location: ${request.district || "-"}, ${request.division || "-"}.` +
            ` Hospital: ${request.hospitalName || "-"}.` +
            ` Needed: ${request.neededDate || "-"}${request.neededTime ? ` at ${request.neededTime}` : ""}.`,
          requestId: request._id,
          isRead: false,
        }));

        await Notification.insertMany(notifications);
      }

      return res.json({
        message: "Request approved and forwarded to matching available donors",
        notifiedDonors: matchedAvailableDonors.length,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed to approve request",
        error: error.message,
      });
    }
  },
);

// REJECT request
router.patch(
  "/requests/:id/reject",
  verifyFirebaseToken,
  verifyAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { note } = req.body || {};

      const request = await BloodRequest.findById(id);

      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }

      request.status = "rejected";
      request.adminReviewedBy = req.adminUser.email || "";
      request.adminReviewedAt = new Date();
      request.adminNote = note || "";
      await request.save();

      await Notification.create({
        toUid: request.requesterUid,
        fromUid: req.adminUser.uid || "",
        type: "rejection",
        title: "Request Rejected",
        message:
          note ||
          "Your blood request was rejected by admin. Please review your information and try again.",
        requestId: request._id,
        isRead: false,
      });

      return res.json({ message: "Request rejected successfully" });
    } catch (error) {
      return res.status(500).json({
        message: "Failed to reject request",
        error: error.message,
      });
    }
  },
);

// SEND WARNING TO USER
router.post(
  "/users/:uid/warn",
  verifyFirebaseToken,
  verifyAdmin,
  async (req, res) => {
    try {
      const { uid } = req.params;
      const { message } = req.body || {};

      const donor = await Donor.findOne({ uid });

      if (!donor) {
        return res.status(404).json({ message: "User not found" });
      }

      donor.warningCount = (donor.warningCount || 0) + 1;
      donor.lastWarningMessage =
        message || "Unusual activity detected. Please follow platform rules.";
      await donor.save();

      await Notification.create({
        toUid: uid,
        fromUid: req.adminUser.uid || "",
        type: "warning",
        title: "Warning from Admin",
        message:
          message || "Unusual activity detected. Please follow platform rules.",
        isRead: false,
      });

      return res.json({ message: "Warning sent successfully" });
    } catch (error) {
      return res.status(500).json({
        message: "Failed to send warning",
        error: error.message,
      });
    }
  },
);

module.exports = router;

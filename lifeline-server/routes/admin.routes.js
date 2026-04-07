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

// another changes
// const express = require("express");
// const router = express.Router();

// const BloodRequest = require("../models/BloodRequest");
// const Notification = require("../models/Notification");
// const Donor = require("../models/Donor");

// const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");
// const verifyAdmin = require("../middleware/verifyAdmin");

// // -------- helper: donor availability check --------
// const MONTH_INDEX = {
//   Jan: 0,
//   Feb: 1,
//   Mar: 2,
//   Apr: 3,
//   May: 4,
//   Jun: 5,
//   Jul: 6,
//   Aug: 7,
//   Sep: 8,
//   Oct: 9,
//   Nov: 10,
//   Dec: 11,
// };

// function buildLastDonationDate(donor) {
//   if (donor.lastDonationDate) {
//     const dt = new Date(donor.lastDonationDate);
//     return Number.isNaN(dt.getTime()) ? null : dt;
//   }

//   const m = donor.lastDonationMonth;
//   const y = donor.lastDonationYear;

//   if (!m || !y) return null;

//   const mi = MONTH_INDEX[m];
//   const yi = Number(y);

//   if (mi === undefined || Number.isNaN(yi)) return null;

//   return new Date(yi, mi, 1);
// }

// function isDonorAvailable(donor) {
//   const lastDonationDate = buildLastDonationDate(donor);

//   // if no donation history, treat as not eligible for auto-forward
//   if (!lastDonationDate) return false;

//   const diffDays = Math.floor(
//     (Date.now() - lastDonationDate.getTime()) / (1000 * 60 * 60 * 24),
//   );

//   if (Number.isNaN(diffDays) || diffDays < 0) return false;

//   return diffDays >= 90;
// }

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

//       // requester notification
//       await Notification.create({
//         toUid: request.requesterUid,
//         fromUid: req.adminUser.uid || "",
//         type: "approval",
//         title: "Request Approved",
//         message:
//           "Your blood request has been approved by admin and forwarded to matching available donors.",
//         requestId: request._id,
//         isRead: false,
//       });

//       // find matching donors
//       const candidateDonors = await Donor.find({
//         bloodGroup: request.bloodGroup,
//         division: request.division,
//         district: request.district,
//       });

//       const matchedAvailableDonors = candidateDonors.filter((donor) => {
//         // requester নিজে donor list-এ থাকলে তাকে notify করো না
//         if (donor.uid === request.requesterUid) return false;

//         return isDonorAvailable(donor);
//       });

//       // create notifications for all matching available donors
//       if (matchedAvailableDonors.length > 0) {
//         const notifications = matchedAvailableDonors.map((donor) => ({
//           toUid: donor.uid,
//           fromUid: req.adminUser.uid || "",
//           type: "blood_request_forwarded",
//           title: "New Approved Blood Request",
//           message:
//             `${request.requesterName || "A requester"} needs ${request.bloodGroup} blood.` +
//             ` Location: ${request.district || "-"}, ${request.division || "-"}.` +
//             ` Hospital: ${request.hospitalName || "-"}.` +
//             ` Needed: ${request.neededDate || "-"}${request.neededTime ? ` at ${request.neededTime}` : ""}.`,
//           requestId: request._id,
//           isRead: false,
//         }));

//         await Notification.insertMany(notifications);
//       }

//       return res.json({
//         message: "Request approved and forwarded to matching available donors",
//         notifiedDonors: matchedAvailableDonors.length,
//       });
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

// 07/07/2026
// const express = require("express");
// const router = express.Router();

// const BloodRequest = require("../models/BloodRequest");
// const Notification = require("../models/Notification");
// const Donor = require("../models/Donor");

// const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");
// const verifyAdmin = require("../middleware/verifyAdmin");

// const MONTH_INDEX = {
//   Jan: 0,
//   Feb: 1,
//   Mar: 2,
//   Apr: 3,
//   May: 4,
//   Jun: 5,
//   Jul: 6,
//   Aug: 7,
//   Sep: 8,
//   Oct: 9,
//   Nov: 10,
//   Dec: 11,
// };

// function buildLastDonationDate(donor) {
//   if (donor.lastDonationDate) {
//     const dt = new Date(donor.lastDonationDate);
//     return Number.isNaN(dt.getTime()) ? null : dt;
//   }

//   const m = donor.lastDonationMonth;
//   const y = donor.lastDonationYear;

//   if (!m || !y) return null;

//   const mi = MONTH_INDEX[m];
//   const yi = Number(y);

//   if (mi === undefined || Number.isNaN(yi)) return null;

//   return new Date(yi, mi, 1);
// }

// function isDonorAvailable(donor) {
//   const lastDonationDate = buildLastDonationDate(donor);
//   if (!lastDonationDate) return false;

//   const diffDays = Math.floor(
//     (Date.now() - lastDonationDate.getTime()) / (1000 * 60 * 60 * 24),
//   );

//   if (Number.isNaN(diffDays) || diffDays < 0) return false;

//   return diffDays >= 90;
// }

// // GET pending requests
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

// // APPROVE request (only approve + requester notify)
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

//       // requester notification only
//       await Notification.create({
//         toUid: request.requesterUid,
//         fromUid: req.adminUser.uid || "",
//         type: "approval",
//         title: "Request Approved",
//         message:
//           "Your blood request has been approved by admin. Matching donor selection is in progress.",
//         requestId: request._id,
//         isRead: false,
//       });

//       return res.json({
//         message: "Request approved successfully",
//         requestId: request._id,
//       });
//     } catch (error) {
//       return res.status(500).json({
//         message: "Failed to approve request",
//         error: error.message,
//       });
//     }
//   },
// );

// // GET matching donors for a request
// router.get(
//   "/requests/:id/matching-donors",
//   verifyFirebaseToken,
//   verifyAdmin,
//   async (req, res) => {
//     try {
//       const { id } = req.params;

//       const request = await BloodRequest.findById(id);
//       if (!request) {
//         return res.status(404).json({ message: "Request not found" });
//       }

//       const candidateDonors = await Donor.find({
//         bloodGroup: request.bloodGroup,
//         division: request.division,
//         district: request.district,
//       }).sort({ createdAt: -1 });

//       const matchedDonors = candidateDonors
//         .filter((donor) => donor.uid !== request.requesterUid)
//         .map((donor) => {
//           const available = isDonorAvailable(donor);
//           return {
//             ...donor.toObject(),
//             available,
//           };
//         })
//         .filter((donor) => donor.available);

//       return res.json({
//         request,
//         donors: matchedDonors,
//       });
//     } catch (error) {
//       return res.status(500).json({
//         message: "Failed to load matching donors",
//         error: error.message,
//       });
//     }
//   },
// );

// // send notification to one donor
// router.post(
//   "/requests/:id/notify-donor/:uid",
//   verifyFirebaseToken,
//   verifyAdmin,
//   async (req, res) => {
//     try {
//       const { id, uid } = req.params;

//       const request = await BloodRequest.findById(id);
//       if (!request) {
//         return res.status(404).json({ message: "Request not found" });
//       }

//       const donor = await Donor.findOne({ uid });
//       if (!donor) {
//         return res.status(404).json({ message: "Donor not found" });
//       }

//       await Notification.create({
//         toUid: donor.uid,
//         fromUid: req.adminUser.uid || "",
//         type: "blood_request_forwarded",
//         title: "Approved Blood Request",
//         message:
//           `${request.requesterName || "A requester"} needs ${
//             request.bloodGroup
//           } blood. ` +
//           `Location: ${request.district || "-"}, ${request.division || "-"}. ` +
//           `Hospital: ${request.hospitalName || "-"}. ` +
//           `Needed: ${request.neededDate || "-"}${
//             request.neededTime ? ` at ${request.neededTime}` : ""
//           }.`,
//         requestId: request._id,
//         isRead: false,
//       });

//       return res.json({ message: "Notification sent to donor successfully" });
//     } catch (error) {
//       return res.status(500).json({
//         message: "Failed to notify donor",
//         error: error.message,
//       });
//     }
//   },
// );

// // send notification to all matching donors
// router.post(
//   "/requests/:id/notify-all-matching",
//   verifyFirebaseToken,
//   verifyAdmin,
//   async (req, res) => {
//     try {
//       const { id } = req.params;

//       const request = await BloodRequest.findById(id);
//       if (!request) {
//         return res.status(404).json({ message: "Request not found" });
//       }

//       const candidateDonors = await Donor.find({
//         bloodGroup: request.bloodGroup,
//         division: request.division,
//         district: request.district,
//       });

//       const matchedDonors = candidateDonors.filter((donor) => {
//         if (donor.uid === request.requesterUid) return false;
//         return isDonorAvailable(donor);
//       });

//       if (!matchedDonors.length) {
//         return res.json({
//           message: "No matching available donors found",
//           count: 0,
//         });
//       }

//       const notifications = matchedDonors.map((donor) => ({
//         toUid: donor.uid,
//         fromUid: req.adminUser.uid || "",
//         type: "blood_request_forwarded",
//         title: "Approved Blood Request",
//         message:
//           `${request.requesterName || "A requester"} needs ${
//             request.bloodGroup
//           } blood. ` +
//           `Location: ${request.district || "-"}, ${request.division || "-"}. ` +
//           `Hospital: ${request.hospitalName || "-"}. ` +
//           `Needed: ${request.neededDate || "-"}${
//             request.neededTime ? ` at ${request.neededTime}` : ""
//           }.`,
//         requestId: request._id,
//         isRead: false,
//       }));

//       await Notification.insertMany(notifications);

//       return res.json({
//         message: "Notification sent to all matching donors successfully",
//         count: matchedDonors.length,
//       });
//     } catch (error) {
//       return res.status(500).json({
//         message: "Failed to notify all matching donors",
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
  if (!lastDonationDate) return false;

  const diffDays = Math.floor(
    (Date.now() - lastDonationDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (Number.isNaN(diffDays) || diffDays < 0) return false;

  return diffDays >= 90;
}

// ---------------------- REQUEST REVIEW ----------------------

// pending requests
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

// approve request (requester only gets approval notification here)
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

      await Notification.create({
        toUid: request.requesterUid,
        fromUid: req.adminUser.uid || "",
        type: "approval",
        title: "Request Approved",
        message:
          "Your blood request has been approved by admin. Matching donor notification is now ready to send.",
        requestId: request._id,
        isRead: false,
      });

      return res.json({
        message: "Request approved successfully",
        requestId: request._id,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed to approve request",
        error: error.message,
      });
    }
  },
);

// get matching donors
router.get(
  "/requests/:id/matching-donors",
  verifyFirebaseToken,
  verifyAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;

      const request = await BloodRequest.findById(id);
      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }

      const candidateDonors = await Donor.find({
        bloodGroup: request.bloodGroup,
        division: request.division,
        district: request.district,
      }).sort({ createdAt: -1 });

      const donors = candidateDonors
        .filter((donor) => donor.uid !== request.requesterUid)
        .map((donor) => ({
          ...donor.toObject(),
          available: isDonorAvailable(donor),
        }))
        .filter((donor) => donor.available);

      return res.json({
        request,
        donors,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed to load matching donors",
        error: error.message,
      });
    }
  },
);

// notify single donor
router.post(
  "/requests/:id/notify-donor/:uid",
  verifyFirebaseToken,
  verifyAdmin,
  async (req, res) => {
    try {
      const { id, uid } = req.params;

      const request = await BloodRequest.findById(id);
      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }

      const donor = await Donor.findOne({ uid });
      if (!donor) {
        return res.status(404).json({ message: "Donor not found" });
      }

      await Notification.create({
        toUid: donor.uid,
        fromUid: req.adminUser.uid || "",
        type: "blood_request_forwarded",
        title: "Approved Blood Request",
        message:
          `${request.requesterName || "A requester"} needs ${request.bloodGroup} blood. ` +
          `Location: ${request.district || "-"}, ${request.division || "-"}. ` +
          `Hospital: ${request.hospitalName || "-"}. ` +
          `Patient: ${request.patientName || "-"}. ` +
          `Needed: ${request.neededDate || "-"}${
            request.neededTime ? ` at ${request.neededTime}` : ""
          }.`,
        requestId: request._id,
        isRead: false,
      });

      return res.json({
        message: "Notification sent successfully",
        donorName: `${donor.firstName || ""} ${donor.lastName || ""}`.trim(),
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed to notify donor",
        error: error.message,
      });
    }
  },
);

// notify all matching donors
router.post(
  "/requests/:id/notify-all-matching",
  verifyFirebaseToken,
  verifyAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;

      const request = await BloodRequest.findById(id);
      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }

      const candidateDonors = await Donor.find({
        bloodGroup: request.bloodGroup,
        division: request.division,
        district: request.district,
      });

      const matchedDonors = candidateDonors.filter((donor) => {
        if (donor.uid === request.requesterUid) return false;
        return isDonorAvailable(donor);
      });

      if (!matchedDonors.length) {
        return res.json({
          message: "No matching available donors found",
          count: 0,
        });
      }

      const notifications = matchedDonors.map((donor) => ({
        toUid: donor.uid,
        fromUid: req.adminUser.uid || "",
        type: "blood_request_forwarded",
        title: "Approved Blood Request",
        message:
          `${request.requesterName || "A requester"} needs ${request.bloodGroup} blood. ` +
          `Location: ${request.district || "-"}, ${request.division || "-"}. ` +
          `Hospital: ${request.hospitalName || "-"}. ` +
          `Patient: ${request.patientName || "-"}. ` +
          `Needed: ${request.neededDate || "-"}${
            request.neededTime ? ` at ${request.neededTime}` : ""
          }.`,
        requestId: request._id,
        isRead: false,
      }));

      await Notification.insertMany(notifications);

      return res.json({
        message: "Notification sent successfully",
        count: matchedDonors.length,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed to notify all matching donors",
        error: error.message,
      });
    }
  },
);

// reject request
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

// warning
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

// ---------------------- DONOR EXPLORER ----------------------

// donor explorer list
router.get("/donors", verifyFirebaseToken, verifyAdmin, async (req, res) => {
  try {
    const { bloodGroup, division, district } = req.query;

    const filter = {};
    if (bloodGroup) filter.bloodGroup = bloodGroup;
    if (division) filter.division = division;
    if (district) filter.district = district;

    const donors = await Donor.find(filter).sort({ createdAt: -1 });

    const enriched = donors.map((donor) => ({
      ...donor.toObject(),
      available: isDonorAvailable(donor),
    }));

    return res.json(enriched);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to load donors",
      error: error.message,
    });
  }
});

// direct notify donor from explorer
router.post(
  "/donors/:uid/notify",
  verifyFirebaseToken,
  verifyAdmin,
  async (req, res) => {
    try {
      const { uid } = req.params;
      const { title, message } = req.body || {};

      if (!title || !message) {
        return res
          .status(400)
          .json({ message: "Title and message are required" });
      }

      const donor = await Donor.findOne({ uid });
      if (!donor) {
        return res.status(404).json({ message: "Donor not found" });
      }

      await Notification.create({
        toUid: uid,
        fromUid: req.adminUser.uid || "",
        type: "admin_direct",
        title,
        message,
        isRead: false,
      });

      return res.json({
        message: "Notification sent successfully",
        donorName: `${donor.firstName || ""} ${donor.lastName || ""}`.trim(),
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed to send notification",
        error: error.message,
      });
    }
  },
);

// ---------------------- ANALYTICS ----------------------

router.get("/analytics", verifyFirebaseToken, verifyAdmin, async (req, res) => {
  try {
    const totalDonors = await Donor.countDocuments();
    const totalRequests = await BloodRequest.countDocuments();

    const pendingRequests = await BloodRequest.countDocuments({
      status: "pending_admin",
    });

    const approvedRequests = await BloodRequest.countDocuments({
      status: "approved",
    });

    const rejectedRequests = await BloodRequest.countDocuments({
      status: "rejected",
    });

    const completedRequests = await BloodRequest.countDocuments({
      status: "completed",
    });

    const recent7DaysRequests = await BloodRequest.countDocuments({
      createdAt: {
        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    });

    // donor list for available donor count
    const donors = await Donor.find({});
    const availableDonors = donors.filter((donor) =>
      isDonorAvailable(donor),
    ).length;

    // total warnings
    const warnedUsers = await Donor.countDocuments({
      warningCount: { $gt: 0 },
    });

    const totalWarningsAgg = await Donor.aggregate([
      {
        $group: {
          _id: null,
          totalWarnings: { $sum: "$warningCount" },
        },
      },
    ]);

    const totalWarnings = totalWarningsAgg[0]?.totalWarnings || 0;

    // blood group wise request stats
    const requestsByBloodGroup = await BloodRequest.aggregate([
      {
        $group: {
          _id: "$bloodGroup",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // division wise request stats
    const requestsByDivision = await BloodRequest.aggregate([
      {
        $group: {
          _id: "$division",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // top requesters
    // const topRequesters = await BloodRequest.aggregate([
    //   {
    //     $group: {
    //       _id: "$requesterUid",
    //       requesterName: { $first: "$requesterName" },
    //       requesterEmail: { $first: "$requesterEmail" },
    //       number: { $first: "$number" },
    //       totalRequests: { $sum: 1 },
    //     },
    //   },
    //   { $sort: { totalRequests: -1 } },
    //   { $limit: 5 },
    // ]);
    const rawTopRequesters = await BloodRequest.aggregate([
      {
        $group: {
          _id: "$requesterUid",
          requesterName: { $first: "$requesterName" },
          requesterEmail: { $first: "$requesterEmail" },
          number: { $first: "$number" },
          totalRequests: { $sum: 1 },
        },
      },
      { $sort: { totalRequests: -1 } },
      { $limit: 5 },
    ]);

    const topRequesters = await Promise.all(
      rawTopRequesters.map(async (item) => {
        if (item.number && item.number.trim()) {
          return item;
        }

        const donorProfile = await Donor.findOne({ uid: item._id }).select(
          "number",
        );
        return {
          ...item,
          number: donorProfile?.number || "",
        };
      }),
    );
    // monthly trend (last few by month label)
    const requestsByMonth = await BloodRequest.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    return res.json({
      overview: {
        totalDonors,
        availableDonors,
        totalRequests,
        pendingRequests,
        approvedRequests,
        rejectedRequests,
        completedRequests,
        recent7DaysRequests,
        warnedUsers,
        totalWarnings,
      },
      requestsByBloodGroup,
      requestsByDivision,
      topRequesters,
      requestsByMonth,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to load analytics",
      error: error.message,
    });
  }
});

module.exports = router;

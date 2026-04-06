const mongoose = require("mongoose");

const bloodRequestSchema = new mongoose.Schema(
  {
    // requester
    requesterUid: { type: String, required: true, index: true },
    requesterName: { type: String, default: "" },
    requesterEmail: { type: String, default: "" },
    requesterPhone: { type: String, default: "" },

    // donor info
    donorUid: { type: String, default: "", index: true },
    donorName: { type: String, default: "" },
    donorEmail: { type: String, default: "" },
    donorPhone: { type: String, default: "" },

    // need info
    bloodGroup: { type: String, required: true },
    division: { type: String, default: "" },
    district: { type: String, default: "" },
    hospitalName: { type: String, default: "" },
    hospitalAddress: { type: String, default: "" },
    number: { type: String, default: "" },
    patientName: { type: String, default: "" },
    relation: { type: String, default: "" },
    units: { type: Number, default: 1 },
    neededDate: { type: String, default: "" },
    neededTime: { type: String, default: "" },
    reason: { type: String, default: "" },
    note: { type: String, default: "" },

    // admin moderation
    status: {
      type: String,
      enum: ["pending_admin", "approved", "rejected", "completed"],
      default: "pending_admin",
      index: true,
    },

    adminReviewedBy: { type: String, default: "" },
    adminReviewedAt: { type: Date, default: null },
    adminNote: { type: String, default: "" },

    // activity tracking
    unusualActivity: { type: Boolean, default: false },
    warningFlag: { type: Boolean, default: false },
    warningMessage: { type: String, default: "" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("BloodRequest", bloodRequestSchema);

// previous version code

// const mongoose = require("mongoose");

// const bloodRequestSchema = new mongoose.Schema(
//   {
//     // requester
//     requesterUid: { type: String, required: true, index: true },
//     requesterName: { type: String, default: "" },
//     requesterEmail: { type: String, default: "" },
//     requesterPhone: { type: String, default: "" },

//     // need info
//     bloodGroup: { type: String, required: true },
//     division: { type: String, default: "" },
//     district: { type: String, default: "" },
//     hospitalName: { type: String, default: "" },
//     hospitalAddress: { type: String, default: "" },
//     number: { type: String, default: "" },
//     patientName: { type: String, default: "" },
//     relation: { type: String, default: "" },
//     units: { type: Number, default: 1 },
//     neededDate: { type: String, default: "" }, // simple string
//     neededTime: { type: String, default: "" },
//     reason: { type: String, default: "" },
//     note: { type: String, default: "" },

//     status: {
//       type: String,
//       enum: ["open", "closed"],
//       default: "open",
//       index: true,
//     },
//   },
//   { timestamps: true },
// );

// module.exports = mongoose.model("BloodRequest", bloodRequestSchema);

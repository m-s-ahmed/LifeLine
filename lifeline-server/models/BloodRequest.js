const mongoose = require("mongoose");

const bloodRequestSchema = new mongoose.Schema(
  {
    // requester (যে রিকুয়েস্ট করছে)
    requesterUid: { type: String, required: true, index: true },
    requesterName: { type: String, default: "" },
    requesterEmail: { type: String, default: "" },
    requesterPhone: { type: String, default: "" },

    // need info
    bloodGroup: { type: String, required: true },
    division: { type: String, default: "" },
    district: { type: String, default: "" },
    hospitalName: { type: String, default: "" },
    hospitalAddress: { type: String, default: "" },
    patientName: { type: String, default: "" },
    relation: { type: String, default: "" },
    units: { type: Number, default: 1 },
    neededDate: { type: String, default: "" }, // simple string
    neededTime: { type: String, default: "" },
    reason: { type: String, default: "" },
    note: { type: String, default: "" },

    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
      index: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("BloodRequest", bloodRequestSchema);

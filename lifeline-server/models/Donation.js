const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true, index: true }, // firebase uid
    donorId: { type: mongoose.Schema.Types.ObjectId, ref: "Donor" }, // optional
    date: { type: Date, required: true }, // donation date
    units: { type: Number, default: 1 }, // blood units/bags
    place: { type: String, default: "" },
    note: { type: String, default: "" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Donation", donationSchema);

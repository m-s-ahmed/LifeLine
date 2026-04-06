const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },

    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },

    address: { type: String, default: "" },
    age: { type: Number, default: null },

    bloodGroup: { type: String, default: "" },
    district: { type: String, default: "" },
    division: { type: String, default: "" },
    pinCode: { type: String, default: "" },

    lastDonationMonth: { type: String, default: "" },
    lastDonationYear: { type: String, default: "" },

    // NEW: role system
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      index: true,
    },

    // NEW: admin control
    isBlocked: {
      type: Boolean,
      default: false,
    },

    warningCount: {
      type: Number,
      default: 0,
    },

    lastWarningMessage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Donor", donorSchema);

// previous version
// const mongoose = require("mongoose");

// const donorSchema = new mongoose.Schema(
//   {
//     uid: { type: String, required: true, unique: true },
//     email: { type: String, required: true },

//     firstName: { type: String, required: true },
//     lastName: { type: String, required: true },
//     phone: { type: String, required: true },

//     address: { type: String, default: "" },
//     age: { type: Number, default: null },

//     bloodGroup: { type: String, default: "" },
//     district: { type: String, default: "" },
//     division: { type: String, default: "" },
//     pinCode: { type: String, default: "" },

//     lastDonationMonth: { type: String, default: "" },
//     lastDonationYear: { type: String, default: "" },
//   },
//   { timestamps: true },
// );

// module.exports = mongoose.model("Donor", donorSchema);

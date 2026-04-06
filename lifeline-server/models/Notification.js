const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    // receiver
    toUid: { type: String, required: true, index: true },

    // sender
    fromUid: { type: String, default: "" },

    // blood_request / approval / rejection / warning
    type: { type: String, default: "blood_request" },

    title: { type: String, default: "" },
    message: { type: String, default: "" },

    // optional request reference
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BloodRequest",
      default: null,
    },

    isRead: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Notification", notificationSchema);

// previous
// const mongoose = require("mongoose");

// const notificationSchema = new mongoose.Schema(
//   {
//     toUid: { type: String, required: true, index: true }, // Jake pathiyechen
//     fromUid: { type: String, default: "" }, // Jini pathiyechen
//     type: { type: String, default: "blood_request" },

//     title: { type: String, default: "" },
//     message: { type: String, default: "" },

//     // request ref
//     requestId: { type: mongoose.Schema.Types.ObjectId, ref: "BloodRequest" },

//     isRead: { type: Boolean, default: false },
//   },
//   { timestamps: true },
// );

// module.exports = mongoose.model("Notification", notificationSchema);

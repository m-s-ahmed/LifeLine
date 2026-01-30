const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: "" },
    email: { type: String, trim: true, default: "" },
    role: {
      type: String,
      enum: ["donor", "receiver", "volunteer", "organization", "visitor", ""],
      default: "",
    },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    message: { type: String, trim: true, required: true, minlength: 5 },
    // future: if logged-in user
    uid: { type: String, default: "" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Feedback", feedbackSchema);

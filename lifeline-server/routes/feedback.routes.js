const express = require("express");
const router = express.Router();

const Feedback = require("../models/Feedback");

// POST /api/feedback  -> create feedback (public)
router.post("/", async (req, res) => {
  try {
    const { name, email, role, rating, message, uid } = req.body || {};

    if (!message || String(message).trim().length < 5) {
      return res
        .status(400)
        .json({ message: "Message must be at least 5 characters." });
    }

    const doc = await Feedback.create({
      name: String(name || "").trim(),
      email: String(email || "").trim(),
      role: String(role || ""),
      rating: Number(rating || 0),
      message: String(message).trim(),
      uid: String(uid || ""),
    });

    return res
      .status(201)
      .json({ message: "Feedback saved ✅", feedback: doc });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Feedback save failed", error: e.message });
  }
});

// GET /api/feedback/public?limit=6  -> recent feedback list (Home page)
router.get("/public", async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit || 6), 50);

    const list = await Feedback.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("name role rating message createdAt");

    return res.json(list);
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Feedback list failed", error: e.message });
  }
});

module.exports = router;

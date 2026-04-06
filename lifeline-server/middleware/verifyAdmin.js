const Donor = require("../models/Donor");

const verifyAdmin = async (req, res, next) => {
  try {
    const email = req.user?.email;

    if (!email) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const donor = await Donor.findOne({ email });

    if (!donor || donor.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    req.adminUser = donor;
    next();
  } catch (error) {
    return res.status(500).json({
      message: "Failed to verify admin",
      error: error.message,
    });
  }
};

module.exports = verifyAdmin;

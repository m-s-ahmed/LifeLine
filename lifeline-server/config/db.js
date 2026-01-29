const mongoose = require("mongoose");

module.exports = async function connectDB(uri) {
  await mongoose.connect(uri);
  console.log("✅ MongoDB connected");
};

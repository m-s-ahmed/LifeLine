const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const donorRoutes = require("./routes/donor.routes");
const donationRoutes = require("./routes/donation.routes");
const findRoutes = require("./routes/find.routes");

const app = express();

//app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
// deploy ar time change koresi 
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
// --------------------------------
app.get("/", (req, res) => res.send("LifeLine API running ✅"));
app.use("/api/donors", donorRoutes);

app.use("/api/donations", donationRoutes);

app.use("/api/find", findRoutes);

const port = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    app.listen(port, () => console.log(`✅ Server running on port ${port}`));
  } catch (e) {
    console.log("❌ Startup error:", e.message);
  }
})();

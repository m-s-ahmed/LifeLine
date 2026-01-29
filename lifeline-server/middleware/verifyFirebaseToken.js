const admin = require("firebase-admin");
const path = require("path");
require("dotenv").config();

const servicePath = process.env.FIREBASE_ADMIN_PATH;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(path.resolve(servicePath)),
  });
}

module.exports = async function verifyFirebaseToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token)
      return res.status(401).json({ message: "Unauthorized: No token" });

    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

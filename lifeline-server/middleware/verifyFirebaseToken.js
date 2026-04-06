// const admin = require("firebase-admin");
//require("dotenv").config();

// Locally run korar somoy ai if part ta comment kore server run korbo.
// Render a deploy korar somoy abar ai part ta lagbe token verify korar jonno

// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert({
//       projectId: process.env.FIREBASE_PROJECT_ID,
//       clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//       privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
//     }),
//   });
// }

// module.exports = async function verifyFirebaseToken(req, res, next) {
//   try {
//     const authHeader = req.headers.authorization || "";
//     const token = authHeader.startsWith("Bearer ")
//       ? authHeader.split(" ")[1]
//       : null;

//     if (!token)
//       return res.status(401).json({ message: "Unauthorized: No token" });

//     const decoded = await admin.auth().verifyIdToken(token);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: "Unauthorized: Invalid token" });
//   }
// };

// ***********************
// const admin = require("firebase-admin");
// require("dotenv").config();
// const serviceAccount = require("../firebase-admin.json");

// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//   });
// }

// //render live ata pore add korsi
// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert({
//       projectId: process.env.FIREBASE_PROJECT_ID,
//       clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//       privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
//     }),
//   });
// }

// module.exports = async function verifyFirebaseToken(req, res, next) {
//   try {
//     const authHeader = req.headers.authorization || "";
//     const token = authHeader.startsWith("Bearer ")
//       ? authHeader.split(" ")[1]
//       : null;

//     if (!token) {
//       return res.status(401).json({ message: "Unauthorized: No token" });
//     }

//     const decoded = await admin.auth().verifyIdToken(token);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.status(401).json({
//       message: "Unauthorized: Invalid token",
//       error: err.message,
//     });
//   }
// };

const admin = require("firebase-admin");
require("dotenv").config();

if (!admin.apps.length) {
  if (
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  ) {
    // Render / live
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
    });
  } else {
    // Local
    const serviceAccount = require("../firebase-admin.json");
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
}

module.exports = async function verifyFirebaseToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token" });
    }

    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Unauthorized: Invalid token",
      error: err.message,
    });
  }
};

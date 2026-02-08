// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyBAhT0Bop-09bwbRf7Yf7GI0JikmSNTBYM",
  authDomain: "lifeline-90177.firebaseapp.com",
  projectId: "lifeline-90177",
  storageBucket: "lifeline-90177.firebasestorage.app",
  messagingSenderId: "328712292159",
  appId: "1:328712292159:web:3279385de2c764ea0cb58a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;

// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//   appId: import.meta.env.VITE_FIREBASE_APP_ID,
// };

// const app = initializeApp(firebaseConfig);
// export default app;

// import axios from "axios";
// import { getAuth } from "firebase/auth";
// import app from "../firebase/firebase.config";

// const auth = getAuth(app);

// export const axiosSecure = axios.create({
//   // baseURL: "http://localhost:5000",
//   baseURL: import.meta.env.VITE_API_URL, // ✅ local + live দুটোই
// });

// axiosSecure.interceptors.request.use(async (config) => {
//   const user = auth.currentUser;
//   if (user) {
//     const token = await user.getIdToken();
//     config.headers.authorization = `Bearer ${token}`;
//   }
//   return config;
// });
import axios from "axios";
import { getAuth } from "firebase/auth";
import app from "../firebase/firebase.config";

const auth = getAuth(app);

export const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

axiosSecure.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;

    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

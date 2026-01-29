import axios from "axios";
import { getAuth } from "firebase/auth";
import app from "../firebase/firebase.config";

const auth = getAuth(app);

export const axiosSecure = axios.create({
  // baseURL: "http://localhost:5000",
  baseURL: import.meta.env.VITE_API_URL, // ✅ local + live দুটোই
});

axiosSecure.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.authorization = `Bearer ${token}`;
  }
  return config;
});

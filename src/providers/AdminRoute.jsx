import React, { useContext, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthProvider";
import { axiosSecure } from "../api/axiosSecure";

export default function AdminRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user?.email) {
        setIsAdmin(false);
        setChecking(false);
        return;
      }

      try {
        const res = await axiosSecure.get(
          `/api/donors/admin-check?email=${user.email}`,
        );
        setIsAdmin(res.data?.isAdmin === true);
      } catch (error) {
        console.log(error);
        setIsAdmin(false);
      } finally {
        setChecking(false);
      }
    };

    if (!loading) {
      checkAdmin();
    }
  }, [user, loading]);

  if (loading || checking) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

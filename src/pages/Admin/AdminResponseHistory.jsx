import React, { useEffect, useState } from "react";
import AdminTopNav from "./AdminTopNav";
import { axiosSecure } from "../../api/axiosSecure";

export default function AdminResponseHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/api/admin/response-history");
      setHistory(res.data || []);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <section className="min-h-[calc(100vh-72px)] bg-base-200/40 py-10">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-4">
          <h1 className="text-3xl font-extrabold">Response History</h1>
          <p className="text-sm text-base-content/60 mt-1">
            Track which donor accepted or declined each blood request.
          </p>
        </div>

        <AdminTopNav />

        {loading ? (
          <div className="min-h-[40vh] flex items-center justify-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-3xl bg-base-100 border border-base-200 shadow-xl">
            <table className="table">
              <thead>
                <tr>
                  <th>Donor</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Request Blood</th>
                  <th>Patient</th>
                  <th>Responded At</th>
                </tr>
              </thead>
              <tbody>
                {history.length ? (
                  history.map((item) => (
                    <tr key={item._id}>
                      <td>{item.donorName || "-"}</td>
                      <td>{item.donorPhone || "-"}</td>
                      <td>
                        {item.status === "accepted" ? (
                          <span className="badge badge-success">Accepted</span>
                        ) : item.status === "declined" ? (
                          <span className="badge badge-error">Declined</span>
                        ) : (
                          <span className="badge badge-warning">Pending</span>
                        )}
                      </td>
                      <td>{item.requestId?.bloodGroup || "-"}</td>
                      <td>{item.requestId?.patientName || "-"}</td>
                      <td>
                        {item.respondedAt
                          ? new Date(item.respondedAt).toLocaleString()
                          : "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center text-base-content/60"
                    >
                      No response history found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

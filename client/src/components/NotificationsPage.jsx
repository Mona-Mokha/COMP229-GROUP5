import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
 
export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
 
  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");
 
      try {
        const res = await fetch("/api/notification", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch notifications");
        setNotifications(data.notifications);
      } catch (err) {
        console.error(err);
        alert(err.message);
      }
    };
 
    fetchNotifications();
  }, [navigate]);
 
  // Mark as read
  const handleMarkRead = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
 
    try {
      const res = await fetch(`/api/notification/read/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to mark as read");
 
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };
 
  // Delete notification
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notification?")) return;
 
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
 
    try {
      const res = await fetch(`/api/notification/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete notification");
 
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };
 
  return (
    <div className="ws-donations-page">
      <header className="ws-page-header">
        <h1>Notifications</h1>
        <p>Check your latest notifications here.</p>
      </header>
 
      <div className="ws-requests-grid">
        {notifications.length === 0 ? (
          <p>You have no notifications.</p>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              className={`ws-request-card ${n.read ? "ws-read" : "ws-unread"}`}
            >
              <div className="ws-request-info">
                <p><strong>Type:</strong> {n.type}</p>
                <p>{n.message}</p>
                <p className="ws-request-date">{new Date(n.created).toLocaleString()}</p>
 
                <div className="ws-donor-action-buttons">
                  {!n.read && (
                    <button
                      className="ws-btn ws-btn-confirm"
                      onClick={() => handleMarkRead(n._id)}
                    >
                      Mark as Read
                    </button>
                  )}
                  <button
                    className="ws-btn ws-btn-withdraw"
                    onClick={() => handleDelete(n._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
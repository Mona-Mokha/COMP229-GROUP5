import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      try {
        const res = await fetch("/api/request/my-requests", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch requests");
        }

        setRequests(data.requests);
      } catch (err) {
        console.error(err);
        alert(err.message);
      }
    };
    fetchRequests();
  }, [navigate]);


  const handleWithdraw = async (requestId) => {
    if (!window.confirm("Are you sure you want to withdraw this request?")) return;
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const res = await fetch(`/api/request/${requestId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to withdraw request");
      setRequests(requests.filter((req) => req._id !== requestId));
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleConfirmSlot = async (reqId) => {
    const slot = selectedSlot[reqId];
    if (!slot) {
      alert("Please select a slot.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const res = await fetch(`/api/request/${reqId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: "Scheduled",
          selectedSlot: slot,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to confirm slot");

      setRequests((prev) =>
        prev.map((req) =>
          req._id === reqId ? { ...req, status: "Scheduled", confirmedSlot: slot } : req
        )
      );
    } catch (err) {
      console.error(err);
      alert("Error confirming slot.");
    }
  };

  return (
    <div className="ws-donations-page">
      <header className="ws-page-header">
        <h1>My Requests</h1>
        <p>Track the status of the items you have requested.</p>
      </header>

      <div className="ws-requests-grid">
        {requests.length === 0 ? (
          <div className="ws-empty-card">
            <p className="ws-empty-text">You have not requested any items yet.</p>
          </div>
        ) : (
          requests.map((req) => {

            const donation = req.donationId;
            const donor = donation.donorId;
            const slots = req.slots || [];
            return (
              <div key={req._id} className="ws-request-card">
                <div className="ws-request-image-wrap">
                  <img
                    src={donation?.images?.[0] || ""}
                    alt={donation?.title}
                    className="ws-request-image"
                  />
                </div>

                <div className="ws-request-info">
                  <h2>{donation?.title}</h2>

                  {donor && (
                    <div className="ws-donor-info">
                      <div className="ws-donor-avatar">D</div>
                      <div className="ws-donor-details">
                        <span className="ws-donor-name">{donor?.name}</span>
                        <span className="ws-donor-location">{donor?.city}, {donor?.province}</span>
                      </div>
                    </div>
                  )}

                  <div className="ws-request-tags">
                    <span className={`ws-status ${req.status.toLowerCase()}`}>
                      {req.status}
                    </span>
                    <span className="ws-request-date">{new Date(req.created).toLocaleDateString()}</span>
                  </div>

                  <div className="ws-request-actions" style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    <button
                      className="ws-btn ws-btn-view"
                      onClick={() => navigate(`/donation/${donation?._id}`)}
                    >
                      View Donation
                    </button>

                    <button
                      className="ws-btn ws-btn-withdraw"
                      onClick={() => handleWithdraw(req._id)}
                    >
                      Withdraw
                    </button>
                  </div>
                  {/* Slot selection for Approved requests */}
                  {req.status === "Approved" && (
                    <div className="ws-schedule-box">
                      <h4>Pick a slot:</h4>
                      <div className="ws-slots-container">
                        {slots.map((slot, idx) => {
                          const isSelected =
                            selectedSlot[req._id]?.date.split("T")[0] === slot.date &&
                            selectedSlot[req._id]?.timeSlot === slot.timeSlot;
                          return (
                            <div
                              key={idx}
                              className={`ws-slot-row ${isSelected ? "ws-slot-selected" : ""}`}
                              onClick={() => setSelectedSlot({ ...selectedSlot, [req._id]: slot })}
                            >
                              {slot.date.split("T")[0]} - {slot.timeSlot} 
                            </div>
                          );
                        })}
                      </div>

                      <div className="ws-donor-action-buttons" style={{ marginTop: "10px" }}>
                        <button
                          className="ws-btn ws-btn-confirm"
                          disabled={!selectedSlot[req._id]}
                          onClick={() => handleConfirmSlot(req._id)}
                        >
                          Confirm Slot
                        </button>

                      </div>
                    </div>
                  )}

                  {req.status === "Scheduled" && req.selectedSlot && (
                    <div className="ws-scheduled-slot">
                      <strong>Scheduled Slot:</strong>
                      <p>{req.selectedSlot.date.split("T")[0]} - {req.selectedSlot.timeSlot}</p>

                      <strong>Donor Address:</strong>
                      <p>{donor?.address}, {donor?.city}, {donor?.province}, {donor?.postal_code}</p>
                      <p>Phone: {donor?.phone}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

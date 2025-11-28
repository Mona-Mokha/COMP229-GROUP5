import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DonorRequests() {
  const [requests, setRequests] = useState([]);
  const [activeRequest, setActiveRequest] = useState(null); // current request picking slots
  const [selectedSlots, setSelectedSlots] = useState({});
  const navigate = useNavigate();

  const timeSlots = [
    "09:00 AM - 11:00 AM",
    "11:00 AM - 1:00 PM",
    "01:00 PM - 3:00 PM",
    "03:00 PM - 5:00 PM",
    "05:00 PM - 7:00 PM",
  ];

  const handleSlotChange = (reqId, index, field, value) => {
    const slots = selectedSlots[reqId] || [];
    const updatedSlots = [...slots];
    updatedSlots[index] = { ...updatedSlots[index], [field]: value };
    setSelectedSlots({ ...selectedSlots, [reqId]: updatedSlots });
  };

  const addSlot = (reqId) => {
    const slots = selectedSlots[reqId] || [];
    if (slots.length < 3) {
      setSelectedSlots({ ...selectedSlots, [reqId]: [...slots, { date: "", timeSlot: "" }] });
    }
  };

  const removeSlot = (reqId, index) => {
    const slots = selectedSlots[reqId] || [];
    const updatedSlots = slots.filter((_, i) => i !== index);
    setSelectedSlots({ ...selectedSlots, [reqId]: updatedSlots });
  };

  const handleApprove = async (reqId) => {
    const slots = selectedSlots[reqId];
    if (!slots || slots.some(s => !s.date || !s.timeSlot)) {
      alert("Please select date and time for all slots.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(`/api/request/${reqId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "Approved", slots }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to approve");

      setRequests(prev =>
        prev.map(req =>
          req._id === reqId ? { ...req, status: "Approved", slots } : req
        )
      );
      setActiveRequest(null);
    } catch (err) {
      console.error(err);
      alert("Error approving request.");
    }
  };

  const handleReject = async (reqId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(`/api/request/${reqId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "Rejected" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to reject");

      setRequests(prev => prev.filter(req => req._id !== reqId));
    } catch (err) {
      console.error(err);
      alert("Error rejecting request.");
    }
  };

  const handleComplete = async (reqId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(`/api/request/${reqId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "Completed" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to complete");

      setRequests(prev =>
        prev.map(req =>
          req._id === reqId ? { ...req, status: "Completed" } : req
        )
      );

    } catch (err) {
      console.error(err);
      alert("Error completing request.");
    }
  };

  const handleDelete = async (reqId, donationId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(`/api/request/${reqId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to delete request");
      }

      const res2 = await fetch(`/api/donation/${donationId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data2 = await res2.json();
    if (!res2.ok) throw new Error(data2.message || "Failed to delete donation");

    setRequests(prev => prev.filter(r => r._id !== reqId));

    alert("Request and donation deleted successfully.");

    } catch (err) {
      console.error(err);
      alert(err.message || "Error deleting request.");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");

    const fetchRequests = async () => {
      try {
        const res = await fetch("/api/request/my-donations", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch requests");
        setRequests(data.requests);
      } catch (err) {
        console.error(err);
        alert(err.message);
      }
    };
    fetchRequests();
  }, [navigate]);


  return (
    <div className="ws-donor-requests-page">
      <header className="ws-page-header">
        <h1>Donation Requests</h1>
        <p>Manage requests for your donations, approve or reject, and schedule pickup.</p>
      </header>

      <div className="ws-donor-requests-grid">
        {requests.length === 0 && <p>No requests yet.</p>}

        {requests.map(req => {
          
          const donation = req.donationId;
          const receiver = req.receiverId;
          const slotsForReq = selectedSlots[req._id] || [];

          return (
            <div key={req._id} className="ws-donor-request-card">
              <div className="ws-donor-request-left">
                <img
                  src={donation.images?.[0] || ""}
                  alt={donation.title}
                  className="ws-donor-request-image"
                />
              </div>

              <div className="ws-donor-request-right">
                <h2>{donation.title}</h2>
                <p className="ws-request-receiver">Requested by: {receiver.name}</p>
                <p>
                  Status: <span className={`ws-status ${req.status.toLowerCase()}`}>{req.status}</span>
                </p>

                <div className="ws-donor-action-buttons">
                  {activeRequest !== req._id && (
                  <>
                    {req.status !== "Approved" && req.status !== "Scheduled" && req.status !== "Completed" && (
                      <button className="ws-btn ws-btn-approve" onClick={() => setActiveRequest(req._id)}>
                        Approve
                      </button>
                    )}
                    {req.status !== "Approved" && req.status !== "Scheduled" && req.status !== "Completed" && (
                      <button className="ws-btn ws-btn-cancel" onClick={() => handleReject(req._id)}>
                        Reject
                      </button>
                    )}
                  </>
                  )}
                  {req.status === "Completed" && (
                    <button className="ws-btn ws-btn-cancel" onClick={() => handleDelete(req._id, donation._id)}>
                      Remove
                    </button>
                  )}
                  {req.status === "Scheduled" && (
                    <button className="ws-btn ws-btn-confirm" onClick={() => handleComplete(req._id)}>
                      Complete
                    </button>
                  )}
                </div>

                {/* Slot selection for active request */}
                {activeRequest === req._id && req.status !== "Approved" && (
                  <div className="ws-schedule-box">
                    <h4>Select up to 3 slots:</h4>

                    {slotsForReq.map((slot, idx) => (
                      <div key={idx} className="ws-slot-row">
                        <input
                          type="date"
                          className="ws-date-picker"
                          value={slot.date || ""}
                          onChange={e => handleSlotChange(req._id, idx, "date", e.target.value)}
                        />
                        <select
                          className="ws-slot-picker"
                          value={slot.timeSlot || ""}
                          onChange={e => handleSlotChange(req._id, idx, "timeSlot", e.target.value)}
                        >
                          <option value="">Select time</option>
                          {timeSlots.map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                        <button className="ws-btn ws-btn-cancel" onClick={() => removeSlot(req._id, idx)}>
                          Remove
                        </button>
                      </div>
                    ))}

                    {slotsForReq.length < 3 && (
                      <button className="ws-btn ws-btn-approve" onClick={() => addSlot(req._id)}>
                        Add Slot
                      </button>
                    )}

                    <div className="ws-donor-action-buttons" style={{ marginTop: "10px" }}>
                      <button
                        className="ws-btn ws-btn-confirm"
                        disabled={slotsForReq.length === 0 || slotsForReq.some(s => !s.date || !s.timeSlot)}
                        onClick={() => handleApprove(req._id)}
                      >
                        Send to Receiver
                      </button>
                      <button className="ws-btn ws-btn-cancel" onClick={() => setActiveRequest(null)}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Display receiver-selected slot */}
                {req.status === "Scheduled" && req.selectedSlot && (
                  <div className="ws-scheduled-slot">
                    <strong>Receiver Selected Slot:</strong>
                    <p>{req.selectedSlot.date.split("T")[0]} - {req.selectedSlot.timeSlot}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

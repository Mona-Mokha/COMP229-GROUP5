
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function MyProfile({ user, setUser, handleLogout }) {
  const [getUser, setAUser] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    postal_code: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    setAUser(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
    setError("");
    setSuccess("");
  };

  // Fetch user profile on load
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token')

      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`/api/user/me`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }

        const data = await response.json();
        setAUser({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          city: data.city || "",
          province: data.province || "",
          postal_code: data.postal_code || ""
        });

      } catch (error) {
        console.error('Error fetching user', error);
      }
    }
    fetchUser();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`/api/user/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(getUser),
      });

      if (response.ok) {
        setSuccess("Profile updated successfully!");
        setIsEditing(false);
      } else {
        setError("Failed to update profile. Please try again.");
      }

    } catch (err) {
      console.error(err);
      console.log("Error connecting to server.");
    }
  };

  const [pError, setPError] = useState("");
  const [pSuccess, setPSuccess] = useState("");
  const [passwordMode, setPasswordMode] = useState(false);
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNew: ""
  });

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmNew) {
      setPError("New passwords do not match.");
      setPSuccess("");
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`/api/user/update-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          oldPassword: passwords.oldPassword,
          newPassword: passwords.newPassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setPSuccess("Password updated successfully!");
        setPError("");
        setPasswords({ oldPassword: "", newPassword: "", confirmNew: "" });
      } else {
        setPError(data.message || "Failed to update password. Please try again.");
        setPSuccess("");
      }
    } catch (err) {
      console.error(err);
      console.log("Error connecting to server.");
    }
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const response = await fetch(`/api/user/delete`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert("Account deleted successfully.");
        handleLogout();
        navigate('/login');
        return;
      } else {
        alert("Failed to delete account. Please try again.");
      }
    } catch (err) {
      console.error(err);
      console.log("Error connecting to server.");
    }
  };

  return (
    <div className="ws-donations-page">
      <div className="ws-page-header">
        <h1>My Profile</h1>
        <p>Manage your account and personal information.</p>
      </div>

      {/* PROFILE INFO */}
      <div className="ws-feature-card" style={{ maxWidth: "650px", margin: "0 auto", textAlign: "left" }}>
        {error && <p className="ws-auth-error">{error}</p>}
        {success && <p className="ws-auth-success">{success}</p>}

        <form onSubmit={handleUpdate} className="ws-form">
          <div className="ws-form-row">
            <label>Full Name</label>
            <input
              name="name"
              value={getUser.name}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div className="ws-form-row">
            <label>Email</label>
            <input name="email" value={getUser.email} disabled />
          </div>

          <div className="ws-form-row-inline">
            <div className="ws-form-row">
              <label>Phone</label>
              <input
                name="phone"
                value={getUser.phone}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            <div className="ws-form-row">
              <label>Address</label>
              <input
                name="address"
                value={getUser.address}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            <div className="ws-form-row">
              <label>City</label>
              <input
                name="city"
                value={getUser.city}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            <div className="ws-form-row">
              <label>Province</label>
              <select
                name="province"
                value={getUser.province}
                onChange={handleChange}
                disabled={!isEditing}
              >
                <option value="">Select Province</option>
                <option value="AB">Alberta</option>
                <option value="BC">British Columbia</option>
                <option value="MB">Manitoba</option>
                <option value="NB">New Brunswick</option>
                <option value="NL">Newfoundland and Labrador</option>
                <option value="NS">Nova Scotia</option>
                <option value="ON">Ontario</option>
                <option value="PE">Prince Edward Island</option>
                <option value="QC">Quebec</option>
                <option value="SK">Saskatchewan</option>
                <option value="NT">Northwest Territories</option>
                <option value="NU">Nunavut</option>
                <option value="YT">Yukon</option>
              </select>
            </div>

            <div className="ws-form-row">
              <label>Postal Code</label>
              <input
                name="postal_code"
                value={getUser.postal_code}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "22px" }}>
            {isEditing ? (
              <>
                <button type="submit" className="ws-primary-btn">Save Changes</button>
                <button type="button" className="ws-secondary-btn" onClick={() => { setIsEditing(false); setSuccess(""); setError(""); }}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button type="button" className="ws-primary-btn" onClick={(e) => { e.preventDefault(); setIsEditing(true); }}>
                  Edit Profile
                </button>
                <button type="button" className="ws-delete-btn" onClick={handleDeleteAccount} >Delete Account</button>
              </>
            )}
          </div>
        </form>
      </div>

      {/* UPDATE PASSWORD */}
      <h2 style={{ textAlign: "center", marginTop: "40px" }}>Security</h2>
      <div className="ws-feature-card" style={{ maxWidth: "650px", margin: "20px auto", textAlign: "left" }}>
        {!passwordMode ? (
          <button className="ws-primary-btn" onClick={() => setPasswordMode(true)}>
            Update Password
          </button>
        ) : (
          <form onSubmit={handlePasswordUpdate} className="ws-form">
            {pError && <p className="ws-auth-error">{pError}</p>}
            {pSuccess && <p className="ws-auth-success">{pSuccess}</p>}

            <div className="ws-form-row">
              <label>Current Password</label>
              <input
                type="password"
                value={passwords.oldPassword}
                onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                required
              />
            </div>

            <div className="ws-form-row">
              <label>New Password</label>
              <input
                type="password"
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                required
              />
            </div>

            <div className="ws-form-row">
              <label>Confirm New Password</label>
              <input
                type="password"
                value={passwords.confirmNew}
                onChange={(e) => setPasswords({ ...passwords, confirmNew: e.target.value })}
                required
              />
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "22px" }}>
              <button type="submit" className="ws-primary-btn">Save Password</button>
              <button
                type="button"
                className="ws-secondary-btn"
                onClick={() => { setPasswordMode(false); setPError(""); setPSuccess(""); setPasswords({ current: "", newPass: "", confirmNew: "" }); }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

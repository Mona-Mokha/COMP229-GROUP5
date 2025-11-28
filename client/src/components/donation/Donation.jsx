import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
 
export default function SingleDonation() {
  const [donation, setDonation] = useState({
    title: "",
    size: "",
    category: "",
    condition: "",
    city: "",
    province: "",
    description: "",
    images: [],
  });
 
  const [currentImage, setCurrentImage] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");
 
  // Fetch donation details
  useEffect(() => {
    if (id) {
      const fetchDonation = async () => {
        try {
          const response = await fetch(`/api/donation/public/${id}`, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
 
          const data = await response.json();
 
          if (!response.ok) {
            throw new Error('Failed to fetch donation details');
          }
 
          const donationData = data.donation;
 
          setDonation({
            title: donationData.title,
            size: donationData.size,
            category: donationData.category,
            condition: donationData.condition,
            city: donationData.donor?.city || "",
            province: donationData.donor?.province || "",
            description: donationData.description,
            images: donationData.images || [],
          });
 
        } catch (error) {
          console.error('Error fetching donation', error);
        }
      }
      fetchDonation();
    }
  }, [id, navigate]);
 
  const handleRequest = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
 
    try {
      const res = await fetch("/api/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ donationId: id })
      });
 
      const data = await res.json();
 
      if (!res.ok) {
        throw new Error(data.message || "Failed to create request");
      }
 
      alert("Request submitted successfully!");
 
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };
 
  return (
    <div className="ws-donation-detail-page">
      <header className="ws-page-header">
        <h1>{donation.title}</h1>
        <p>{donation.category}</p>
      </header>
 
      <div className="ws-donation-detail-container">
        <div className="ws-donation-images">
          <img
            src={donation.images[currentImage]}
            alt={donation.title}
            className="ws-main-image"
          />
          <div className="ws-thumbnails">
            {donation.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Thumbnail ${index + 1}`}
                className={index === currentImage ? "active" : ""}
                onClick={() => setCurrentImage(index)}
              />
            ))}
          </div>
        </div>
 
        <div className="ws-donation-info">
          <h3>Details</h3>
          <p>{donation.description}</p>
 
          <h4>Size & Condition</h4>
          <p>Size: {donation.size}</p>
          <p>Condition: {donation.condition}</p>
 
          <h4>Location</h4>
          <p>{donation.city}, {donation.province}</p>
 
          <button type="button" className="ws-primary-btn" onClick={handleRequest} >Request This Item</button>
          {error && <p className="ws-auth-error">{error}</p>}
        </div>
      </div>
 
      {/* MAP BELOW */}
      <div className="ws-donation-map">
        <iframe
          title="Donation Location"
          width="100%"
          height="300"
          style={{ border: 0, borderRadius: "12px" }}
          loading="lazy"
          allowFullScreen
          src={`https://www.google.com/maps?q=${encodeURIComponent(donation.city + ', ' + donation.province + ', Canada')}&z=14&output=embed`}
        ></iframe>
      </div>
    </div>
  );
}
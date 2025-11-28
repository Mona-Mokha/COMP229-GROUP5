import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
 
export default function BrowseDonations() {
 
  const [donations, setDonations] = useState([]);
  const navigate = useNavigate();
 
  // Fetch all donations
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await fetch('/api/donation', {
          headers: {
            'Content-Type': 'application/json'
          }
        });
 
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message)
        }
 
        const list = data.donations || data.donation || [];
        setDonations(list);
 
      } catch (error) {
        console.error(`Error fetching donations: ${error.message}`);
      }
    }
    fetchDonations();
  }, []);
 
 
  return (
    <div className="ws-browse-page">
      <header className="ws-page-header">
        <h1>Browse Donations</h1>
        <p>
          Discover items shared by our community.
        </p>
      </header>
 
      <section className="ws-donations-grid">
        {donations.map((item) => (
          <article key={item.id} className="ws-donation-card">
            <div className="ws-donation-image-wrap">
              <img
                src={Array.isArray(item.images) && item.images.length ? item.images[0] : item.images || ''}
                className="ws-donation-image"
                alt={item.title || 'donation image'}
              />
            </div>
            <div className="ws-donation-body">
              <h2 className="ws-donation-title">{item.title}</h2>
              <p className="ws-donation-category">{item.category}</p>
              <div className="ws-donation-tags">
                <span className="ws-tag">Size: {item.size}</span>
                <span className="ws-tag">Condition: {item.condition}</span>
              </div>
              <p className="ws-donation-user">{item.donor.name}</p>
              <p className="ws-donation-location">{item.donor.city}, {item.donor.province}</p>
              <button className="ws-secondary-btn" onClick={() => navigate(`/donation/${item.id}`)}>
                View Details
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
 
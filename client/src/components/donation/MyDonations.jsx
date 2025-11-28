import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
 
export default function MyDonations() {
 
    const [myDonations, setMyDonations] = useState([]);
    const navigate = useNavigate();
 
    useEffect(() => {
        const token = localStorage.getItem('token');
        // const role = localStorage.getItem('role');
 
        if (!token) {
            navigate('/login');
            return;
        }
 
 
        const fetchMyDonations = async () => {
            try {
                const response = await fetch('/api/donation/user', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
 
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message)
                }
 
                setMyDonations(data.donations);
            } catch (error) {
                console.error(`Error fetching donations: ${error.message}`);
            }
        }
        fetchMyDonations();
    }, []);
 
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this donation? This action cannot be undone.")) {
            return;
        }
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
 
        try {
            const response = await fetch(`/api/donation/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
 
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to delete donation');
            }
 
            alert('Donation deleted successfully');
            setMyDonations(prevDonations => prevDonations.filter(donation => donation.id !== id));
        } catch (error) {
            console.error(`Error deleting donation: ${error.message}`);
        }
    }
 
 
    return (
        <div className="md-wrapper">
            <h2 className="md-title">My Donations</h2>
 
            {myDonations.length === 0 ? (
                <p className="md-empty">You haven't posted any donations yet.</p>
            ) : (
                <div className="md-list">
                    {myDonations.map((item) => (
                        <div className="md-card" key={item.id}>
 
                            <div className="md-img-box">
                                <img
                                    src={item.images?.[0] || "/no-image.jpg"}
                                    alt={item.title}
                                    className="md-img"
                                />
                            </div>
 
                            <div className="md-details">
                                <h3 className="md-item-title">{item.title}</h3>
                                <p className="md-description">{item.description}</p>
                                <p className="md-description">{item.preference}</p>
                                <div className="md-tags">
                                    <span className="md-tag">{item.category}</span>
                                    <span className="md-tag">{item.size}</span>
                                    <span className="md-tag">{item.condition}</span>
                                </div>
 
                                <p className={`md-status md-status-${item.status.toLowerCase()}`}>
                                    {item.status}
                                </p>
 
                                <div className="md-buttons">
                                    <button className="md-btn-edit" onClick={() => navigate(`/donations/submit/${item.id}`)}>Edit</button>
                                    <button className="md-btn-delete" onClick={() => handleDelete(item.id)} >Delete</button>
                                </div>
                            </div>
 
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
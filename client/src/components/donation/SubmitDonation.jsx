import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
 
export default function SubmitDonation() {
  const { id } = useParams();
  const emptyDonation = {
    title: '',
    category: '',
    size: '',
    condition: '',
    description: '',
    images: [],
    preference: '',
  };
 
  const [formDonation, setFormDonation] = useState(emptyDonation);
  const [existingImages, setExistingImages] = useState([]); // stored DB URLs
  const [newImages, setNewImages] = useState([]); // newly selected files
 
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDonation(prevState => ({ ...prevState, [name]: value }));
    setError("");
    setSuccess("");
  };
 
  // const [newImages, setNewImages] = useState([]);
  // const [images, setImages] = useState([]);
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (existingImages.length + newImages.length + files.length > 5) {
      setError("You can upload up to 5 images only.");
      return;
    }
 
    setNewImages([...newImages, ...files]);
  };
 
  const removeExistingImage = (index) => {
    const updated = existingImages.filter((_, i) => i !== index);
    setExistingImages(updated);
  };
 
  const removeNewImage = (index) => {
    const updated = newImages.filter((_, i) => i !== index);
    setNewImages(updated);
  };
 
 
  useEffect(() => {
    if (id) {
      const fetchDonation = async () => {
        const token = localStorage.getItem('token');
 
        if (!token) {
          navigate('/login');
          return;
        }
 
        try {
          const response = await fetch(`/api/donation/${id}`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
 
          if (!response.ok) {
            throw new Error('Failed to fetch donation record');
          }
 
          const data = await response.json();
          const d = data.donation;
 
          setFormDonation({
            title: d.title || '',
            category: d.category || '',
            size: d.size || '',
            condition: d.condition || '',
            description: d.description || '',
            preference: d.preference || '',
          });
 
          setExistingImages(d.images || []);
 
        } catch (error) {
          console.error('Error fetching donation record', error);
        }
      }
      fetchDonation();
    }
    else {
      setFormDonation(emptyDonation);
      setExistingImages([]);
      setNewImages([]);
      setError("");
    }
  }, [id, navigate]);
 
 
  async function handleSubmit(e) {
    e.preventDefault();
 
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
 
    if (!id && newImages.length === 0) {
      setError("Please select at least one image.");
      return;
    }
 
    const formData = new FormData();
 
    newImages.forEach(file => formData.append("images", file));
 
    // Send list of existing images
    formData.append("existingImages", JSON.stringify(existingImages));
 
    // Append other fields
    formData.append("title", formDonation.title);
    formData.append("size", formDonation.size);
    formData.append("category", formDonation.category);
    formData.append("condition", formDonation.condition);
    formData.append("preference", formDonation.preference);
    formData.append("description", formDonation.description);
 
    try {
      const endpoint = id
        ? `/api/donation/${id}`   // PUT
        : `/api/donation/create`;        // POST
 
      const method = id ? "PUT" : "POST";
 
      const res = await fetch(endpoint, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
 
      const data = await res.json();
 
      if (!res.ok) {
        throw new Error(data.message || 'Failed operation');
      }
 
      alert(id ? "Donation updated!" : "Donation submitted!");
 
      setTimeout(() => {
        navigate('/donations/my-donations');
      }, 1500);
 
    } catch (err) {
      setError(err.message || 'Submission failed' );
    }
  }
 
  return (
    <div className="ws-submit-page">
      <div className="ws-submit-wrapper">
        <header className="ws-page-header">
          <h1>{id ? "Update Donation" : "Post a Donation"}</h1>
          <p>
            {id
              ? "Update the donation details if something has changed."
              : "Share clothing in good condition. Include clear details so people know if it’s right for them."
            }
          </p>
        </header>
 
        {error && <p className="ws-auth-error">{error}</p>}
        {success && <p className="ws-auth-success">{success}</p>}
 
        <form className="ws-form" onSubmit={handleSubmit}>
          <div className="ws-form-row">
            <label>Item Title</label>
            <input
              type="text"
              name="title"
              placeholder="e.g., Winter coat"
              value={formDonation.title}
              onChange={handleChange}
              required
            />
          </div>
 
          <div className="ws-form-row">
            <label>Category</label>
            <select name="category" value={formDonation.category} onChange={handleChange}>
              <option value="general">General clothing</option>
              <option value="women">Women</option>
              <option value="men">Men</option>
              <option value="kids">Kids</option>
              <option value="baby">Baby</option>
              <option value="outerwear">Coats & Jackets</option>
              <option value="shoes">Shoes</option>
            </select>
          </div>
 
          <div className="ws-form-row">
            <label>Size</label>
            <input
              type="text"
              name="size"
              placeholder="e.g., M, 7–8 yrs"
              value={formDonation.size}
              onChange={handleChange}
            />
          </div>
 
          <div className="ws-form-row">
            <label>Condition</label>
            <select name="condition" value={formDonation.condition} onChange={handleChange}>
              <option value="new">New with tags</option>
              <option value="like-new">Like new</option>
              <option value="gently-used">Gently used</option>
              <option value="well-loved">Well loved</option>
            </select>
          </div>
 
          <div className="ws-form-row">
            <label>Delivery Preference</label>
            <select name="preference" value={formDonation.preference} onChange={handleChange}>
              <option value="pickup">Pickup</option>
              <option value="delivery">Delivery</option>
            </select>
          </div>
 
          <div className="ws-form-row">
            <label>Description</label>
            <textarea
              name="description"
              rows="4"
              placeholder="Add details: brand, season, small flaws, etc."
              value={formDonation.description}
              onChange={handleChange}
            />
          </div>
 
          <div className="ws-form-row">
            <label>Upload Images (1–5)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
            <small>Drag & drop or select images. Minimum 1, maximum 5.</small>
 
            {newImages.length > 0 && (
              <div className="ws-image-preview">
                {newImages.map((img, index) => (
                  <div key={index} className="ws-image-thumb">
                    <img src={URL.createObjectURL(img)} alt={`new-${index}`} />
                    <span onClick={() => removeNewImage(index)}>✕</span>
                  </div>
                ))}
              </div>
            )}
 
            {existingImages.length > 0 && (
              <div className="ws-image-preview">
                {existingImages.map((imgUrl, index) => (
                  <div key={index} className="ws-image-thumb">
                    <img src={imgUrl} alt={`existing-${index}`} />
                    <span onClick={() => removeExistingImage(index)}>✕</span>
                  </div>
                ))}
              </div>
            )}
          </div>
 
          <button type="submit" className="ws-primary-btn">
            {id ? "Update Donation" : "Submit Donation"}
          </button>
          <button type="button" className="ws-secondary-btn" onClick={() => navigate('/donations/my-donations')}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
 
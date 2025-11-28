import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup({ setUser }) {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', phone: '',
        address: '', city: '', province: '', postal_code: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) {
            setError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/user/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Registration failed");
                return;
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('name', data.user.name);
            localStorage.setItem('role', data.user.role);
            if (setUser) {
                setUser({ name: data.user.name });
            }
            navigate('/');
        } catch (err) {
            console.error(err);
        }
        };

        return (
            <div className="ws-auth-page">


                <div className="ws-auth-card">
                    <div className="ws-auth-hero">
                        <h1>Create Your Account</h1>
                        <p>Join the community — donate items or request what you need.</p>
                    </div>

                    {error && <p className="ws-auth-error">{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="ws-form-row">
                            <label>Full Name</label>
                            <input name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
                        </div>

                        <div className="ws-grid-2">
                            <div className="ws-form-row">
                                <label>Email</label>
                                <input type="email" name="email" placeholder="name@example.com" value={formData.email} onChange={handleChange} required />
                            </div>
                            <div className="ws-form-row">
                                <label>Password</label>
                                <input type="password" name="password" placeholder="Min. 6 characters" value={formData.password} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="ws-form-row">
                            <label>Phone Number</label>
                            <input name="phone" placeholder="(123) 456-7890" value={formData.phone} onChange={handleChange} />
                        </div>

                        <div className="ws-form-row">
                            <label>Street Address</label>
                            <input name="address" placeholder="123 Main St" value={formData.address} onChange={handleChange} />
                        </div>

                        <div className="ws-grid-2">
                            <div className="ws-form-row">
                                <label>City</label>
                                <input name="city" placeholder="Toronto" value={formData.city} onChange={handleChange} />
                            </div>

                            <div className="ws-form-row">
                                <label>Province</label>
                                <select
                                    name="province"
                                    value={formData.province}
                                    onChange={handleChange}
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
                        </div>

                        <div className="ws-form-row">
                            <label>Postal Code</label>
                            <input name="postal_code" placeholder="M1A 1A1" value={formData.postal_code} onChange={handleChange} />
                        </div>

                        <button type="submit" className="ws-auth-btn">Register</button>
                    </form>

                    <p className="ws-auth-switch">
                        Already have an account? <Link to="/login">Login here</Link>
                    </p>
                </div>
            </div>
        );
    };

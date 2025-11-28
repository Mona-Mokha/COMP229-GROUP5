import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
 
export default function Login({ setUser }) {
    const [form, setForm] = useState({
        email: '',
        password: '',
    });
 
    const [error, setError] = useState('');
    const navigate = useNavigate();
 
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        setError('');
    }
 
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form)
            })
 
            const data = await response.json();
 
            if (!response.ok) {
                throw new Error(data.message || 'Failed to login');
            }
 
            localStorage.setItem('token', data.token);
            localStorage.setItem('name', data.user.name);
            localStorage.setItem('role', data.user.role);
            if (setUser) {
                setUser({ name: data.user.name });
            }
            navigate('/');
 
        } catch (error) {
            setError(error.message);
        }
    }
 
    return (
        <div className="ws-auth-page">
            <div className="ws-auth-card">
 
                <h1>Welcome Back</h1>
                <p className="ws-auth-subtitle">Login to continue sharing and requesting donations</p>
 
                {error && <p className="ws-auth-error">{error}</p>}
 
                <form onSubmit={handleSubmit} className="ws-auth-form">
                    <label>Email Address</label>
                    <input
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
 
                    <label>Password</label>
                    <input
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
 
                    <button type="submit" className="ws-primary-btn ws-auth-btn">
                        Login
                    </button>
                </form>
 
                <p className="ws-auth-footer">
                    Don’t have an account?
                    <Link to="/signup"> Create account</Link>
                </p>
            </div>
        </div>
    );
};
 
 
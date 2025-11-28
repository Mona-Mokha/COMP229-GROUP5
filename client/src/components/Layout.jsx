import { Link, Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import { useState, useEffect } from "react";
import logo from "../assets/logo.png"; // WearShare logo

export default function Layout({ user, handleLogout }) {
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);

    useEffect(() => {
    const fetchUnread = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("/api/notification", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          const unreadCount = data.notifications.filter(n => !n.read).length;
          setUnread(unreadCount);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchUnread();
  }, []);

  return (
    <div className="ws-layout">
      <header className="ws-header">
        <nav className="ws-navbar">
          <div className="ws-brand">
            <Link to="/">
              <img src={logo} alt="WearShare logo" className="ws-logo-img" />
            </Link>
          </div>

          <ul className="ws-nav-links">
            <li><Link to="/">Home</Link></li>

            {!user ? (
              <>
                <li><Link to="/how-it-works">How It Works</Link></li>
                <li><Link to="/donations/browse">Donations</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/login">Login</Link></li>
              </>
            ) : (
              <>
                <li className="dropdown">
                  <span>Donation ▾</span>
                  <ul className="dropdown-menu">
                    <li><Link to="/donations/submit">Post Donation</Link></li>
                    <li><Link to="/donations/browse">Browse Donations</Link></li>
                    <li><Link to="/donations/my-donations">My Donations</Link></li>
                  </ul>
                </li>

                <li className="dropdown">
                  <span>My Requests ▾</span>
                  <ul className="dropdown-menu">
                    <li><Link to="/my-requests">View My Requests</Link></li>
                    <li><Link to="/donation-requests">View Donation Requests</Link></li>
                  </ul>
                </li>

                <li><Link to="/profile">Account</Link></li>
                <li>
                  <span onClick={() => { handleLogout(); navigate('/login'); }}>Logout</span>
                </li>
                <li className="ws-notification-icon">
                  <Link to="/notifications" >
                    <FaBell/>
                    { unread > 0 && <span className="ws-badge" style={{color:"red", fontWeight:"bold", padding:"2px"}}>{unread}</span>}
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>

      <main className="ws-main">
        <Outlet />
      </main>

      <footer className="ws-footer">
        <div className="ws-footer-container">
          {/* Column 1 – Logo & About */}
          <div className="ws-footer-col">
            <h3 className="ws-footer-logo">WearShare</h3>
            <p>
              Connecting communities through clothing donations. Give what you no
              longer wear and support families in need.
            </p>
          </div>

          {/* Column 2 – Quick Links */}
          <div className="ws-footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/donations/browse">Browse Donations</a></li>
              <li><a href="/how-it-works">How It Works</a></li>
            </ul>
          </div>

          {/* Column 3 – Help */}
          <div className="ws-footer-col">
            <h4>Support</h4>
            <ul>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 4 – Newsletter */}
          <div className="ws-footer-col">
            <h4>Stay Updated</h4>
            <p>Be the first to know community donation drives & updates.</p>
            <div className="ws-footer-newsletter">
              <input type="email" placeholder="Enter your email" />
              <button>Subscribe</button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="ws-footer-bottom">
          <p>© {new Date().getFullYear()} WearShare. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

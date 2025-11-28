import { Link } from "react-router-dom";
 
export default function Home() {
  return (
    <div className="ws-home-page">
      <section className="ws-hero-full" id="about">
        <div className="ws-hero-overlay">
          <div className="ws-hero-content">
            <h1>Share What You Don’t Wear</h1>
            <p>
              Turn your gently-used clothes into support for neighbours in need.
              Donate, browse, and request items directly in your community.
            </p>
            <button className="ws-primary-btn">Start Donating</button>
          </div>
        </div>
      </section>
 
      {/* ABOUT*/}
      <section className="ws-section" id="about">
        <h2 className="ws-section-title">About WearShare</h2>
        <p className="ws-section-subtitle">
          A simple way to give clothing a second life.
        </p>
 
        <div className="ws-features-grid">
          <div className="ws-feature-card">
            <div className="ws-feature-icon">🧥</div>
            <h3>Easy Donations</h3>
            <p>
              Upload photos, add size & condition, and publish your donation in
              just a few clicks.
            </p>
          </div>
 
          <div className="ws-feature-card">
            <div className="ws-feature-icon">🌍</div>
            <h3>Local Impact</h3>
            <p>
              Connect with people near you so clothing stays in the community,
              not in landfills.
            </p>
          </div>
 
          <div className="ws-feature-card">
            <div className="ws-feature-icon">👨‍👩‍👧‍👦</div>
            <h3>For Every Family</h3>
            <p>
              Browse clothing by size, season, and category to find what your
              family needs most.
            </p>
          </div>
 
          <div className="ws-feature-card">
            <div className="ws-feature-icon">✅</div>
            <h3>Safe & Organized</h3>
            <p>
              Coordinate pickup or drop-off through the platform with clear
              item details.
            </p>
          </div>
        </div>
      </section>
 
      {/* PROMO / “WE KNOW DONATIONS” SECTION */}
      <section className="ws-section ws-section-alt">
        <div className="ws-promo">
          <div className="ws-promo-text">
            <h2>We understand clothing donations.</h2>
            <p>
              From winter coats to kids&apos; shoes, WearShare helps you send
              the right items to the right people at the right time.
            </p>
            <p>
              Use WearShare to organise community drives, support shelters, or
              simply share with neighbours.
            </p>
            <Link to="/how-it-works" className="ws-secondary-btn">See How It Works</Link>
          </div>
 
          <div className="ws-promo-image-wrap">
            <img
              className="ws-promo-image"
              src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80"
              alt="Clothes prepared for donation"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
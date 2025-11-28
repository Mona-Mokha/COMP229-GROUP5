import { Link } from "react-router-dom";
 
export default function HowItWorks() {
  return (
    <div className="hiw-page">
 
      {/* HERO SECTION */}
      <section className="hiw-hero">
        <div className="hiw-hero-content">
          <h1>How WearShare Works</h1>
          <p>Giving your clothes a second life has never been easier.</p>
          <Link to="/donations" className="hiw-cta-btn">
            Start Donating
          </Link>
        </div>
        <div className="hiw-hero-image">
          <img
            src="https://images.unsplash.com/photo-1669532673647-b1185ea1a594?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZG9uYXRpb24lMjBjbG90aGVzfGVufDB8fDB8fHww%22"
            alt="Donation process"
          />
        </div>
      </section>
 
      {/* STEPS SECTION */}
      <section className="hiw-steps">
        <h2>Follow 3 Easy Steps</h2>
        <div className="hiw-step-cards">
 
          <div className="hiw-step-card">
            <div className="hiw-step-number">01</div>
            <h3>Add Your Donation</h3>
            <p>Upload photos, select size & category, and share with the community.</p>
          </div>
 
          <div className="hiw-step-card">
            <div className="hiw-step-number">02</div>
            <h3>Connect Locally</h3>
            <p>Families near you can browse, request, and claim items safely.</p>
          </div>
 
          <div className="hiw-step-card">
            <div className="hiw-step-number">03</div>
            <h3>Impact Your Community</h3>
            <p>Coordinate drop-offs or pickups and see the positive change you made.</p>
          </div>
 
        </div>
      </section>
 
      {/* CTA BANNER */}
      <section className="hiw-banner">
        <h2>Ready to Make a Difference?</h2>
        <Link to="/donations" className="hiw-cta-btn banner-btn">
          Donate Now
        </Link>
      </section>
    </div>
  );
}
 
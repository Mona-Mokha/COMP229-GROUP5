export default function ContactUs() {
  return (
    <div className="ws-contact-page">
      {/* HERO */}
      <section className="ws-contact-hero">
        <h1>Contact WearShare</h1>
        <p>We’re here to help you with donations, requests, or platform support.</p>
      </section>
 
      {/* MAIN CONTENT */}
      <section className="ws-contact-wrapper">
        {/* FORM SECTION */}
        <div className="ws-contact-form-card">
          <h2>Send Us a Message</h2>
          <p>Fill out the form and our team will get back to you as soon as possible.</p>
 
          <form className="ws-contact-form">
            <input type="text" placeholder="Your Name*" required />
            <input type="email" placeholder="Email Address*" required />
            <input type="text" placeholder="Phone (optional)" />
            <textarea placeholder="Your Message*" required />
            <button type="submit" className="ws-primary-btn">
              Send Message
            </button>
          </form>
        </div>
 
        {/* CONTACT INFO */}
        <div className="ws-contact-info">
          <h2>Reach Us Directly</h2>
 
          <ul>
            <li><strong>Email:</strong> support@wearshare.org</li>
            <li><strong>Phone:</strong> +1 (555) 302-8891</li>
            <li><strong>Address:</strong> Kitchener, Ontario, Canada</li>
          </ul>
 
          <div className="ws-contact-socials">
            <a href="#">🌐</a>
            <a href="#">📘</a>
            <a href="#">📸</a>
            <a href="#">🐦</a>
          </div>
        </div>
      </section>
    </div>
  );
};
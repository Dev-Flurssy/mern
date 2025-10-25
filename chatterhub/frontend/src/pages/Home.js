// src/pages/Home.jsx
import { useEffect, useRef } from "react";
import "../styles/Home.css";
import pic1 from "../assets/chatter-female-1.jpg";
import ctaBg from "../assets/chatter-male-1.jpg";

export default function Home() {
  const scrollRef = useRef(null);

  // Auto scroll for features section
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    let scrollAmount = 0;

    const scrollInterval = setInterval(() => {
      if (scrollContainer) {
        scrollAmount += 2;
        if (scrollAmount >= scrollContainer.scrollWidth) {
          scrollAmount = 0;
        }
        scrollContainer.scrollLeft = scrollAmount;
      }
    }, 30);

    return () => clearInterval(scrollInterval);
  }, []);

  return (
    <main>
      {/* Hero Section */}
      <section
        className="hero-section"
        style={{ backgroundImage: `url(${pic1})` }}
      >
        <div className="hero-overlay">
          <div className="hero-text">
            <h2>Experience Happiness with Chatterhub</h2>
            <p>
              Join thousands of users enjoying seamless, secure, and stress-free
              connections. Your communication, simplified.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary">Get Started</button>
              <button className="btn-secondary">Learn More</button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Why Choose Chatterhub?</h2>
        <div className="features-scroll" ref={scrollRef}>
          {[
            "Fast & Secure Messaging",
            "Private Conversations",
            "Group Chats",
            "Media Sharing",
            "Custom Emojis",
            "Voice & Video Calls",
            "Community Channels",
            "Cloud Backup",
            "Cross-Platform Sync",
            "Fun & Simple UI",
          ].map((feature, index) => (
            <div className="feature-card" key={index}>
              <h3>{feature}</h3>
              <p>
                {feature} makes your chatting experience smoother, safer, and
                more enjoyable.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="howitworks-section">
        <h2>How It Works</h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Sign Up</h3>
            <p>Create your free account in minutes and set up your profile.</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Connect</h3>
            <p>
              Start chatting with friends, family, and communities instantly.
            </p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Enjoy</h3>
            <p>
              Experience fast, secure, and fun communication with Chatterhub.
            </p>
          </div>
          <div className="step-card">
            <div className="step-number">4</div>
            <h3>Chat</h3>
            <p>Send messages, share media, and have fun conversations daily.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="cta-section"
        style={{ backgroundImage: `url(${ctaBg})` }}
      >
        <div className="cta-overlay">
          <h2>Ready to Start Chatting?</h2>
          <p>Download Chatterhub today and stay connected with what matters.</p>
          <button className="btn-accent">Download Now</button>
        </div>
      </section>
    </main>
  );
}

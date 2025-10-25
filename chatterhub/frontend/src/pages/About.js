import React from "react";
import "../styles/About.css";
import { FaBullseye, FaEye } from "react-icons/fa";

export default function AboutPage() {
  return (
    <main className="about-page">
      <section className="about-intro">
        <h1>About Chatterhub</h1>
        <p>
          At Chatterhub, we believe conversations should be simple, secure, and
          enjoyable. Our platform is designed to help you stay connected with
          friends, family, and communities—without the clutter.
        </p>
      </section>

      <section className="about-mission">
        <div className="mission-card">
          <FaBullseye className="mission-icon" />
          <h2>Our Mission</h2>
          <p>
            To simplify digital communication and create a space where everyone
            feels connected, safe, and valued.
          </p>
        </div>
        <div className="mission-card">
          <FaEye className="mission-icon" />
          <h2>Our Vision</h2>
          <p>
            To become the most trusted global hub for conversations that inspire
            happiness, collaboration, and growth.
          </p>
        </div>
      </section>

      <section className="about-testimonials">
        <h2>What Our Users Say</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <img src="/users/amina.jpg" alt="Amina" className="user-img" />
            <p>
              "Chatterhub has completely changed the way I connect with my
              family. It’s fast, secure, and feels so personal."
            </p>
            <h4>- Amina, Lagos</h4>
          </div>
          <div className="testimonial-card">
            <img src="/users/david.jpg" alt="David" className="user-img" />
            <p>
              "I love the clean design and the simplicity. Finally, a chat app
              that just works!"
            </p>
            <h4>- David, Nairobi</h4>
          </div>
          <div className="testimonial-card">
            <img src="/users/sarah.jpg" alt="Sarah" className="user-img" />
            <p>
              "Being part of my community on Chatterhub makes me feel more
              connected than ever."
            </p>
            <h4>- Sarah, Accra</h4>
          </div>
        </div>
      </section>
    </main>
  );
}

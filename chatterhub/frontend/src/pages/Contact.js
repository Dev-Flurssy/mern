import React from "react";
import "../styles/Contact.css";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

export default function ContactPage() {
  return (
    <main className="contact-page">
      <div className="contact-container">
        <div className="contact-info">
          <h2>Get in Touch</h2>
          <p>
            We’d love to hear from you! Whether it’s a question, feedback, or a
            complaint, our team is here to help.
          </p>
          <ul>
            <li>
              <FaEnvelope /> support@chatterhub.com
            </li>
            <li>
              <FaPhoneAlt /> +234 801 234 5678
            </li>
            <li>
              <FaMapMarkerAlt /> Lagos, Nigeria
            </li>
          </ul>
        </div>

        <div className="contact-form">
          <h2>Log a Complaint</h2>
          <form>
            <div className="form-group">
              <label>Name</label>
              <input type="text" placeholder="Your full name" required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="Your email" required />
            </div>
            <div className="form-group">
              <label>Subject</label>
              <input type="text" placeholder="Complaint subject" required />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea
                placeholder="Write your complaint..."
                rows="5"
                required
              />
            </div>
            <button type="submit" className="btn-primary">
              Submit Complaint
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

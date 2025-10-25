import React from "react";
import { Link } from "react-router-dom";
import {
  FaWhatsapp,
  FaInstagram,
  FaEnvelope,
  FaTiktok,
  FaBalanceScale,
  FaFileContract,
} from "react-icons/fa";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h2>Chatterhub</h2>
          <p>
            Connecting people with joy and ease.
            <br />
            Chat smart.
            <br />
            Chat Chatterhub.
          </p>
        </div>

        <div className="footer-links">
          <h4>Contact Us</h4>
          <ul>
            <li>
              <a
                href="https://wa.me/2347034105180"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaWhatsapp /> WhatsApp
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com/chatterhub"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram /> Instagram
              </a>
            </li>
            <li>
              <a href="mailto:support@chatterhub.com">
                <FaEnvelope /> Email
              </a>
            </li>
            <li>
              <a
                href="https://tiktok.com/@chatterhub"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTiktok /> TikTok
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-contact">
          <h4>Legal</h4>
          <ul>
            <li>
              <Link to="/privacy">
                <FaBalanceScale /> Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms">
                <FaFileContract /> Terms of Service
              </Link>
            </li>
            <li>
              <Link to="/cookies">
                <FaFileContract /> Cookie Policy
              </Link>
            </li>
            <li>
              <Link to="/disclaimer">
                <FaFileContract /> Disclaimer
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} Chatterhub. All rights reserved.
        </p>
        <div className="footer-socials">
          <a
            href="https://wa.me/2347034105180"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp />
          </a>
          <a
            href="https://instagram.com/chatterhub"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram />
          </a>
          <a
            href="mailto:support@chatterhub.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaEnvelope />
          </a>
          <a
            href="https://tiktok.com/@chatterhub"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTiktok />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;

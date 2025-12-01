import React from "react";

export default function AboutUs() {
  return (
    <div className="about-container">
  <h2 className="about-title">About Us</h2>

  <p className="about-text">
    Local Services is your trusted platform to find verified professionals
    quickly and safely.
  </p>

  <h3 className="about-section-title">Our Mission</h3>
  <p className="about-text">
    We aim to connect users with skilled service providers such as electricians,
    plumbers, beauticians, tutors, and more.
  </p>

  <h3 className="about-section-title">Why Choose Us?</h3>
  <ul className="about-list">
    <li>100% Verified Service Providers</li>
    <li>Easy Search System</li>
    <li>Fast & Secure Platform</li>
    <li>Provider Profile Management</li>
  </ul>

  <h3 className="about-section-title">Contact Us</h3>
  <div className="about-contact">
    <p>Email: support@localservices.com</p>
    <p>Phone: +91 98765 43210</p>
  </div>
</div>
  );
}
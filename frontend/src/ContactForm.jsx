import React, { useState } from "react";
import axios from "axios";

function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/contact-messages', formData);
      alert("✅ Message sent successfully!");
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      alert("❌ Failed to send message. Please try again.");
    }
  };

  return (
    <section className="contact" id="contact">
      <div className="container grid">
        <div>
          <h2 style={{ fontSize: 42, marginTop: 0 }}>
            CONTACT <span className="text-accent">US</span>
          </h2>
          <p style={{ color: "#6b6f72" }}>
            Have any question? Send us a message and we’ll reply soon.
          </p>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="E-mail Address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
          <textarea
            rows="4"
            placeholder="How can we help?"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            required
          ></textarea>
          <button type="submit" className="btn-submit">Submit</button>
        </form>
      </div>
    </section>
  );
}

export default ContactSection;

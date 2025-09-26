import React from "react";
import { useNavigate } from "react-router-dom";

import labImg from "./assets/pic/departments/lab.png";
import dentalImg from "./assets/pic/departments/dental.png";
import primaryImg from "./assets/pic/departments/primary.png";
import pediatricsImg from "./assets/pic/departments/pediatrics.png";

import d1 from "./assets/pic/experts/d1.png";
import d2 from "./assets/pic/experts/d2.png";
import d3 from "./assets/pic/experts/d3.png";
import d4 from "./assets/pic/experts/d4.png";

import g1 from "./assets/pic/gallery/g1.jpg";
import g2 from "./assets/pic/gallery/g2.jpg";
import g3 from "./assets/pic/gallery/g3.jpg";
import g4 from "./assets/pic/gallery/g4.jpg";

import s1 from "./assets/pic/services/s1.png";
import s2 from "./assets/pic/services/s2.png";
import s3 from "./assets/pic/services/s3.png";
import s4 from "./assets/pic/services/s4.png";

import disease from "./assets/pic/topic/disease.jpg";
import prevention from "./assets/pic/topic/prevention.jpg";
import cure from "./assets/pic/topic/cure.jpg";
import news from "./assets/pic/topic/news.jpg";


import about1 from "./assets/pic/about/about1.png";
import ContactSection from "./ContactForm";
import { FaHeartbeat } from "react-icons/fa";




function HomePage() {
    const navigate = useNavigate();

    const goBooking = () => {
        navigate("/search-doctor" );
    };
    const goToBookingFlow = () => {
        navigate( "/search-doctor");
    };

    return (
        <>
            {/* HERO */}
            <section className="hero" id="home">
                <div className="container grid">
                    <div>
                        <h1>Your Health Care <span className="text-accent">Center</span></h1>
                        <p>MediConnect proudly delivers fast, trusted, and accessible healthcare — anytime, anywhere.</p>
                        <div style={{ marginTop: 18 }}>
                            <button className="btn-getappointment" onClick={goToBookingFlow}>GET APPOINTMENT</button>
                        </div>
                    </div>

                    <div className="booking-card">
                        <h3>📅👨‍⚕️ Find Your Doctor</h3>
                        <button className="btn-booking" onClick={goBooking}>Booking Now</button>
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section className="features" id="feature">
                <div className="container row">
                    <div className="outstanding">💳 Online Payment<br /><span style={{ opacity: .9, fontWeight: 400 }}>Pay with EFT system.</span></div>
                    <div className="outstanding">🕘 24/7 Support <br /><span style={{ opacity: .9, fontWeight: 400 }}>Get real-time medical assistance.</span></div>
                    <div className="outstanding">🚑 Emergency<br /><span style={{ opacity: .9, fontWeight: 400 }}>Quick response when it matters.</span></div>
                    <div className="outstanding">🩺 Expert Care<br /><span style={{ opacity: .9, fontWeight: 400 }}>Trusted doctors. Personalized service.</span></div>
                </div>
            </section>

            {/* ABOUT */}
            <section className="about" id="about">
                <div className="container grid">
                    <div className="about-text">
                        <h2>About Our <span className="text-accent">MediConnect Group</span></h2>
                        <p>MediConnect is a digital healthcare companion designed to make access to medical care simple, fast, and reliable.</p>
                        <p>We empower patients to find the right doctors, book appointments online, and manage their health journey through a seamless and secure platform. No more waiting rooms or confusing processes—just clarity, convenience, and care.</p>
                        <p>At MediConnect, we believe healthcare should be personal, proactive, and always within reach. Whether it’s a routine check-up or urgent need, MediConnect Group puts your health at your fingertips.</p>
                        <p style={{
                            textAlign: "center",
                            fontWeight: "600",
                            fontSize: "1.1rem",
                            color: "#1e293b",
                            marginTop: "40px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "10px"
                        }}>
                            <FaHeartbeat color="#e11d48" />
                            From appointment to assurance — MediConnect Group puts healthcare in your hands.
                        </p>
                    </div>
                    <div className="about-img"><img src={about1} alt="About MediConnect Group" /></div>
                </div>
            </section>

            {/* SERVICES */}
            <section className="section" id="services" style={{ background: "#fff" }}>
                <div className="container">
                    <h2 className="section-title">Awesome <span className="text-accent">Services</span></h2>
                    <p className="section-sub">MediConnect Group is committed to delivering the highest quality healthcare services—every single day.</p>
                    <div className="cards">
                        {[{ img: s1, t: "24/7 Service", m: "Access care anytime, day or night. Get support, book appointments, or find help—24/7." },
                        { img: s2, t: "Find the Right Doctor", m: "Search by specialty or location. View profiles, qualifications & availability in one click." },
                        { img: s3, t: "Book Appointments Instantly", m: "No more waiting rooms. Schedule, reschedule, or cancel – anytime, anywhere." },
                        { img: s4, t: "Smarter Doctor Access", m: "Real-time doctor availability, updated schedules, and instant booking confirmations." }
                        ].map((it, i) => (
                            <article key={i} className="card">
                                <img src={it.img} alt={it.t} />
                                <div className="body"><div className="title">{it.t}</div><div className="meta">{it.m}</div></div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="cta" id="appointment">
                <div className="container">
                    <div className="title">We Provide Trusted, Comprehensive Healthcare Services for Everyone.</div>
                    <button className="btn-getappointment2" onClick={goToBookingFlow}>GET APPOINTMENT</button>
                </div>
            </section>

            {/* DEPARTMENTS */}
            <section className="section" style={{ background: "#fff" }}>
                <div className="container">
                    <h2 className="section-title">Find Care <span className="text-accent">That Fits You</span></h2>
                    <p className="section-sub">Explore top medical fields available on MediConnect —from cardiology to pediatrics.</p>
                    <div className="cards">
                        {[{ img: labImg, t: "Everyday Health", m: "General checkups, fevers, headaches, prescriptions, and common concerns." },
                        { img: dentalImg, t: "Women’s Health", m: "Menstrual care, pregnancy support, fertility, and gynecological advice." },
                        { img: primaryImg, t: "Skin & Allergies", m: "Rashes, acne, allergies, chronic skin issues, and skincare guidance." },
                        { img: pediatricsImg, t: "Child & Teen Care", m: "Pediatricians for growth, vaccines, and age-specific conditions." }
                        ].map((it, i) => (
                            <article key={i} className="card">
                                <img src={it.img} alt={it.t} />
                                <div className="body"><div className="title">{it.t}</div><div className="meta">{it.m}</div></div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* GALLERY */}
            <section className="section gallery">
                <div className="container">
                    <h2 className="section-title">Our Photo <span className="text-accent">Gallery</span></h2>
                    <div className="row">
                        {[g1, g2, g3, g4].map((g, i) => (<img key={i} src={g} alt={`g${i}`} />))}
                    </div>
                </div>
            </section>

            {/* EXPERTS */}
            <section className="section" id="experts">
                <div className="container">
                    <h2 className="section-title">Our <span className="text-accent">Experts</span></h2>
                    <div className="doctor-grid">
                        {[
                            { img: d1, name: "Dr. Henry Jones", role: "Cardiologist" },
                            { img: d2, name: "Dr. Elizabeth Henry", role: "Dentist" },
                            { img: d3, name: "Dr. Williams Jones", role: "Neurologist" },
                            { img: d4, name: "Dr. Smith Johnson", role: "Gynecologist" }
                        ].map((doc, i) => (
                            <div className="doctor-card" key={i}>
                                <img src={doc.img} alt={doc.name} className="doctor-img" />
                                <div className="doctor-details">
                                    <h4>{doc.name}</h4>
                                    <p>- {doc.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* TESTIMONIALS */}
            <section className="section testi" style={{ background: "#fff" }}>
                <div className="container">
                    <h2 className="section-title">
                        TESTI <span className="text-accent">MONIALS</span>
                    </h2>
                    <div className="row">
                        {[
                            {
                                name: "Simone Andreea",
                                role: "Lecturers",
                                quote:
                                    "MediConnect helped me find the right specialist within minutes. It’s fast, secure, and so convenient!",
                            },
                            {
                                name: "John Carter",
                                role: "Engineer",
                                quote:
                                    "I used to wait weeks for appointments—now I book them in seconds. MediConnect changed how I manage my health.",
                            },
                            {
                                name: "Lisa Monroe",
                                role: "Freelancers",
                                quote:
                                    "The doctor I found through MediConnect really listened. Game changer!",
                            },
                        ].map((person, i) => (
                            <div className="box" key={i}>
                                <div className="name">{person.name}</div>
                                <div className="role">{person.role}</div>
                                <div className="stars" style={{ color: "#fbc02d", margin: "5px 0" }}>
                                    {"⭐️⭐️⭐️⭐️⭐️"}
                                </div>
                                <p style={{ color: "#6b6f72" }}>{person.quote}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* TOPICS */}
            <section className="section topics" id="topics">
                <div className="container">
                    <h2 className="section-title">
                        HEALTH <span className="text-accent">TOPICS</span>
                    </h2>
                    <div className="cards" style={{ display: 'flex', justifyContent: 'left', gap: '20px'}}>
                        {[
                            { img: disease, title: "Diseases", id: 1, des: "Explore articles on symptoms, treatments, and common diseases." },
                            { img: prevention, title: "Preventions", id: 2, des: "Learn how to protect yourself and your loved ones with expert prevention tips." },
                            { img: cure, title: "Cures", id: 3, des: "Discover the latest cures and treatment options for various health conditions." },
                            { img: news,  title: "Health News & Discoveries", id: 4, des: "Explore the newest health updates and discoveries." }, 
                        ].map((it, i) => (
                            <article
                                className="card"
                                key={i}
                                onClick={() => navigate(`/category/${it.id}`)}
                                style={{
                                    cursor: "pointer",
                                    width: '400px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    textAlign: 'center',
                                    height: '340px',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                    transition: 'transform 0.3s ease',
                                }}
                            >
                                <img
                                    alt={it.title}
                                    src={it.img}
                                    className="topic-img"
                                    style={{
                                        width: '100%',
                                        height: '200px',
                                        objectFit: 'cover',
                                    }}
                                />
                                <div className="body" style={{ padding: '15px' }}>
                                    <div className="title" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{it.title}</div>
                                    <div className="meta" style={{ fontSize: '0.9rem', color: '#777' }}>{it.des}</div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>



            {/* CONTACT US */}
            <ContactSection />
        </>
    );
}

export default HomePage;
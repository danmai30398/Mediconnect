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

import about1 from "./assets/pic/about/about1.png";
import ContactSection from "./ContactForm"; 





function HomePage() {
    const navigate = useNavigate();

    const goBooking = () => {
        const token = localStorage.getItem("token");
        navigate(token ? "/search-doctor" : "/login");
    };
    const goToBookingFlow = () => {
        const token = localStorage.getItem("token");
        navigate(token ? "/search-doctor" : "/login");
    };

    return (
        <>
            {/* HERO */}
            <section className="hero" id="home">
                <div className="container grid">
                    <div>
                        <h1>Your Health Care <span className="text-accent">Center</span></h1>
                        <p>MediConnect Health Care System has gladly served the encompassing regions for more than 35 years.</p>
                        <div style={{ marginTop: 18 }}>
                            <button className="btn btn-outline" onClick={goToBookingFlow}>GET APPOINTMENT</button>
                        </div>
                    </div>

                    <div className="booking-card">
                        <h3>✅ Booking Here Now</h3>
                        <button className="btn btn-primary" onClick={goBooking}>Booking Now</button>
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section className="features" id="feature">
                <div className="container row">
                    <div className="card">💳 Online Payment<br /><span style={{ opacity: .9, fontWeight: 400 }}>Pay with EFT system.</span></div>
                    <div className="card">🕘 Online Help<br /><span style={{ opacity: .9, fontWeight: 400 }}>24/7 medical line.</span></div>
                    <div className="card">🚑 Emergency<br /><span style={{ opacity: .9, fontWeight: 400 }}>Ready for emergency.</span></div>
                    <div className="card">👌 Top Care<br /><span style={{ opacity: .9, fontWeight: 400 }}>Get top care & satisfied.</span></div>
                </div>
            </section>

            {/* ABOUT */}
            <section className="about" id="about">
                <div className="container grid">
                    <div className="about-text">
                        <h2>About Our <span className="text-accent">MediConnect</span></h2>
                        <p>We additionally work very closely with our community healthcare group who provide antenatal, postnatal and nursing services and different specialist provision inclusive of the quitters scheme.</p>
                        <p>This 24 month benefit covers all ranges of basic upkeep. Notwithstanding every one of the things included on the Full administration we cover things that are frequently suggested for substitution like clockwork.</p>
                        
                        <button className="btn btn-primary">Read More</button>
                    </div>
                    <div className="about-img"><img src={about1} alt="About MediConnect" /></div>
                </div>
            </section>

            {/* SERVICES */}
            <section className="section" id="services" style={{ background: "#fff" }}>
                <div className="container">
                    <h2 className="section-title">Awesome <span className="text-accent">Services</span></h2>
                    <p className="section-sub">Medicinal Service Company puts stock in conveying the most elevated quality administration every day.</p>
                    <div className="cards">
                        {[{ img: s1, t: "24/7 Service", m: "Always ready to help you day and night." },
                        { img: s2, t: "Cancer Clinic", m: "Specialized treatment and consultations." },
                        { img: s3, t: "Blood Test", m: "Accurate and fast laboratory results." },
                        { img: s4, t: "Medical Counselling", m: "Talk with our senior medical experts." }
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
                    <div className="title">We Offer Quality Full and Affordable Service For You.</div>
                    <button className="btn btn-primary" onClick={goToBookingFlow}>GET APPOINTMENT</button>
                </div>
            </section>

            {/* DEPARTMENTS */}
            <section className="section" style={{ background: "#fff" }}>
                <div className="container">
                    <h2 className="section-title">Our Special <span className="text-accent">Department</span></h2>
                    <p className="section-sub">Department is responsible for Medical and Health Care helpful to patients.</p>
                    <div className="cards">
                        {[{ img: labImg, t: "Lab Test Department", m: "The lab offers tests covering full range of pathology." },
                        { img: dentalImg, t: "Dental Department", m: "Dental program helps patient lives." },
                        { img: primaryImg, t: "Primary Health", m: "Provided by general practitioners and nurses." },
                        { img: pediatricsImg, t: "Pediatrics Department", m: "Keep your child healthy and safe." }
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
                    <div className="cards">
                        {[{ img: d1, n: "Dr. Henry Jones", r: "Senior Specialist" },
                        { img: d2, n: "Dr. Elizabeth Henry", r: "Cardiologist" },
                        { img: d3, n: "Dr. Williams Jones", r: "Orthopedic Specialist" },
                        { img: d4, n: "Dr. Smith Johnson", r: "Neurologist" }
                        ].map((it, i) => (
                            <article key={i} className="card">
                                <img src={it.img} alt={it.n} />
                                <div className="body"><div className="title">{it.n}</div><div className="meta">{it.r}</div></div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS */}
            <section className="section testi" style={{ background: "#fff" }}>
                <div className="container">
                    <h2 className="section-title">TESTI <span className="text-accent">MONIALS</span></h2>
                    <div className="row">
                        {["Simone Andreea", "John Carter", "Lisa Monroe"].map((name, i) => (
                            <div className="box" key={i}>
                                <div className="name">{name}</div>
                                <div className="role">Engineer</div>
                                <p style={{ color: "#6b6f72" }}>
                                    I had the delight of being an outpatient in your Surgical Unit for foot surgery.
                                    From the moment I strolled in at 6:00AM, until I was released…
                                </p>
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
                    <div className="cards">
                        {[
                            { img: disease, title: "Disease", id: 1 },
                            { img: prevention, title: "Preventions", id: 2 },
                            { img: cure, title: "Cure", id: 3 },
                        ].map((it, i) => (
                            <article
                                className="card"
                                key={i}
                                onClick={() => navigate(`/category/${it.id}`)}
                                style={{ cursor: "pointer" }}
                            >
                                <img alt={it.title} src={it.img} className="topic-img" />
                                <div className="body">
                                    <div className="meta" style={{ marginBottom: 6 }}>📅 25, Jun 2022</div>
                                    <div className="title">{it.title}</div>
                                    <div className="meta">Z Lopez · Pediatrics · eHospital</div>
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
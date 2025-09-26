import React from "react";
import { useNavigate } from "react-router-dom";

function Footer() {
    const navigate = useNavigate();
    return (
        <footer className="footer" id="pages">
            <div className="top">
                <div className="container grid">
                    <div>
                        <h4>MediConnect Group</h4>
                        <p>
                            MediConnect is a digital healthcare platform that connects patients with trusted doctors, allows instant appointment booking, and supports personalized care management—all in one seamless experience.
                        </p>
                    </div>

                    <div style={{ marginTop: 14 }}>
                        <h4>HEALTH <span className="text-accent">TOPICS</span></h4>
                        <div style={{ cursor: "pointer", color: "#bfefff" }} onClick={() => navigate("/category/1")}>DISEASE</div>
                        <div style={{ cursor: "pointer", color: "#bfefff" }} onClick={() => navigate("/category/2")}>PREVENTIONS</div>
                        <div style={{ cursor: "pointer", color: "#bfefff" }} onClick={() => navigate("/category/3")}>CURE</div>
                        <div style={{ cursor: "pointer", color: "#bfefff" }} onClick={() => navigate("/category/4")}>HEALTH NEWS & DISCOVERIES</div>

                    </div>

                    <div>
                        <h4>NAVIGAT<span className="text-accent">ION</span></h4>
                        <a href="#about">About Us</a><br />
                        <a href="#appointment">Appointment</a><br />
                        <a href="#help">Help Center</a><br />
                        <a href="#services">Our Services</a><br />
                        <a href="#experts">Team Details</a><br />
                        <a href="#contact">Contact Us</a>
                    </div>

                    <div>
                        <h4>OUR <span className="text-accent">BRANCHES</span></h4>
                        <ul style={{ listStyle: "none", padding: 0, color: "#bfefff" }}>
                            <li>📍 Ha Noi – 123 Nguyen Trai, Thanh Xuan District</li>
                            <li>📍 Ho Chi Minh – 456 Le Loi, District 1</li>
                            <li>📍 Da Nang – 789 Tran Phu, Hai Chau District</li>
                            <li>📍 Can Tho – 321 Xuan Khanh, Ninh Kieu District</li>
                        </ul>
                    </div>

                    <div>
                        <h4>NEWS <span className="text-accent">LETTER</span></h4>
                        <div className="newsletter" style={{ display: "flex", gap: 8 }}>
                            <input placeholder="Your email" />
                            <button className="go">➤</button>
                        </div>
                    </div>
                </div>
            </div>

            <div
                className="bottom"
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "50px",
                    padding: "10px",
                }}
            >
                Copyright© MediConnect Group. All right reserved.
            </div>
        </footer>
    );
}

export default Footer;

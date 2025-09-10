import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Doctors.css";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function DoctorDetails() {
    const { id } = useParams();
    const [profile, setProfile] = useState([]);
    const [date, setDate] = useState("");
    const [slots, setSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [bookingMsg, setBookingMsg] = useState("");

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/doctors/${id}`)
            .then(res => res.json())
            .then(data => setProfile(data))
            .catch(err => console.error("Fetch error:", err));
    }, [id]);

    const fetchSlots = async () => {
        if (!date) return;
        try {
            setLoadingSlots(true);
            const res = await fetch(`${API_BASE_URL}/api/availabilities?doctor_id=${id}&date=${date}`);
            const data = await res.json();
            setSlots(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingSlots(false);
        }
    };

    const book = async (availability_id) => {
        try {
            setBookingMsg("");
            const stored = localStorage.getItem("MediUser");
            const user = stored ? JSON.parse(stored) : null;
            if (!user) {
                setBookingMsg("Bạn cần đăng nhập trước");
                return;
            }
            const res = await fetch(`${API_BASE_URL}/api/appointments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ patient_id: user.id, availability_id, status: "pending" })
            });
            if (!res.ok) {
                setBookingMsg("Appointment booking failed");
                return;
            }
            setBookingMsg("Appointment booked successfully");
            fetchSlots();
        } catch (e) {
            setBookingMsg("Error booking appointment");
        }
    };

    return (
        <div className="container mt-1">
            <br /> <br /> <br />
            <h2 className="text-center">Book an Appointment Online</h2>
            <h5 className="text-center">Find the Right Doctor - Book an Appointment Easily</h5>

            <div className="row align-items-center mb-3 borderCustom" key={profile.id}>
                <div className="col-md-2 text-center">
                    <img
                        src={`${process.env.PUBLIC_URL}/Images/Doctors/${profile.image}`}
                        alt={profile.name}
                        className="rounded-circle"
                        style={{ width: "150px", height: "auto" }}
                    />
                </div>
                <div className="col-md-5">
                    <div><h2>{profile.name}</h2></div>
                    <div>Qualification: <span className="DocContent"> {profile.qualification} </span></div>
                    <div>Specialization: <span className="DocContent"> {profile.specialization}</span></div>
                    <div>Experience: <span className="DocContent"> {profile.experience} years</span></div>
                    <div>Email: <span className="DocContent"> {profile.email}</span></div>
                    <div>Phone: <span className="DocContent"> {profile.phone}</span></div>
                    <div>{profile.gender ? 'Gender:' : ''} <span className="DocContent"> {profile.gender}</span></div>
                    <div>Date of birth: <span className="DocContent"> {profile.dob}</span></div>
                    <div>Branch: <span className="DocContent"> {profile.city?.city_name || "No city"}</span></div>
                    
                </div>
                <div className="col-md-4 text-center customBooking ">
                    <div><h5>Book an Appointment</h5></div>
                    <div><h6>Choose a date</h6></div>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} onBlur={fetchSlots} />
                    <div className="mt-2"><h6>Available Times</h6></div>
                    {loadingSlots ? (
                        <div>Đang tải...</div>
                    ) : (
                        <div className="d-grid gap-2">
                            {slots.length === 0 ? (
                                <div>Không có khung giờ trống</div>
                            ) : (
                                slots.map(s => (
                                    <button key={s.availability_id} className="btn btn-outline-primary" onClick={() => book(s.availability_id)}>
                                        {s.available_time}
                                    </button>
                                ))
                            )}
                        </div>
                    )}
                    {bookingMsg && <div className="mt-2">{bookingMsg}</div>}
                </div>
            </div>
        </div>
    );
}

export default DoctorDetails;

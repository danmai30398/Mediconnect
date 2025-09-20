import React, { useState, useEffect } from "react";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function PatientWelcomePage() {
    const user = JSON.parse(localStorage.getItem('MediUser'));
    const id = user?.id;

    const [profile, setProfile] = useState({
        user: {
            username: '',
        }
    });

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/user/${id}`)
            .then(res => res.json())
            .then(data => setProfile(data))
            .catch(err => console.error("Fetch error:", err));
    }, [id]);

    return (
        <div className="text-center">
            <br /><br /> <br />
            <h4>Welcome, <span className="text-primary">{profile?.user?.username}</span> </h4>
            <br />
            <p>
                Thank you for choosing <strong>MediConnect Group</strong>.
                We're committed to providing you with the highest quality healthcare.
            </p>
            <p>
                You can now easily <strong>book</strong>, <strong>view</strong>, <strong>reschedule</strong>, or <strong>cancel</strong> your appointments - all in one place.
            </p>
            <p>
                Choose your preferred <strong>doctor</strong> and time slot to receive the care that best fits your needs.
            </p>
            <p>
                Stay on top of your healthcare by keeping track of your appointment status anytime.
            </p>
            <p>
                If you need any assistance, our support team is here to help.
            </p>
            <p style={{ marginTop: '1rem', fontStyle: 'italic' }}>
                Wishing you good health and a pleasant experience!
            </p>
        </div>
    );
}

export default PatientWelcomePage;
import React, { useState, useEffect } from "react";
import "./Doctors.css";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function PatientProfile() {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('MediUser'));

    console.log("User: ", user);

    ///
    // const id = localStorage.getItem('id');
    const id = user?.id;
    // console.log("User ID:", id);

    const [profile, setProfile] = useState();

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/user/${id}`)
            .then(res => res.json())
            .then(data => setProfile(data))
            .catch(err => console.error("Fetch error:", err));
    }, [id]);
    //

    return (
        <div className="container mt-5 text-center">

            <h4>Hello {profile?.user.username}</h4>
            <div className="">
                <img
                    src={profile?.image === 'http://localhost:8000/storage/' ? `${process.env.PUBLIC_URL}/Images/Unknown_person.jpg` : profile?.image}
                    className="rounded-circle"
                    alt="avatar"
                    style={{ width: "150px", height: "auto" }}
                />
            </div>
            <div>
                <div className="row mt-3">
                    <div className="col-6 pe-5 text-end text-secondary">Name</div>
                    <div className="col-6 ps-5 text-start">{profile?.user?.patient?.name}</div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-6 pe-5 text-end text-secondary">Email</div>
                    <div className="col-6 ps-5 text-start">{profile?.user?.patient?.email}</div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-6 pe-5 text-end text-secondary">Phone</div>
                    <div className="col-6 ps-5 text-start">{profile?.user?.patient?.phone}</div>
                </div>

                <hr />
                <div className="row">
                    <div className="col-6 pe-5 text-end text-secondary">{profile?.user?.patient?.dob ? 'Date of birth' : ''}</div>
                    <div className="col-6 ps-5 text-start">{profile?.user?.patient?.dob}</div>
                </div>
                {profile?.user.patient?.dob ? <hr /> : ''}
                <div className="row">
                    <div className="col-6 pe-5 text-end text-secondary">{profile?.user?.patient?.gender ? 'Gender' : ''}</div>
                    <div className="col-6 ps-5 text-start">{profile?.user?.patient?.gender}</div>
                </div>
                {profile?.user.patient?.gender ? <hr /> : ''}
                <div className="row">
                    <div className="col-6 pe-5 text-end text-secondary">Address</div>
                    <div className="col-6 ps-5 text-start">{profile?.user?.patient?.address}</div>
                </div>
            </div>
            <hr />
            <div><button className="col-6 btn btn-light m-3 text-primary" onClick={() => { navigate(`/patientEdit/${id}`) }} >Edit my profile</button></div>
        </div>

    );
}

export default PatientProfile;
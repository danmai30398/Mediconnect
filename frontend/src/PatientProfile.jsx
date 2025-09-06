import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Doctors.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function PatientProfile() {

    const user = JSON.parse(localStorage.getItem('MediUser'));

    console.log("User: ", user);

    ///
    // const id = localStorage.getItem('id');
    const id = user?.id;
    console.log("User ID:", id);

    // const { id } = user.id;
        const [profile, setProfile] = useState({
            username: '',
            // password: '',
            patient: {
                name: '',
                phone: '',
                email: '',
                address: '',
                dob: '',
                gender:'',
                image:''
            }
        });
    
        useEffect(() => {
            fetch(`${API_BASE_URL}/api/user/${id}`)
                .then(res => res.json())
                .then(data => setProfile(data))
                .catch(err => console.error("Fetch error:", err));
                console.log("data:", profile);
        }, [id]);
    //

    return (
        <div className="container mt-5 text-center">

            <h4>Hello {profile.username}</h4>
            <div className="">
                <img
                    src={profile.patient.image ? `${process.env.PUBLIC_URL}/Images/Patients/${profile.patient.image}` : `${process.env.PUBLIC_URL}/Images/Patients/Unknown_person.jpg`}
                    className="rounded-circle"
                    style={{ width: "150px", height: "auto" }}
                />
            </div>
            <div>
                <div className="row">
                    <div className="col-6 pe-5 text-end text-secondary">Name</div>
                    <div className="col-6 ps-5 text-start">{profile.patient.name}</div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-6 pe-5 text-end text-secondary">Email</div>
                    <div className="col-6 ps-5 text-start">{profile.patient.email}</div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-6 pe-5 text-end text-secondary">Phone</div>
                    <div className="col-6 ps-5 text-start">{profile.patient.phone}</div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-6 pe-5 text-end text-secondary">Address</div>
                    <div className="col-6 ps-5 text-start">{profile.patient.address}</div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-6 pe-5 text-end text-secondary">{profile.patient.dob ? 'Date of birth:' : ''}</div>
                    <div className="col-6 ps-5 text-start">{profile.patient.dob}</div>
                </div>
                {profile.patient.dob ? <hr /> : ''}
                <div className="row">
                    <div className="col-6 pe-5 text-end text-secondary">Gender</div>
                    <div className="col-6 ps-5 text-start">{profile.patient.gender}</div>
                </div>
            </div>
            <hr />
            <div><button className="col-6 btn btn-light m-3 text-primary" >Edit your profile</button></div>
        </div>

    );
}

export default PatientProfile;

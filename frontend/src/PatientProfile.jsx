import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Doctors.css";


function PatientProfile() {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('MediUser'));

    console.log("User: ", user);


    return (
        <div className="container mt-5 text-center">

            <h4>Hello {user.username}</h4>
            <div className="">
                <img
                    src={user.image ? `${process.env.PUBLIC_URL}/Images/Patients/${user.image}` : `${process.env.PUBLIC_URL}/Images/Patients/Unknown_person.jpg`}
                    className="rounded-circle"
                    style={{ width: "150px", height: "auto" }}
                />
            </div>
            <div>
                <div className="row">
                    <div className="col-6 pe-5 text-end text-secondary">Name</div>
                    <div className="col-6 ps-5 text-start">{user.name}</div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-6 pe-5 text-end text-secondary">Email</div>
                    <div className="col-6 ps-5 text-start">{user.email}</div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-6 pe-5 text-end text-secondary">Phone</div>
                    <div className="col-6 ps-5 text-start">{user.phone}</div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-6 pe-5 text-end text-secondary">Address</div>
                    <div className="col-6 ps-5 text-start">{user.address}</div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-6 pe-5 text-end text-secondary">{user.dob ? 'Date of birth:' : ''}</div>
                    <div className="col-6 ps-5 text-start">{user.dob}</div>
                </div>
                {user.dob ? <hr /> : ''}
                <div className="row">
                    <div className="col-6 pe-5 text-end text-secondary">Gender</div>
                    <div className="col-6 ps-5 text-start">{user.gender}</div>
                </div>
            </div>
            <hr />
            <div><button className="col-6 btn btn-light m-3 text-primary" >Edit your profile</button></div>
        </div>

    );
}

export default PatientProfile;

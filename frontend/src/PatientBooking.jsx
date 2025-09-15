import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import "./Doctors.css";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


function PatientBooking() {

    const navigate = useNavigate();
    const location = useLocation();

    //lay lai du lieu bac sy
    const { id } = useParams();
    const [docProfile, setDocProfile] = useState([]);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/doctors/${id}`)
            .then(res => res.json())
            .then(data => setDocProfile(data))
            .catch(err => console.error("Fetch error:", err));
    }, [id]);
    // console.log("data 2:", docProfile);

    const selectedTime = location.state?.userSelectedTime;
    const selectedDate = location.state?.userSelectedDate;
    const selectedId = location.state?.userSelectedId;
    // console.log("Da chon:", selectedTime);
    // console.log("Da chon ID:", selectedId);

    //lay lai du lieu patient
    const user = JSON.parse(localStorage.getItem('MediUser'));
    // console.log("User: ", user);
    // const id = localStorage.getItem('id');
    const userId = user?.id;
    console.log("User ID:", userId);
    const [userProfile, setUserProfile] = useState();

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/user/${userId}`)
            .then(res => res.json())
            .then(data => setUserProfile(data))
            .catch(err => console.error("Fetch error:", err));
        console.log("data:", userProfile);
    }, [userId]);

    //confirm booking or not
    const [confirm, setConfirm] = useState();
    const handleConfirm = () => {
        setConfirm("Are you sure you want to book this appointment?");
    }

    const handleNo = () => {
        setConfirm('');
    }

    const [error, setError] = useState(null);

    //luu du lieu vao database sau khi confirm booking
    const formField = {
        patient_id: userProfile?.user?.patient?.patient_id,
        availability_id: selectedId,
    };

    const handleSubmit = async () => {
        try {
            setConfirm('');
            const res = await fetch(`${API_BASE_URL}/api/appointments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formField),
            });

            if (!res.ok) {
                const errorData = await res.json(); // doc loi JSON tu backend
                throw new Error(errorData.message || 'Something went wrong');
            }
            const tt = JSON.stringify(formField);
            console.log('tt: ', tt);
            setError(null);

            navigate('/appointmentMg');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="container row mt-5 d-flex justify-content-center ms-5 position-relative">
            <div className="container m-3 col-12 col-md-6 col-lg-5 border rounded p-4 bg-light">
                <div >
                    <h3 className="text-center">Appointment information</h3>
                    {error && <div className="alert alert-danger text-center">{error}</div>}
                    <div className="row">
                        <div className="col-3">
                            <img
                                src={docProfile?.image ? `${API_BASE_URL}/storage/avatars/${docProfile.image}` : `${process.env.PUBLIC_URL}/Images/Unknown_person.jpg`}
                                alt={docProfile.name}
                                className="rounded-circle"
                                style={{ width: "70px", height: "70px" }}
                            />
                        </div>
                        <div className="col-8 mt-3">
                            <div >{docProfile?.name}</div>
                            <div >{docProfile?.city?.city_name}</div>
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-6 ps-2 pe-5">Appointment Date: </div>
                        <div className="col-6 text-end">{selectedDate} </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-6 ps-2 pe-5">Appointment Time:</div>
                        <div className="col-6 text-end">{selectedTime}</div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-6 ps-2 pe-5">Patient:</div>
                        <div className="col-6 text-end">{userProfile?.user?.patient?.name}</div>
                    </div>

                    <div class="text-center mt-3"><button className="col-10 bookingButton" onClick={handleConfirm} >Book an appointment</button></div>

                    <div className="text-center mt-3"><a className="text-decoration-none text-primary" href={`/doctorDetail/${docProfile.doctor_id}`}>Change Appointment Date/Time?</a></div>

                </div>
            </div>
            <div className="col-12 col-md-5 text-center mt-2 position-absolute bottom-0" style={{ zIndex: 10 }}>
                <br />
                {confirm ?
                    <div className="text-center mt-2 d-inline-block p-4 bg-light border border-primary p-4 rounded">
                        {confirm}
                        <br /> <br />
                        <span onClick={handleSubmit} className="me-3 btn btn-outline-secondary">Confirm</span >
                        <span onClick={handleNo} className="ms-3 btn btn-outline-secondary">Cancel</span >
                    </div> : ''}
            </div>
        </div>
    );
}

export default PatientBooking;
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function DoctorDetails() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [profile, setProfile] = useState([]);
    
    useEffect(() => {
        fetch(`${API_BASE_URL}/api/doc/${id}`)
            .then(res => res.json())
            .then(data => setProfile(data))
            .catch(err => console.error("Fetch error:", err));

    }, [id]);

    // console.log("data 1:", profile);

    //
    const today = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState(today);
    // console.log("selectedDate: ", today);

    const filteredAvail = profile.availability_schedulings?.filter(doc => {
        return (
            (selectedDate === doc.available_date) &&
            (doc.status === 'available')
        );
    });

    // console.log("selectedDate2: ", selectedDate);
    // console.log('filteredAvail: ', filteredAvail);

    const [selectedTime, setSelectedTime] = useState(null);
    const handleSelect = (sltTime) => {
        setSelectedTime(sltTime); // Lưu lại nút được chọn
        // console.log("nut duoc chon", sltTime);
    }


    const handleBooking = () => {
        if (!selectedTime) {
            alert('Please select a time before booking!');
            return;
        }

        const selectedResult = profile.availability_schedulings?.filter(doc => {
            return (
                (selectedDate === doc.available_date) &&
                (selectedTime === doc.available_time)
            );
        });
        // console.log('selectedResult: ', selectedResult);

        const selectedId = selectedResult[0]?.availability_id;
        // console.log('ID selected: ', selectedId);

        navigate(`/patientBooking/${profile.doctor_id}`,
            {
                state: {
                    userSelectedTime: selectedTime, userSelectedDate: selectedDate,
                    userSelectedId: selectedId
                }
            });
    }
     
    return (
        <div className="container mt-3">
            <br />
            <h2 className="text-center mt-2">Book an Appointment Online</h2>
            <h5 className="text-center">Find the Right Doctor - Book an Appointment Easily</h5>

            <div className="row align-items-center mb-3 p-3 borderCustom" key={profile.id}>
                <div className="col-md-2 text-center">
                    <img
                        src={profile.image ? `${API_BASE_URL}/storage/avatars/${profile.image}` : `${process.env.PUBLIC_URL}/Images/Unknown_person.jpg`}
                        alt={profile.name}
                        className="rounded"
                        style={{ width: "150px", height: "auto" }}
                    />
                </div>
                <div className="col-md-5">
                    <div><h2>{profile.name}</h2></div>
                    <div>Qualification: <span className="DocContent"> {profile.qualification} </span></div>
                    <div>Specialization: <span className="DocContent"> {profile.specialization}</span></div>
                    <div>Experience: <span className="DocContent"> {profile.experience} years</span></div>
                    <div>Branch: <span className="DocContent"> {profile.city?.city_name || "No city"}</span></div>
                </div>

                <div className="col-11 col-md-4 text-center customBooking m-3 container p-3 ">
                    <div><h5>Book an Appointment</h5></div>
                    <div><h6>Choose a date</h6>
                        <input className="rounded" min={today} defaultValue={today} onChange={e => setSelectedDate(e.target.value)}
                            type="date"
                        />
                    </div>
                    <br />
                    <div><h6>Available Times</h6></div>

                    {filteredAvail?.length > 0 ? (
                        <div className="d-flex flex-wrap justify-content-center border rounded overflow-auto"
                            style={{ minHeight: '100px', maxHeight: '150px', width: '345px' }} >
                            {filteredAvail?.sort((a, b) => a.available_time.localeCompare(b.available_time)).map((item, availability_id) =>
                            (
                                <button style={{
                                    width: '65px',
                                    height: '40px',

                                }} className={`rounded-1 btn m-1 p-1 fixed-size ${selectedTime === item.available_time ? 'time_choosed' : 'btn-outline-dark'}`} key={availability_id}
                                    onClick={() => { handleSelect(item.available_time) }}> {item.available_time.slice(0, 5)} </button>
                            ))}
                        </div>
                    ) : (<div className="d-flex align-items-center h-50 docSearch p-3" >
                        <div className="mx-auto pt-1">
                            <p className="text-primary text-center ">There are no available times, please choose another day.</p>
                        </div>
                    </div>)}

                    <div className="d-flex justify-content-center mt-2"><button className="col-12 bookingButton"
                        onClick={() => { handleBooking() }} >Book now</button></div>
                </div>
                <br />
                <div className="col-11 ms-4">
                    <h4>About the doctor:</h4>
                    <span className=" "> {profile.description}</span>
                </div>
            </div>
        </div >
    );
}

export default DoctorDetails;
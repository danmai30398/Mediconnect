import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function ShowConfirmedAppointment({ data, loading, fetchData }) {
    const navigate = useNavigate();

    const filteredAppointments = data?.appointments?.filter(apt => apt.status === 'confirmed');
    // console.log("data confirmed:", filteredAppointments);

    const [cancelModal, setCancelModal] = useState();
    const [rescheduleModal, setRescheduleModal] = useState();
    const [docId, setDocId] = useState();

    //confirm or not
    const handleNo = () => {
        setCancelModal('');
        setRescheduleModal('');
    }

    //truyen id vao backend sau khi confirm sua
    const rescheduleForm = {
        availability_id: rescheduleModal,
    };

    const cancelForm = {
        availability_id: cancelModal,
    };
    console.log('docId: ', docId);
    //reschedule function

    const [errorReschedule, setErrorReschedule] = useState(null);
    const handleRechedule = async () => {
        try {
            const result = await fetch(`${API_BASE_URL}/api/appointments/reschedule/${rescheduleModal}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(rescheduleForm),
            });

            if (!result.ok) {
                const errorData = await result.json(); // doc loi~ JSON tu backend
                throw new Error(errorData.message || 'Something went wrong');
            }
            // const tt = JSON.stringify(formField);
            // console.log('tt: ', tt);
            setErrorReschedule(null);
            setRescheduleModal('');

            navigate(`/doctorDetail/${docId}`);

        } catch (error) {
            setErrorReschedule(error.message);
        }
        // fetchData();
    };

    //cancel function
    const [errorCancel, setErrorCancel] = useState(null);

    const handleCancel = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/appointments/${cancelModal}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cancelForm),
            });

            if (!res.ok) {
                const errorData = await res.json(); // doc loi~ JSON tu backend
                throw new Error(errorData.message || 'Something went wrong');
            }
            // const tt = JSON.stringify(formField);
            // console.log('tt: ', tt);
            setCancelModal('');
            setErrorCancel(null);
        } catch (error) {
            setErrorCancel(error.message);
        }
        fetchData();
    };



    return (
        <div className="container">
            {errorReschedule && <div className="alert alert-danger text-center">{errorReschedule}</div>}
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div>
                    {filteredAppointments?.length > 0 ? (
                        <div className="row text-center d-flex justify-content-center">
                            {filteredAppointments.map((e, index) => {
                                const doctor = data?.doctors?.find(apt => apt.doc_id === filteredAppointments.availability?.doctor_id);
                                const city = data?.cities?.find(city => city.city_id === doctor?.city_id);
                                // const filteredAppointmentsId = e.appointment_id;
                                // console.log('Id: ', filteredAppointmentsId);
                                return (
                                    <div key={index} className="container m-3 col-12 col-md-6 col-lg-5 border rounded p-4 bg-light shadow">
                                        <div >
                                            <h3 className="text-center">Appointment information</h3>
                                            <hr />
                                            <div className="row">
                                                <div className="col-3">
                                                    <img
                                                        src={doctor?.image ? `${API_BASE_URL}/storage/avatars/${doctor?.image}` : `${process.env.PUBLIC_URL}/Images/Unknown_person.jpg`}
                                                        alt={doctor?.name}
                                                        className="rounded-circle"
                                                        style={{ width: "70px", height: "70px" }}
                                                    />
                                                </div>
                                                <div className="col-8">
                                                    <div className="text-primary fw-bold"> <h4>{doctor?.name}</h4></div>
                                                    <div >Branch: {city?.city_name}</div>
                                                </div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-6 ps-2 pe-5 text-start">Appointment Date: </div>
                                                <div className="col-6 text-end">{e.availability?.available_date} </div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-6 ps-2 pe-5 text-start">Appointment Time:</div>
                                                <div className="col-6 text-end">{e.availability?.available_time}</div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-6 ps-2 pe-5 text-start">Patient:</div>
                                                <div className="col-6 text-end">{e.patient?.name}</div>
                                            </div>
                                            <hr />
                                            <div className="row mt-3">
                                                <div className="col-5 ps-2 pe-5 text-start">Status of your appointment:</div>
                                                <div className="col-7 text-end">Confirmed - your appointment has been accepted by the doctor</div>
                                            </div>
                                            <hr />
                                            <div class="text-center mt-3">
                                                <button className="col-5 m-2 btn btn-warning" onClick={() => { setRescheduleModal(e.appointment_id); setDocId(e.availability?.doctor_id) }}>Reschedule </button>
                                                <button className="col-5 m-2 btn btn-danger" onClick={() => setCancelModal(e.appointment_id)}>Cancel</button>
                                            </div>
                                            <div className="col-10 col-md-4 text-center position-absolute bottom-0" style={{ zIndex: 10 }}>
                                                <br />
                                                {cancelModal === e.appointment_id && (
                                                    <div className="text-center mt-2 d-inline-block p-4 bg-light border border-primary p-4 rounded">
                                                        Are you sure you want to cancel this appointment?
                                                        <br /> <br />
                                                        <span onClick={handleCancel} className="me-3 btn btn-outline-secondary">Confirm</span >
                                                        <span onClick={handleNo} className="ms-3 btn btn-outline-secondary">Cancel</span >
                                                    </div>)}
                                            </div>

                                            <div className="col-10 col-md-4 text-center position-absolute bottom-0" style={{ zIndex: 10 }}>
                                                <br />
                                                {rescheduleModal === e.appointment_id && (
                                                    <div className="text-center mt-2 d-inline-block p-4 bg-light border border-primary p-4 rounded">
                                                        Are you sure you want to reschedule this appointment?
                                                        <br /> <br />
                                                        <span onClick={handleRechedule} className="me-3 btn btn-outline-secondary">Confirm</span >
                                                        <span onClick={handleNo} className="ms-3 btn btn-outline-secondary">Cancel</span >
                                                    </div>)}
                                            </div>

                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="d-flex align-items-center mt-5 docSearch" style={{ height: '50vh' }} >
                            <div className="mx-auto">
                                <h3 className="text-center">Nothing exists here</h3>
                                <p className="text-center">You don't have any confirmed appointment.</p>
                            </div>
                        </div>
                    )}
                </div>)}
        </div>
    );

}

export default ShowConfirmedAppointment;

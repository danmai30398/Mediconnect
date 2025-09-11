const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function ShowCompletedAppointment({ data, loading }) {

    const filteredAppointments = data?.appointments?.filter(apt => apt.status === 'completed');
    // console.log("data completed:", filteredAppointments);

    return (
        <div className="container">
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div>
                    {filteredAppointments?.length > 0 ? (
                        <div className="row text-center d-flex justify-content-center">
                            {filteredAppointments.map((e, index) => {
                                const doctor = data?.doctors?.find(apt => apt.doc_id === filteredAppointments.availability?.doctor_id);
                                const city = data?.cities?.find(city => city.city_id === doctor?.city_id);

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
                                                <div className="col-7 text-end">Completed - appointment has been successfully completed</div>
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
                                <p className="text-center">You don't have any completed appointment.</p>
                            </div>
                        </div>
                    )}
                </div>)}
        </div>
    );

}

export default ShowCompletedAppointment;

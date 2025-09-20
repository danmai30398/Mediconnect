import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ShowConfirmedAppointment from "./ShowConfirmedAppointment";
import StatusTabs from "./StatusTabs";
import ShowCompletedAppointment from "./ShowCompletedAppointment";
import ShowCancelledAppointment from "./ShowCancelledAppointment";
import ShowRescheduledAppointment from "./ShowRescheduledAppointment";
import ShowPendingAppointment from "./ShowPendingAppointment";
import ShowNo_showAppointment from "./ShowNo_showAppointment ";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function PatientAppointmentManage() {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    //lay lai user_id cua patient
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('MediUser'));
    const userId = user?.id;
    // console.log("User ID:", userId);
    const [profile, setProfile] = useState();

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/user/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })
            .then(res => res.json())
            .then(data => setProfile(data))
            .catch(err => console.error("Fetch error:", err));

    }, [token]);

    const patient_id = profile?.user?.patient?.patient_id;
    // console.log('patient id: ', patient_id);

    //fetch appointments from api
    const fetchAppointments = async () => {
        const startTime = Date.now();
        try {
            const res = await fetch(`${API_BASE_URL}/api/appointments/patient/${patient_id}`);
            const data = await res.json();
            setAppointments(data);
            console.log("data:", data);
        } catch (error) {
            console.error("Error after fetching appointments: ", error);
        } finally {
            const elapsed = Date.now() - startTime;
            const minLoadingTime = 700; // 700 ms 
            const remainingTime = minLoadingTime - elapsed;

            if (remainingTime > 0) {
                setTimeout(() => {
                    setLoading(false);
                }, remainingTime);
            } else {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [patient_id]);

    const [selectedStatus, setSelectedStatus] = useState("Pending appointments");

    return (
        <div className="container">
            <br /><br />
            <div className="">
                <StatusTabs onTabChange={setSelectedStatus} />
            </div>
            <div className="mt-2">
                {selectedStatus === "Pending appointments" ?
                    <div>
                        <ShowPendingAppointment fetchData={fetchAppointments} data={appointments} loading={loading} />
                    </div> : ''}

                {selectedStatus === "Confirmed appointments" ?
                    <div>
                        <ShowConfirmedAppointment fetchData={fetchAppointments} data={appointments} loading={loading} />
                    </div> : ''}

                {selectedStatus === "Completed appointments" ?
                    <div>
                        <ShowCompletedAppointment data={appointments} loading={loading} />
                    </div> : ''}

                {selectedStatus === "Rescheduled appointments" ?
                    <div>
                        <ShowRescheduledAppointment data={appointments} loading={loading} />
                    </div> : ''}

                {selectedStatus === "Cancelled appointments" ?
                    <div>
                        <ShowCancelledAppointment data={appointments} loading={loading} />
                    </div> : ''}

                {selectedStatus === "No-show appointments" ?
                    <div>
                        <ShowNo_showAppointment data={appointments} loading={loading} />
                    </div> : ''}
            </div>
        </div>
    );

}

export default PatientAppointmentManage;

import React, { useEffect, useState } from "react";
import { apiService } from "./services/apiService";

function Dashboard() {
    const [stats, setStats] = useState({ total_doctors: 0, total_patients: 0, today_appointments: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await apiService.getDashboardStats();
                setStats(data);
            } catch (e) {
                setError("Unable to load statistics");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="container">
            <br /><br /><br />
            <h2 className="mb-3">Dashboard</h2>
            <div className="mb-3"><a href="/login">Login</a></div>
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div className="text-danger">{error}</div>
            ) : (
                <div className="row g-3">
                    <div className="col-12 col-md-4">
                        <div className="border p-3">
                            <div className="fw-bold">Doctors</div>
                            <div className="fs-3">{stats.total_doctors}</div>
                        </div>
                    </div>
                    <div className="col-12 col-md-4">
                        <div className="border p-3">
                            <div className="fw-bold">Patients</div>
                            <div className="fs-3">{stats.total_patients}</div>
                        </div>
                    </div>
                    <div className="col-12 col-md-4">
                        <div className="border p-3">
                            <div className="fw-bold">Today's Appointments</div>
                            <div className="fs-3">{stats.today_appointments}</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;

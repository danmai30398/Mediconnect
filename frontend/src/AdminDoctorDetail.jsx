import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiService } from "./services/apiService";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000";

function AdminDoctorDetail() {
    const { id } = useParams();
    const [doc, setDoc] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                // Sử dụng apiService để lấy thông tin bác sĩ
                const doc = await apiService.getDoctor(id);
                setDoc(doc);
            } catch (e) { setError("Không thể tải chi tiết bác sĩ"); }
        };
        load();
    }, [id]);

    if (error) return <div className="container"><br /><div className="text-danger">{error}</div></div>;
    if (!doc) return <div className="container"><br />Loading...</div>;

    return (
        <div className="container">
            <br />
            <h2>Doctor Details</h2>
            <div className="row mt-3">
                <div className="col-md-3 text-center">
                    <img 
                        src={doc.image_url || (doc.image ? `http://127.0.0.1:8000/storage/doctor-images/${doc.image}` : `${process.env.PUBLIC_URL}/Images/Doctors/Unknown_person.jpg`)} 
                        alt={doc.name} 
                        className="rounded-circle" 
                        style={{ width: 140, height: 140, objectFit: 'cover' }}
                        onError={(e) => {
                            e.target.src = `${process.env.PUBLIC_URL}/Images/Doctors/Unknown_person.jpg`;
                        }}
                    />
                </div>
                <div className="col-md-9">
                    <div><b>Full Name:</b> {doc.name}</div>
                    <div><b>Email:</b> {doc.email}</div>
                    <div><b>Phone:</b> {doc.phone}</div>
                    <div><b>Gender:</b> {doc.gender}</div>
                    <div><b>Date of Birth:</b> {doc.dob}</div>
                    <div><b>Specialization:</b> {doc.specialization}</div>
                    <div><b>Experience:</b> {doc.experience} years</div>
                    <div><b>Qualification:</b> {doc.qualification}</div>
                    <div><b>City:</b> {doc.city?.city_name}</div>
                    {doc.description && <div className="mt-2"><b>Description:</b> {doc.description}</div>}
                </div>
            </div>
        </div>
    );
}

export default AdminDoctorDetail;



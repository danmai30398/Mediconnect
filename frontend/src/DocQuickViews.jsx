import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Doctors.css";
import PatientHeader from "./PatientHeader";
import { apiService } from "./services/apiService";

function DocQuickViews() {
    const navigate = useNavigate();
    const [profiles, setProfiles] = useState([]);
    const [cities, setCities] = useState([]);

    //fetch profiles from api
    const fetchProfiles = async () => {
        try {
            const data = await apiService.getDoctors();
            setProfiles(data);
        } catch (error) {
            console.error("Error after fetching profiles: ", error);
        }
    };

    const fetchCities = async () => {
        try {
            const data = await apiService.getCities();
            setCities(data);
        } catch (error) {
            console.error("Error after fetching cities: ", error);
        }
    };

    const uniqueCities = cities.map(c => c.city_name);
    const [specializations, setSpecializations] = useState([]);
    const fetchSpecializations = async () => {
        try {
            const data = await apiService.getDoctorSpecializations();
            setSpecializations(data);
        } catch (error) {
            console.error("Error after fetching specializations: ", error);
        }
    };


    const [selectedCity, setSelectedCity] = useState('');
    const [selectedSpec, setSelectedSpec] = useState('');

    const filteredDoctors = profiles.filter(doc => {
        return (
            (selectedCity === '' || doc.city.city_name === selectedCity) &&
            (selectedSpec === '' || doc.specialization === selectedSpec)
        );
    });

    useEffect(() => {
        fetchProfiles();
        fetchCities();
        fetchSpecializations();
    }, []);

    return (
        <div className="container">
            <br /><br /><br />
            <h2 className="text-center">Book an Appointment Online</h2>
            <h5 className="text-center">Find the Right Doctor - Book an Appointment Easily</h5>
            <div className="text-end">
                <h2>Filter</h2>
                <div style={{ marginBottom: '10px' }}>
                    <label className="pe-3">Choose City: </label>
                    <select className="rounded" value={selectedCity} onChange={e => setSelectedCity(e.target.value)}>
                        <option value="">All</option>
                        {uniqueCities.map(city => (
                            <option key={city} value={city}>{city}</option>
                        ))}
                    </select>
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label className="pe-3">Choose Specialization: </label>
                    <select className="rounded" value={selectedSpec} onChange={e => setSelectedSpec(e.target.value)}>
                        <option value="">All</option>
                        {specializations.map(spec => (
                            <option key={spec} value={spec}>{spec}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div>
                {filteredDoctors.length > 0 ? (
                    <div className="row text-center d-flex justify-content-center">
                        {filteredDoctors.map(profile => (
                            <div className="col-12 col-md-4 col-xl-2 m-1 docqkview text-center" key={profile.id}>
                                <div>
                                    <img
                                        src={`${process.env.PUBLIC_URL}/Images/Doctors/${profile.image}`}
                                        alt={profile.name}
                                        className="rounded-circle"
                                        style={{ width: "70px", height: "70px" }}
                                    />
                                </div>
                                <div >
                                    <div><h2>{profile.name}</h2></div>
                                    <div>Specialization: <span className="DocContent"> {profile.specialization}</span></div>
                                    <div>Experience: <span className="DocContent"> {profile.experience} years</span></div>
                                    <div>{profile.gender ? 'Gender:' : ''} <span className="DocContent"> {profile.gender}</span></div>
                                    <div>Branch: <span className="DocContent"> {profile.city?.city_name || "No city"}</span></div>
                                </div>
                                <div><button className="bttnQkView" onClick={() => { navigate(`/doctorDetail/${profile.doctor_id}`) }}>Book now ➡</button> </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="d-flex align-items-center min-vh-100 docSearch">
                        <div className="mx-auto">
                            <h3 className="text-center">Nothing exists here</h3>
                            <p className="text-center">Currently, we do not have a specialist doctor that you need in this city.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

}

export default DocQuickViews;

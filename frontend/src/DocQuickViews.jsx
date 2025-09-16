import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Doctors.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function DocQuickViews() {
    const navigate = useNavigate();
    const location = useLocation();
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);


    //fetch profiles from api
    const fetchProfiles = async () => {
        const startTime = Date.now();
        try {
            const res = await fetch(`${API_BASE_URL}/api/doctors`);
            const data = await res.json();
            setProfiles(data);
            console.log("data:", data);
        } catch (error) {
            console.error("Error after fetching profiles: ", error);
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

    // console.log(`${API_BASE_URL}/api/doctors`);

    const uniqueCities = [...new Set(profiles.map(doc => doc.city.city_name))];
    const uniqueSpecializations = [...new Set(profiles.map(doc => doc.specialization))];


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
    }, []);

    return (
        <div className="container">

            <br /><br />

            <h2 className="text-center">Book an Appointment Online</h2>
            <h5 className="text-center mb-0">Find the Right Doctor - Book an Appointment Easily</h5>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div>
                    <div className="text-end">
                        <h3>Filter</h3>
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
                                {uniqueSpecializations.map(spec => (
                                    <option key={spec} value={spec}>{spec}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        {filteredDoctors.length > 0 ? (
                            <div className="row text-center d-flex justify-content-center ">
                                {filteredDoctors.map(profile => (
                                    <div className="col-12 col-md-3 col-xl-3 m-1 docqkview text-center shadow" key={profile.id}>
                                        <div>
                                            <img
                                                src={profile.image ? `${API_BASE_URL}/storage/avatars/${profile.image}` : `${process.env.PUBLIC_URL}/Images/Unknown_person.jpg`}
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
                                        <div><button className="bttnQkView" onClick={() => {
                                            if (location.pathname === '/search-doctor') {
                                                navigate('/login');
                                            } else if (location.pathname === '/findUDoctor') {
                                                navigate(`/doctorDetail/${profile.doctor_id}`);
                                            } else {
                                                navigate('/home');
                                            }
                                        }}>Book now ➡</button> </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="d-flex align-items-center docSearch" style={{ height: '50vh' }} >
                                <div className="mx-auto">
                                    <h3 className="text-center">Nothing exists here</h3>
                                    <p className="text-center">Currently, we do not have a specialist doctor that you need in this city.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>)}
        </div>
    );
}

export default DocQuickViews;

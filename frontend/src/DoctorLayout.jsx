import React from "react";
import { Outlet } from "react-router-dom";
import DoctorHeader from "./DoctorHeader";

function DoctorLayout() {
    return (
        <>
            <DoctorHeader />
            <main style={{ padding: '1rem' }}>
                <Outlet />
            </main>
        </>
    );
}

export default DoctorLayout;

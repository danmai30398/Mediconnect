import React from "react";
import { Link } from "react-router-dom";

function TopBar() {
  return (
    <div className="topbar">
      <div className="container inner">
        <div>Welcome To Our <b>EHospital</b> Service</div>
        <div className="spacer" />
        <div>Openig Hour Sat-Thu 9:00-20:00</div>
        <Link to="/login">Sign In</Link> | <Link to="/register">Sign Up</Link>
      </div>
    </div>
  );
}

export default TopBar;
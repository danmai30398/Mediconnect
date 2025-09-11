import React from "react";
import { Link } from "react-router-dom";

function TopBar() {
  return (
    <div className="topbar">
      <div className="container inner">
        <div>Welcome To Our <b>MediConnect</b> Service</div>
        <div className="spacer" />
        <div>Openig Hour Mon-Fri 7:00-17:00</div>
        <Link to="/login">Sign In</Link> | <Link to="/register">Sign Up</Link>
      </div>
    </div>
  );
}

export default TopBar;
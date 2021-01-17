import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="navbar">
      <Link to="/">
        <h1 className="title">PHYSIBOT</h1>
      </Link>
    </div>
  );
}

export default Navbar;

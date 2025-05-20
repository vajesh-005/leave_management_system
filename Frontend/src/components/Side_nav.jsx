import React from "react";
import Lumel_logo from "../assets/Lumel_logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faChartLine,
  faList,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import "../style/Side_nav.css";
import { NavLink } from "react-router-dom";
function Side_nav() {
  return (
    <div className="sidebar">
      <div className="logo">
        <img src={Lumel_logo} className="lumel-logo" />
      </div>
      <div className="options">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `item ${isActive ? "active" : ""}`}
        >
          <FontAwesomeIcon icon={faChartLine} className="dashboard-icon" />
          Dashboard
        </NavLink>

        <NavLink
          to="/leavelist"
          className={({ isActive }) => `item ${isActive ? "active" : ""}`}
        >
          <FontAwesomeIcon icon={faList} className="leavelists-icon" />
          Leaves list
        </NavLink>

        <NavLink
          to="/calendar"
          className={({ isActive }) => `item ${isActive ? "active" : ""}`}
        >
          <FontAwesomeIcon icon={faCalendarAlt} className="calendar-icon" />
          Calendar
        </NavLink>
      </div>

      <div className="logout">
        <button className="logout-btn">Logout</button>
        <FontAwesomeIcon icon={faSignOutAlt} className="logout-icon" />
      </div>
    </div>
  );
}

export default Side_nav;

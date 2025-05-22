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
// const jwtDecode = require('jsonwebtoken');

function Side_nav({ children }) {
  // const token = localStorage.getItem("token");
  // const decode = token ? jwtDecode(token) : null;

  const handleLogout = async () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  // const renderOptions = () => {
  //   switch (decode.role) {
  //     case "Employee":
  //       return (
  //         <>
  //           <NavItem
  //             to="/dashboard"
  //             icon={faChartLine}
  //             label="Dashboard"
  //           ></NavItem>
  //           <NavItem to="/leavelist" icon={faList} label="Leavelist"></NavItem>
  //           <NavItem
  //             to="/calendar"
  //             icon={faChartLine}
  //             label="Calendar"
  //           ></NavItem>
  //         </>
  //       );
  //       case "HR" :
  //         return (
  //           <>
  //           <NavItem to={}></NavItem>
  //           </>
  //         )
  //   }
  // };
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

        {children}
      </div>

      <div className="logout" onClick={handleLogout}>
        <button className="logout-btn">Logout</button>
        <FontAwesomeIcon icon={faSignOutAlt} className="logout-icon" />
      </div>
    </div>
  );
}

export default Side_nav;

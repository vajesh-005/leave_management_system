import React, { useEffect, useState } from "react";
import Side_nav from "../Side_nav";
import "../../style/Side_nav.css";
import LeaveTypeCard from "../LeaveTypeCard";
import "../../style/leave_list.css";
import LeaveRules from "../LeaveRules";
import {Token} from '../Token'
function LeaveList() {
  const [leaveType, setLeaveType] = useState([]);
  const {decode , token} = Token();
  console.log(decode);

  useEffect(() => {
    if (decode?.id && token) {
      fetch(`http://localhost:2406/leaveslist/${decode.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((result) => result.json())
        .then((data) => setLeaveType(data))
        .catch((error) => console.log(error.message));
    }
  }, [decode?.id, token]);

  console.log(leaveType);

  return (
    <div className="leave-list-container width">
      <Side_nav />
      <div className="main-container">
        <LeaveTypeCard data={leaveType} />
        <div className="rules-div">
          <LeaveRules className="rules" />
        </div>
      </div>
    </div>
  );
}

export default LeaveList;

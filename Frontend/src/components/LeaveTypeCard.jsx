import React from "react";
import "../style/LeaveTypeCard.css";

function LeaveTypeCard({ data }) {

  const typeCodeHandler=(name)=>{
    if (!name || typeof name !== "string") return "N/A";
    const splitted = name.split(" ");
    let temp = '';
    splitted.map((item)=>temp+=item[0].toUpperCase());
    return temp;
  }
  return (
    <div className="card-wrapper">
      {data.map((leave, index) => (
        <div className="card-container" key={index}>
          <div className="type items">
            <div className="type-name">{leave.type_name}</div>
            <div className="type-code">{typeCodeHandler(leave.type_name) || "N/A"}</div>
          </div>
          <div className="leaves-used-div items">
            <div className="leave-used-title">Leaves used</div>
            <div className="used-result">{leave.leaves_used || 0}</div>
          </div>
          <div className="leaves-remaining-div items">
            <div className="leave-remaining-title">Leaves Remaining</div>
            <div className="remaining-result">{leave.category_leaves_remaining || 0}</div>
          </div>
          <div className="description">
            Description:
            <div className="text">{leave.description || "No description."}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default LeaveTypeCard;

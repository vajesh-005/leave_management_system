import React, { useEffect, useState } from "react";
import "../style/latest_requests.css";
import {Token} from './Token'
function Latest_requests(props) {
  const [pendingRequest, setPendingRequest] = useState([]);
  const [leaveTypeName, setleaveTypeName] = useState([]);
  const [refresh , setRefresh] = useState(0);
  const handleCancel = async (id) => {
    try {
      const {token} = Token();
      const response = await fetch(`http://localhost:2406/cancelleave/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        return { message: "failed to cancel leave !" };
      }
      setRefresh((item)=>item+1);
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    const fetchAll = async () => {
      const token = localStorage.getItem("token");
      try {
        const [requests, names] = await Promise.all([
          fetch(`http://localhost:2406/latestleaverequest/${props.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch("http://localhost:2406/leavename"),
        ]);
        const [requestsJson, namesJson] = await Promise.all([
          requests.json(),
          names.json(),
        ]);
        setPendingRequest(requestsJson);
        setleaveTypeName(namesJson);
        console.log(requestsJson, namesJson);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchAll();
  }, [props.id, props.refreshKey , refresh]);
  const getLeaveName = (id) => {
    const name = leaveTypeName.find((res) => res.id == id);
    return name ? name.type_name : "Unknown";
  };
  const getDifference = (start, end) => {
    const difference =
      Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)) + 1;
    return difference;
  };

  console.log(leaveTypeName);
  return (
    <div className="pending-section">
      <p className="title">Latest Leaves</p>
      {pendingRequest?.map((item, index) => (
        <div key={index} className="pending-request-card">
          <div className="leave-type-and-status">
            <div className="leave-name">
              {getLeaveName(item.leave_type_id)}
              <button
                className="cancel-btn"
                onClick={() => {
                  handleCancel(item.id);
                }}
              >
                Cancel Leave
              </button>
            </div>

            <div
              className={`status ${
                item.status === "Approved"
                  ? "approved"
                  : item.status === "Rejected"
                  ? "rejected"
                  : item.status === "Cancelled"
                  ? "cancelled"
                  : "pending"
              }`}
            >
              {item.status}
            </div>
          </div>

          <div className="date-and-days">
            <div className="date">
              {" "}
              {item.start_date &&
                new Date(item.start_date).toLocaleDateString()}
            </div>
            <div className="date-difference">
              {getDifference(item.start_date, item.end_date) +
                `${
                  getDifference(item.start_date, item.end_date) > 1
                    ? " Days"
                    : " Day"
                }`}
            </div>
            <div className="date">
              {item.end_date && new Date(item.end_date).toLocaleDateString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Latest_requests;

import React, { useEffect, useState } from "react";
import "../style/Pending_card.css";
import { Token } from "./Token";

function Pending_card({ data }) {
  const { token } = Token();
  const [userDetailsMap, setUserDetailsMap] = useState({});
  const [leaveNameMap, setLeaveNameMap] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const userIds = [...new Set(data.map((item) => item.user_id))];

        // Fetch user details
        const userFetches = userIds.map((id) =>
          fetch(`http://localhost:2406/userdetails/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }).then((res) =>
            res.json().then((json) => {
              const user = Array.isArray(json) ? json[0] : json;
              return { id, ...user };
            })
          )
        );

        // Fetch leave types
        const leaveFetch = fetch("http://localhost:2406/leavename").then(
          (res) => res.json()
        );

        const [users, leaveTypes] = await Promise.all([
          Promise.all(userFetches),
          leaveFetch,
        ]);

        // Create user map
        const userMap = {};
        users.forEach((user) => {
          userMap[user.id] = user;
        });

        // Create leave name map
        const leaveMap = {};
        leaveTypes.forEach((leave) => {
          leaveMap[leave.id] = leave.type_name;
        });

        setUserDetailsMap(userMap);
        setLeaveNameMap(leaveMap);
        setIsLoaded(true);
      } catch (error) {
        console.error("Error fetching user/leave info:", error.message);
      }
    };

    if (data.length > 0) {
      fetchAll();
    } else {
      setIsLoaded(true);
    }
  }, [data, token]);

  if (!isLoaded) {
    return <div className="loading">Loading pending requests...</div>;
  }

  if (data.length === 0) {
    return <div className="no-data">No pending requests.</div>;
  }
  return (
    <div className="leave-request-card-wrapper">
      {data.map((item, index) => {
        const user = userDetailsMap[item.user_id] || {};
        const leaveName = leaveNameMap[item.leave_type_id] || "Unknown";

        return (
          <div className="pending-card-container" key={index}>
            <div className="user-details">
              <div className="user-name">{user.name || "Unknown"}</div>
              <div className="user-role">{user.role || "Employee"}</div>
              <div className="user-email">{user.email || "N/A"}</div>
            </div>
            <div className="leave-details-div">
              <div className="primary-reason">
                <div className="leave-type-div">Leave type: {leaveName}</div>
                {/* <div className="date-difference-div">
                  Applied for {item.start_date} day{item.end_date > 1 ? "s" : ""}
                </div> */}
                <div className="date-range-div">
                  {new Date(item.start_date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}

                  to
                  
                  {new Date(item.end_date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </div>
              <div className="main-reason-div">
                Reason:
                <div className="reason-text-div">{item.reason}</div>
              </div>
            </div>
            <div className="approval-div">
              <button className="approve-btn btn">Approve</button>
              <button className="reject-btn btn">Reject</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Pending_card;

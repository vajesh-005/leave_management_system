import React, { useEffect, useState } from "react";
import Side_nav from "../Side_nav";
import "../../style/requests.css";
import Pending_card from "../Pending_card";
import { Token } from "../Token";

function Requests() {
  const { decode, token } = Token();
  console.log(decode.id);
  const [pendingList, setPendingList] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((item) => item + 1);
  };

  useEffect(() => {
    if (!token || !decode?.id) return;

    fetch(`http://localhost:2406/userswithrequest/${decode.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then(async (result) => {
        if (!result.ok) {
          if (result.status === 401) {
            console.error("Unauthorized – invalid or expired token");
            return;
          }
        }
        return result.json();
      })
      .then((data) => {
        if (data) setPendingList(data);
      })
      .catch((error) => console.log("Fetch error:", error.message));
  }, [decode?.id, token, refreshKey]);

  console.log(pendingList);
  return (
    <div className="width requests-container">
      <Side_nav />
      <div className="grid">
        <Pending_card data={pendingList} refreshKey={handleRefresh} />
      </div>
    </div>
  );
}

export default Requests;

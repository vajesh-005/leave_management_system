import "rsuite/dist/rsuite.min.css";
import { CustomProvider } from "rsuite";
import Dashboard_leave_details from "../components/Dashboard_leave_details";
import Request_form from "../components/Request_form";
import Pending_request from "./Pending_requests";
import { jwtDecode } from "jwt-decode";
import "../style/index.css";
import Side_nav from "./Side_nav";
import { useState } from "react";
function Dashboard() {
  const token = localStorage.getItem("token");
  const decode = token ? jwtDecode(token) : null;

  const [refresh , setRefresh] = useState();

  const handleRefresh = async () => {
    setRefresh(item => item+1);
  };
  return (
    <CustomProvider theme="light">
      <div className="container">
        <Side_nav></Side_nav>
        <div className="grid">
          <div className="greeting">
            <span className="welcome">Hey,</span>
            <span className="name">{decode.name}</span>
          </div>
          <div className="main">
            <div className="column">
              <Dashboard_leave_details id={decode.id} refreshKey = {refresh}/>
              <Request_form id={decode.id}  onSuccess = {handleRefresh}/>
            </div>
            <div className="column">
              <Pending_request id={decode.id} refreshKey = {refresh}/>
            </div>
          </div>
        </div>
      </div>
    </CustomProvider>
  );
}

export default Dashboard;

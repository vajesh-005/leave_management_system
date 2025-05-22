// App.jsx
import { Routes, Route } from "react-router-dom";
import Login from "./components/Pages/Login";
import Dashboard from "./components/Dashboards/Dashboard";
import LeaveList from "./components/Pages/LeaveList";
import Hr_dashboard from "./components/Dashboards/Hr_dashboard";
import Director_dashboard from './components/Dashboards/Director_dashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/leavelist" element={<LeaveList />} />
      <Route path="/hr_dashboard" element={<Hr_dashboard />} />
      {/* <Route path="/manager_dashboard" element={<Manager_dashboard />} /> */}
      <Route path="/director_dashboard" element={<Director_dashboard/>} />
    </Routes>
  );
}

export default App;

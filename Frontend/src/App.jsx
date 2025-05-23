// App.jsx
import { Routes, Route } from "react-router-dom";
import Login from "./components/Pages/Login";
import Dashboard from "./components/Dashboards/Dashboard";
import LeaveList from "./components/Pages/LeaveList";
import Hr_dashboard from "./components/Dashboards/Hr_dashboard";
import Director_dashboard from "./components/Dashboards/Director_dashboard";
import Requests from "./components/Pages/Requests";
import Employees from "./components/Pages/Employees";
import Calendar from "./components/Pages/Calendar";
import Readonly_leavelist from './components/Pages/Readonly_leavelist'
function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/leavelist" element={<LeaveList />} />
      <Route path="/readonly_leavelist" element={<Readonly_leavelist />} />
      <Route path="/hr_dashboard" element={<Hr_dashboard />} />
      <Route path="/director_dashboard" element={<Director_dashboard />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/requests" element={<Requests />} />
      <Route path="/employees" element={<Employees />} />
    </Routes>
  );
}

export default App;

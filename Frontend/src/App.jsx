// App.jsx
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import LeaveList from "./components/LeaveList";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/leavelist" element={<LeaveList />} />

    </Routes>
  );
}

export default App;

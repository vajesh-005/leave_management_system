import React, { useEffect, useState } from "react";
import Side_nav from "../Side_nav";
import { Token } from "../Token";
import Employee_card from "../Employee_card";
import "../../style/employee.css";

function Employees() {
  const { decode, token } = Token();
  const [employees, setEmployees] = useState([]);
  console.log(employees)
  useEffect(() => {
    if (!decode?.id) return;

    fetch(`http://localhost:2406/mappedusers/${decode.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((results) => results.json())
      .then((data) => setEmployees(data))
      .catch((error) => console.log(error));
  }, [decode.id, token]);
  return (
    <div className="width employees-container">
      <Side_nav />
      <div className="grid">
        <div
          className={
            decode.role == "HR"
              ? "hr-header-content"
              : "employees-header-content"
          }
        >
          <div className="total-employees">
            Candidates
            <div className="total-employees-count">Total candidates count : {employees.length}</div>
          </div>
          {decode.role == "HR" && (
            <div className="add-employee">
              <button>+ Employee</button>
            </div>
          )}
        </div>
        <div className="search-container">
          <input type="text"  className="search-bar" placeholder="Search employee..."/>
        </div>
          <Employee_card data={employees} />
      </div>
    </div>
  );
}

export default Employees;

import React from "react";
import '../style/Employee_card.css'
function Employee_card(props) {
  console.log(props.data);
  const data = props.data;

  const readableDate = (input) => {
    const date = new Date(input);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const formatted = day + "/" + month + "/" + year;
    return formatted;
  };


  return (
    <div className="employees-list-container">
  {data.map((key, index) => {
    return (
      <div className="employee-container" key={index}>
        <div className="employee-primary-details">
          <div className="employee-name">{key.employee_name}</div>
          <div className="employee-role">{key.role}</div>
          <div className="employee-id">Employee ID : {key.employee_id}</div>
        </div>
        <div className="employee-contact-details">
          <div className="employee-email">{key.email}</div>
          <div className="employee-number">Phone : {key.contact_number}</div>
        </div>
        <div className="employee-office-details">
          <div className="date-of-join">
            <strong>Date of joining</strong> : {readableDate(key.date_of_joining)}
          </div>
          <div className="reporting-manager">
            <strong>Reporting manager</strong> : {key.manager_name}
          </div>
        </div>
      </div>
    );
  })}
</div>

  );
}

export default Employee_card;

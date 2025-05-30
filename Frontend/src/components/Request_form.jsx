import React, { useEffect, useState } from "react";
import "../style/request_form.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { useToaster, Message, Button } from "rsuite";
import RangeCalendar from "./RangeCalendar";
import {Token} from './Token';

function Request_form(props) {
  const toaster = useToaster();
  const {decode} = Token();

  const [formData, setFormData] = useState({
    user_id: props.id,
    leave_type_id: "",
    start_date: "",
    end_date: "",
    reason: "",
  });

  const [leaveTypeName, setleaveTypeName] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch("http://localhost:2406/leavename")
      .then((res) => res.json())
      .then((data) => setleaveTypeName(data))
      .catch((err) => console.log(err));
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isFormValid = () => {
    return (
      formData.start_date &&
      formData.end_date &&
      formData.leave_type_id &&
      formData.reason.trim() !== ""
    );
  };
  const {token} = Token();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      toaster.push(
        <Message type="warning" closable duration={3000}>
          Please fill out all fields before submitting.
        </Message>,
        { placement: "topStart" }
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `http://localhost:2406/requestleave/${formData.user_id}`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        toaster.push(
          <Message type="success" closable duration={3000}>
            Leave request submitted successfully!
          </Message>,
          { placement: "topStart" }
        );
        if (props.onSuccess) props.onSuccess();

        setFormData({
          user_id: formData.user_id,
          leave_type_id: "",
          start_date: "",
          end_date: "",
          reason: "",
        });
      } else {
        toaster.push(
          <Message type="error" closable duration={3000}>
            Failed to submit leave request.
          </Message>,
          { placement: "topStart" }
        );
      }
    } catch (error) {
      toaster.push(
        <Message type="error" closable duration={3000}>
          {error.message}
        </Message>,
        { placement: "topStart" }
      );
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
      }, 3000);
    }
  };

  return (
    <div className="form">
      <form method="POST" onSubmit={handleSubmit} className="request-form">
        <div className="request-form-column">
          <p className="leave-request-title">Let's make a leave request !</p>
          <div className="dates">
            <RangeCalendar
              startDate={formData.start_date}
              endDate={formData.end_date}
              onDateChange={({ start_date, end_date }) =>
                setFormData((prev) => ({
                  ...prev,
                  start_date,
                  end_date,
                }))
              }
            />
          </div>
        </div>
        <div className="request-form-column-2">
          <div className="leave-type">
            <label className="leave-type-title">Leave Type</label>
            <select
              className="dropdown-menu"
              name="leave_type_id"
              value={formData.leave_type_id}
              onChange={handleChange}
            >
              <option disabled value="">
                SELECT LEAVE TYPE
              </option>
              {leaveTypeName.map((index) => (
                <option
                  key={index.id}
                  value={index.id}
                  className="dropdown-options"
                >
                  {index.type_name}
                </option>
              ))}
            </select>
          </div>
          <div className="reason">
            <p className="reason-title">Reason</p>
            <textarea
              className="reason-textarea"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Type here..."
            ></textarea>
          </div>
          <div className="submit-button-div">
            <Button
              type="submit"
              appearance="primary"
              color="green"
              disabled={isSubmitting}
              className="submit-btn"
            >
              <FontAwesomeIcon icon={faCheck} style={{ marginRight: "8px" }} />
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Request_form;

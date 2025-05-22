import React from 'react';
import '../style/leaveRules.css'
// import {Sick_leave } from '../assets/Sick_leave.png'
// import {Earned_leave} from '../assets/Earned_leave.png'
function LeaveRules() {
  return (
    <div className="leave-rules">
      <h2>📋 Leave Request Rules</h2>
      <p>
        To ensure clarity and efficiency in processing leave requests, the following rules are applied based on the <strong>type of leave</strong>, <strong>number of leave days applied</strong>, and <strong>remaining leave balance</strong>:
      </p>

      <h3> Sick Leave</h3>
      <ul>
        <li>
          <strong>1 Day Applied & Sick Leaves Available:</strong> Auto-approved.
        </li>
        <li>
          <strong>1 Day Applied & No Sick Leaves Remaining:</strong> Requires dual approval from:
          <ul>
            <li>Manager</li>
            <li>HR</li>
          </ul>
        </li>
        <li>
          <strong>More Than 1 Day Applied (Sick Leave):</strong> Requires approval from:
          <ul>
            <li>Manager</li>
          </ul>
        </li>
      </ul>

      <h3> Casual or Earned Leave</h3>
      <ul>
        <li>
          <strong>Leave Balance Available:</strong> Requires approval from:
          <ul>
            <li>Manager</li>
          </ul>
        </li>
        <li>
          <strong>No Leave Balance Remaining:</strong> Requires dual approval from:
          <ul>
            <li>Manager</li>
            <li>HR</li>
          </ul>
        </li>
        <li>
          <strong>2 or More Days Applied:</strong> Requires dual approval from:
          <ul>
            <li>Manager</li>
            <li>HR</li>
          </ul>
        </li>
        <li>
          <strong>5 or More Days Applied:</strong> Requires triple approval from:
          <ul>
            <li>Manager</li>
            <li>HR</li>
            <li>Director</li>
          </ul>
        </li>
      </ul>

      <p>
        These rules help streamline the approval process and ensure transparency and consistency across all leave requests.
        For any questions, please contact your HR representative.
      </p>
    </div>
  );
}

export default LeaveRules;

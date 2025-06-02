const { db } = require("../configuration/db");

const countWorkingDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  let count = 0;
  const current = new Date(start);

  while (current <= end) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) count++;
    current.setDate(current.getDate() + 1);
  }
  return count;
};

exports.putLeaveRequestForUser = async (
  userId,
  leave_type_id,
  start_date,
  end_date,
  reason
) => {
  const checkQuery = `SELECT category_leaves_remaining FROM remaining_leaves WHERE user_id = ? AND leave_type_id =?`;
  const [checkResults] = await db.query(checkQuery, [userId, leave_type_id]);
  if (!checkResults || checkResults.length === 0) {
    return {
      message: "No remaining leave record found for this user and leave type",
    };
  }
  const { category_leaves_remaining } = checkResults[0];
  const dateDifference = countWorkingDays(start_date, end_date);

  const leaveTypeQuery = `SELECT type_name FROM leave_types WHERE id = ?`;
  const [leaveTypeResult] = await db.query(leaveTypeQuery, [leave_type_id]);
  if (!leaveTypeResult.length) return { message: "Unidentified leave type!" };

  const leaveTypeName = leaveTypeResult[0].type_name;

  const userQuery = `SELECT role FROM users WHERE id = ?`;
  const [userResult] = await db.query(userQuery, [userId]);
  if (!userResult.length) return { message: "User not found!" };

  const userRole = userResult[0].role;

  console.log("leaveTypeName:", leaveTypeName);

  // Determine how many approvals are needed
  let approvalsNeeded = 1;
  console.log("Checking Sick Leave Condition:", leaveTypeName.trim());

  if (leaveTypeName.trim() === "Sick Leave") {
    console.log("Inside Sick Leave");

    if (dateDifference === 1 && category_leaves_remaining > 0) {
      approvalsNeeded = 0;
      console.log("Auto-approved: 1-day sick leave with remaining balance");
    } else if (category_leaves_remaining >= dateDifference) {
      approvalsNeeded = 0;
      console.log("Auto-approved: Sick leave with enough remaining days");
    } else {
      approvalsNeeded = 1;
      console.log("Approval required: Not enough balance");
    }
  } else {
    if (dateDifference > 5) approvalsNeeded = 3;
    else if (dateDifference > 1) approvalsNeeded = 2;
    else if (category_leaves_remaining >= dateDifference) approvalsNeeded = 1;
    else approvalsNeeded = 2;
  }

  // Determine who should approve based on role
  let statusFields = {
    manager_status: null,
    hr_status: null,
    director_status: null,
    status: "Pending",
  };

  const setFirstApprover = () => {
    if (userRole === "Employee") statusFields.manager_status = "Pending";
    else if (userRole === "Manager") statusFields.hr_status = "Pending";
    else if (userRole === "HR") statusFields.director_status = "Pending";
    else if (userRole === "Director") statusFields.hr_status = "Pending";
  };

  const setSecondApprover = () => {
    if (userRole === "Employee") {
      statusFields.manager_status = "Pending";
      statusFields.hr_status = "Pending";
    } else if (userRole === "Manager") {
      statusFields.hr_status = "Pending";
      statusFields.director_status = "Pending";
    } else if (userRole === "HR") {
      statusFields.director_status = "Pending";
      statusFields.manager_status = "Pending"; // loops back to manager
    } else if (userRole === "Director") {
      statusFields.hr_status = "Pending";
      statusFields.manager_status = "Pending"; // loops back
    }
  };

  const setThirdApprover = () => {
    statusFields.manager_status = "Pending";
    statusFields.hr_status = "Pending";
    statusFields.director_status = "Pending";
  };

  if (leaveTypeName === "Sick Leave" && approvalsNeeded === 0) {
    const query = `INSERT INTO leave_requests(user_id, leave_type_id, start_date, end_date, reason, status, manager_status, hr_status, director_status)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    try {
      const [result] = await db.query(query, [
        userId,
        leave_type_id,
        start_date,
        end_date,
        reason,
        "Approved",
        null,
        null,
        null,
      ]);
      await exports.updateLeaveCount(result.insertId);
      return {
        message: "Auto-approved sick leave. Leave count updated.",
        request_id: result.insertId,
      };
    } catch (err) {
      console.log(err.message);
      return { message: "Error while submitting auto-approved sick leave." };
    }
  } else {
    if (approvalsNeeded === 1) {
      setFirstApprover();
    } else if (approvalsNeeded === 2) {
      setSecondApprover();
    } else if (approvalsNeeded === 3) {
      setThirdApprover();
    }

    const query = `INSERT INTO leave_requests(user_id, leave_type_id, start_date, end_date, reason, status, manager_status, hr_status, director_status)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    try {
      const [result] = await db.query(query, [
        userId,
        leave_type_id,
        start_date,
        end_date,
        reason,
        statusFields.status,
        statusFields.manager_status,
        statusFields.hr_status,
        statusFields.director_status,
      ]);
      return {
        message: `Leave request submitted with ${approvalsNeeded} step verification!`,
        request_id: result.insertId,
      };
    } catch (err) {
      console.log(err.message);
      return { message: `Error occurred while submitting leave request.` };
    }
  }
};

exports.updateLeaveCount = async (leaveRequestId) => {
  const dataQuery = `
    SELECT user_id, leave_type_id, start_date, end_date
    FROM leave_requests
    WHERE id = ?
  `;

  const [dataResult] = await db.query(dataQuery, [leaveRequestId]);
  const { user_id, leave_type_id, start_date, end_date } = dataResult[0];

  const dateDifference = countWorkingDays(start_date, end_date);
  console.log(dateDifference, "diff");
  const updateCategoryCountQuery = `
    UPDATE remaining_leaves
    SET
      leaves_used = leaves_used + ?,
      category_leaves_remaining = category_leaves_remaining - ?
    WHERE user_id = ? AND leave_type_id = ?
  `;

  const updateTotalCountQuery = `
    UPDATE remaining_leaves
    SET total_remaining_days = total_remaining_days - ?
    WHERE user_id = ?
  `;

  try {
    await db.query(updateCategoryCountQuery, [
      dateDifference,
      dateDifference,
      user_id,
      leave_type_id,
    ]);

    await db.query(updateTotalCountQuery, [dateDifference, user_id]);

    return "Successfully updated! 😁";
  } catch (error) {
    console.log("Error occurred in model!", error.message);
    return {
      message: "Not able to update!",
    };
  }
};

exports.cancelLeaveRequest = async (leaveRequestId) => {
  const query = `UPDATE leave_requests 
    SET status = 'Cancelled'
    WHERE id = ?`;
  try {
    const [result] = await db.query(query, [leaveRequestId]);
    return result;
  } catch (error) {
    console.log("error occured in model !", error.message);
    return { message: "failed to cancel" };
  }
};
exports.updateManagerStatus = async (leaveRequestId) => {
  const query = `UPDATE leave_requests SET manager_status = 'Approved' WHERE id = ?`;
  try {
    await db.query(query, [leaveRequestId]);
    return await checkAndUpdateOverallStatus(leaveRequestId);
  } catch (error) {
    console.log("error occurred in model!", error.message);
    return { message: "Failed to update" };
  }
};

exports.updateDirectorStatus = async (leaveRequestId) => {
  const query = `UPDATE leave_requests SET director_status = 'Approved' WHERE id = ?`;
  try {
    await db.query(query, [leaveRequestId]);
    return await checkAndUpdateOverallStatus(leaveRequestId);
  } catch (error) {
    console.log("error occurred in model!", error.message);
    return { message: "Failed to update" };
  }
};

exports.updateHrStatus = async (leaveRequestId) => {
  const query = `UPDATE leave_requests SET hr_status = 'Approved' WHERE id = ?`;
  try {
    await db.query(query, [leaveRequestId]);
    return await checkAndUpdateOverallStatus(leaveRequestId);
  } catch (error) {
    console.log("error occurred in model!", error.message);
    return { message: "Failed to update" };
  }
};
const checkAndUpdateOverallStatus = async (leaveRequestId) => {
  const check = `SELECT manager_status, hr_status, director_status FROM leave_requests WHERE id = ?`;
  const [[request]] = await db.query(check, [leaveRequestId]);

  const statuses = [
    request.manager_status,
    request.hr_status,
    request.director_status,
  ];

  const allApprovedOrNull = statuses.every(
    (status) => status === "Approved" || status === null
  );

  if (allApprovedOrNull) {
    await exports.updateStatus(leaveRequestId);
    await exports.updateLeaveCount(leaveRequestId);
    return {
      message: "All approvals done. Overall status updated to Approved ✅",
    };
  } else {
    return { message: "Other verifications are still pending ⏳" };
  }
};

exports.updateStatus = async (leaveRequestId) => {
  const query = `UPDATE leave_requests 
    SET status = 'Approved'
    WHERE id = ?`;
  try {
    await db.query(query, [leaveRequestId]);
    return "Successfully updated !";
  } catch (error) {
    console.log("error occurred in model !", error.message);
    return { message: "failed to update" };
  }
};
exports.updateHrStatusRejected = async (leaveRequestId) => {
  const query = `UPDATE leave_requests 
    SET hr_status = 'Rejected'
    WHERE id = ?`;
  try {
    await db.query(query, [leaveRequestId]);
    return { message: "Rejected" };
  } catch (error) {
    console.log("error occurred in model !", error.message);
    return { message: "failed to update" };
  }
};
exports.updateManagerStatusRejected = async (leaveRequestId) => {
  const query = `UPDATE leave_requests 
    SET Manager_status = 'Rejected'
    WHERE id = ?`;
  try {
    await db.query(query, [leaveRequestId]);
    return { message: "Rejected" };
  } catch (error) {
    console.log("error occurred in model !", error.message);
    return { message: "failed to update" };
  }
};

exports.updateDirectorStatusRejected = async (leaveRequestId) => {
  const query = `UPDATE leave_requests 
    SET Director_status = 'Rejected'
    WHERE id = ?`;
  try {
    await db.query(query, [leaveRequestId]);
    return { message: "Rejected" };
  } catch (error) {
    console.log("error occurred in model !", error.message);
    return { message: "failed to update" };
  }
};

exports.getLeaves = async (userId) => {
  const query = `
    SELECT SUM(COALESCE(leaves_used, 0)) AS total_leaves_used
    FROM remaining_leaves
    WHERE user_id = ?;
`;
  try {
    const [results] = await db.query(query, [userId]);
    return results;
  } catch (error) {
    console.log("error occurred in model !", error.message);
    return { message: "failed to get leaves" };
  }
};

exports.getLeavesLists = async (userId) => {
  const query = `SELECT type_name , leaves_used , category_leaves_remaining , description
     FROM remaining_leaves 
     JOIN leave_types
     ON leave_types.id = remaining_leaves.leave_type_id WHERE remaining_leaves.user_id = ?`;
  try {
    const [result] = await db.query(query, [userId]);
    return result;
  } catch (error) {
    console.log("error occurred in model ", error.message);
    return { message: "failed to get lists" };
  }
};

exports.getNames = async (leave_type_id) => {
  const query = `SELECT * FROM leave_types`;
  try {
    const [result] = await db.query(query);
    return result;
  } catch (error) {
    console.log("error occurred in model ", error.message);
    return { message: "failed to get names " };
  }
};

exports.update = async (userId, requestId) => {
  const checkRole = `SELECT role from users WHERE id = ?`;
  try {
    const result = await db.query(checkRole, [userId]);
    const role = result[0][0].role;
    if (role == "Manager") {
      return await exports.updateManagerStatus(requestId);
    } else if (role == "HR") {
      return await exports.updateHrStatus(requestId);
    } else if (role == "Director") {
      return await exports.updateDirectorStatus(requestId);
    }
  } catch (error) {
    console.log("Error occurred in model !", error.message);
    return { message: "Internal server error" };
  }
};
exports.reject = async (userId, requestId) => {
  const checkRole = `SELECT role from users WHERE id = ?`;
  try {
    const result = await db.query(checkRole, [userId]);
    const role = result[0][0].role;
    if (role == "Manager") {
      return await exports.updateManagerStatusRejected(requestId);
    } else if (role == "HR") {
      return await exports.updateHrStatusRejected(requestId);
    } else if (role == "Director") {
      return await exports.updateDirectorStatusRejected(requestId);
    }
  } catch (error) {
    console.log("Error occurred in model !", error.message);
    return { message: "Internal server error" };
  }
};

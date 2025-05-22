const { db } = require("../configuration/db");

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
  const start = new Date(start_date);
  const end = new Date(end_date);
  const dateDifference = (end - start) / (1000 * 60 * 60 * 24) + 1;
  const leaveTypeCheck = `SELECT * FROM leave_types WHERE id = ?`;
  const [leaveTyperesult] = await db.query(leaveTypeCheck, [leave_type_id]);

  if (leaveTyperesult.length > 0) {
    console.log(leaveTyperesult.length);
    if (leave_type_id == 1) {
      if (dateDifference <= category_leaves_remaining) {
        if (dateDifference <= 1) {
          const query =
            "INSERT INTO leave_requests(user_id , leave_type_id , start_date, end_date , reason , status , hr_status , director_status , manager_status) VALUES (?,?,?,?,?,?,?,?,?)";
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
              message: "leave request accepted and updated leave count",
              request_id: result.insertId,
            };
          } catch (error) {
            console.log("error occurred in model !", error.message);
            return {
              message: "leave request not able to submit !",
            };
          }
        } else {
          const query = `INSERT INTO leave_requests(user_id , leave_type_id , start_date, end_date , reason , hr_status , director_status)
                         VALUES (?,?,?,?,?,?,?)`;
          try {
            await db.query(query, [
              userId,
              leave_type_id,
              start_date,
              end_date,
              reason,
              null,
              null,
            ]);
            return {
              message: "leave request submitted in one step verification !",
            };
          } catch (error) {
            console.log(error.message);
            return {
              message: "error occurred in model (one step verification)",
            };
          }
        }
      } else {
        const query = `INSERT INTO leave_requests(user_id , leave_type_id , start_date, end_date , reason , director_status)
                         VALUES (?,?,?,?,?,?)`;
        try {
          await db.query(query, [
            userId,
            leave_type_id,
            start_date,
            end_date,
            reason,
            null,
          ]);
          return {
            message: "leave request submitted with two step verification !",
          };
        } catch (error) {
          console.log(error.message);
          return { message: "error occurred in model (two step verification)" };
        }
      }
    } else {
      if (dateDifference <= category_leaves_remaining) {
        if (dateDifference >= 5) {
          const query = `INSERT INTO leave_requests(user_id , leave_type_id , start_date, end_date , reason)
                           VALUES (?,?,?,?,?)`;
          try {
            await db.query(query, [
              userId,
              leave_type_id,
              start_date,
              end_date,
              reason,
            ]);
            return {
              message: "leave request submitted with 3 step verification !",
            };
          } catch (error) {
            console.log(error.message);
            return { message: "error occurred in model (3 step verification)" };
          }
        } else if (dateDifference >= 2) {
          const query = `INSERT INTO leave_requests(user_id , leave_type_id , start_date, end_date , reason , director_status)
                           VALUES (?,?,?,?,?,?)`;
          try {
            await db.query(query, [
              userId,
              leave_type_id,
              start_date,
              end_date,
              reason,
              null,
            ]);
            return {
              message: "leave request is submitted with 2 step verification !",
            };
          } catch (error) {
            console.log(error.message);
            return {
              message: "error occurred in model !(2 step verification)",
            };
          }
        } else {
          const query = `INSERT INTO leave_requests(user_id , leave_type_id , start_date, end_date , reason , hr_status , director_status)
                           VALUES (?,?,?,?,?,?,?)`;
          try {
            await db.query(query, [
              userId,
              leave_type_id,
              start_date,
              end_date,
              reason,
              null,
              null,
            ]);
            return {
              message:
                "leave request is submitted with one step verification !",
            };
          } catch (error) {
            console.log(error.message);
            return {
              message: "error occurred in model ! (one step verification !)",
            };
          }
        }
      } else{
        const query = `INSERT INTO leave_requests(user_id , leave_type_id , start_date, end_date , reason , director_status)
                           VALUES (?,?,?,?,?,?)`;
          try {
            await db.query(query, [
              userId,
              leave_type_id,
              start_date,
              end_date,
              reason,
              null,
            ]);
            return {
              message: "leave request is submitted with 2 step verification !",
            };
          } catch (error) {
            console.log(error.message);
            return {
              message: "error occurred in model !(2 step verification)",
            };
          }
      }
    }
  } else {
    return { message: "Unidentified leave type !" };
  }
};

exports.updateLeaveCount = async (leaveRequestId) => {
  const dataQuery =
    "SELECT user_id , leave_type_id , start_date , end_date FROM leave_requests WHERE id = ?";
  const [dataResult] = await db.query(dataQuery, [leaveRequestId]);
  const { user_id, leave_type_id, start_date, end_date } = dataResult[0];
  const startDate = new Date(start_date);
  const endDate = new Date(end_date);
  const dateDifference = (endDate - startDate) / (1000 * 60 * 60 * 24) + 1;
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
    return "successfully updated ! 😁";
  } catch (error) {
    console.log("error occurred in model !", error.message);
    return {
      message: "not able to update !",
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
  const query = `UPDATE leave_requests 
    SET manager_status = "Approved"
    WHERE id = ?`;
  try {
    await db.query(query, [leaveRequestId]);
    const check = `SELECT * FROM leave_requests WHERE id = ?`;
    const [results] = await db.query(check, [leaveRequestId]);
    const { id, manager_status, hr_status, director_status } = results[0];
    if (
      manager_status === "Approved" &&
      hr_status === "Approved" &&
      director_status === "Approved"
    ) {
      exports.updateStatus(id);
      return "Successfully updated 😁";
    } else {
      return { message: "other verification are pending " };
    }
  } catch (error) {
    console.log("error occurred in model !", error.message);
    return {
      message: "failed to update",
    };
  }
};

exports.updateDirectorStatus = async (leaveRequestId) => {
  const query = `UPDATE leave_requests 
    SET director_status = 'Approved'
    WHERE id = ?`;
  try {
    await db.query(query, [leaveRequestId]);
    const check = `SELECT * FROM leave_requests WHERE id = ?`;
    const [results] = await db.query(check, [leaveRequestId]);
    const { id, manager_status, hr_status, director_status } = results[0];
    if (
      manager_status === "Approved" &&
      hr_status === "Approved" &&
      director_status === "Approved"
    ) {
      exports.updateStatus(id);
      return "Successfully updated 😁";
    } else {
      return { message: "other verification are pending " };
    }
  } catch (error) {
    console.log("error occurred in model !", error.message);
    return { message: "failed to update" };
  }
};

exports.updateHrStatus = async (leaveRequestId) => {
  const query = `UPDATE leave_requests 
    SET hr_status = 'Approved'
    WHERE id = ?`;
  try {
    await db.query(query, [leaveRequestId]);
    const check = `SELECT * FROM leave_requests WHERE id = ?`;
    const [results] = await db.query(check, [leaveRequestId]);
    const { id, manager_status, hr_status, director_status } = results[0];
    if (
      manager_status === "Approved" &&
      hr_status === "Approved" &&
      director_status === "Approved"
    ) {
      exports.updateStatus(id);
      return "Successfully updated 😁";
    } else {
      return { message: "other verification are pending " };
    }
  } catch (error) {
    console.log("error occurred in model !", error.message);
    return { message: "failed to update" };
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

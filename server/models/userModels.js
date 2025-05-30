const { db } = require("../configuration/db");
const bcrypt = require("bcrypt");

exports.fetchAllUsers = async (userId) => {
  const query = `SELECT 
    u.id AS employee_id,
    u.name AS employee_name,
    u.role,
    u.email,
    u.date_of_joining,
    u.contact_number,
    m.name AS manager_name
FROM users u
LEFT JOIN users m ON u.manager_id = m.id
LEFT JOIN remaining_leaves rl ON rl.user_id = u.id
WHERE u.manager_id = ?
GROUP BY u.id, u.name, u.role, u.email, m.name
ORDER BY u.id;`;
  try {
    const [results] = await db.query(query, [userId]);
    return results;
  } catch (error) {
    console.log("error occurred in model !", error.message);
    return;
  }
};

exports.fetchTotalLeavesForUser = async (id) => {
  const query = `SELECT user_id , total_remaining_days 
    FROM remaining_leaves
    WHERE user_id = ?
    LIMIT 1`;
  try {
    const [results] = await db.query(query, [id]);
    return results;
  } catch (error) {
    console.log("error occurred in model !", error.message);
    return null;
  }
};

exports.fetchTotalCategoryLeavesForUser = async (userId, leaveId) => {
  const query = `SELECT user_id , category_leaves_remaining 
    FROM remaining_leaves 
    WHERE user_id = ? AND leave_type_id =?`;
  try {
    const [results] = await db.query(query, [userId, leaveId]);
    return results;
  } catch (error) {
    console.log("error occurred in model !", error.message);
    return;
  }
};

exports.getTakenLeaves = async (userId, leaveTypeId) => {
  const query = `SELECT user_id , leave_type_id , leaves_used 
    FROM remaining_leaves 
    WHERE user_id =? AND leave_type_id = ?`;
  try {
    const [result] = await db.query(query, [userId, leaveTypeId]);
    return result;
  } catch (error) {
    console.log("error occurred in model !", error.message);
    return;
  }
};

exports.getRequests = async (userId) => {
  const roleCheckQuery = `SELECT role FROM users WHERE id = ?`;
  const roleResults = await db.query(roleCheckQuery, [userId]);
  const role = roleResults[0][0].role;
  let query = "";
  if (role == "Manager") {
    query = `SELECT leave_requests.id, users.name ,users.role, users.email,leave_types.type_name,reason , start_date, end_date,ABS(DATEDIFF(end_date , start_date))+1 AS dateDiff  FROM leave_requests
    JOIN users ON users.id = leave_requests.user_id
    JOIN leave_types ON leave_types.id = leave_requests.leave_type_id
    WHERE users.manager_id= ? AND leave_requests.manager_status = 'PENDING';`;
  } else if (role == "HR") {
    query = `SELECT leave_requests.id, users.name ,users.role, users.email,leave_types.type_name,reason , start_date, end_date,ABS(DATEDIFF(end_date , start_date))+1 AS dateDiff  FROM leave_requests
    JOIN users ON users.id = leave_requests.user_id
    JOIN leave_types ON leave_types.id = leave_requests.leave_type_id
    WHERE users.hr_id= ? AND leave_requests.hr_status = 'PENDING';`;
  } else if (role == "Director") {
    query = `SELECT leave_requests.id, users.name ,users.role, users.email,leave_types.type_name,reason , start_date, end_date,ABS(DATEDIFF(end_date , start_date))+1 AS dateDiff  FROM leave_requests
    JOIN users ON users.id = leave_requests.user_id
    JOIN leave_types ON leave_types.id = leave_requests.leave_type_id
    WHERE users.director_id= ? AND leave_requests.director_status = 'PENDING';`;
  }
  try {
    const [result] = await db.query(query, [userId]);
    return result;
  } catch (error) {
    console.log("error occurred in model !", error.message);
    return;
  }
};

exports.getPendingRequests = async (userId) => {
  const query = `SELECT * FROM leave_requests 
    WHERE user_id = ? AND status = 'Pending'`;
  try {
    const [results] = await db.query(query, [userId]);
    return results;
  } catch (error) {
    console.log("error occurred in model !", error.message);
    return;
  }
};

exports.getLatestRequests = async (userId) => {
  const query = `SELECT * FROM leave_requests 
    WHERE user_id =? ORDER BY id DESC`;
  try {
    const [results] = await db.query(query, [userId]);
    return results;
  } catch (error) {
    console.log("error occurred in model ", error.message);
    return null;
  }
};
exports.getUserWithEmail = async (email) => {
  const query = `SELECT * FROM users WHERE email = ?`;

  try {
    const [results] = await db.query(query, [email]);

    return results.length > 0 ? results[0] : null;
  } catch (error) {
    console.error("Error in getUserWithEmail:", error.message);
    throw error; 
  }
};

exports.createUser = async (
  name,
  email,
  hashed,
  role,
  managerId,
  hrId,
  directorId,
  contact_number
) => {
  const addQuery = `INSERT INTO users (name, email, password, role, manager_id, hr_id, director_id, contact_number)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const insertQuery = `INSERT INTO remaining_leaves(user_id , leave_type_id , leaves_used , category_leaves_remaining, total_remaining_days)
     VALUES ?`;
  try {
    const [addResult] = await db.query(addQuery, [
      name,
      email,
      hashed,
      role,
      managerId,
      hrId,
      directorId,
      contact_number,
    ]);
    const userId = addResult.insertId;

    const leaveRows = [
      [userId, 1, 0, 5, 15],
      [userId, 2, 0, 5, 15],
      [userId, 3, 0, 5, 15],
    ];

    const [insertResult] = await db.query(insertQuery, [leaveRows]);
    return { addResult, insertResult };
  } catch (error) {
    console.log("error occurred in model", error.message);
    return;
  }
};

exports.getUserInfo = async (userId) => {
  const query = `SELECT * FROM users WHERE id = ?`;
  try {
    const result = await db.query(query, [userId]);
    return result;
  } catch (error) {
    console.log("error occurred in model ", error.message);
    return null;
  }
};

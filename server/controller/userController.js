const userModel = require("../models/userModels");

exports.getAllUsersWithLeavesForManager = async function (request, h) {
  try {
    const managerId = request.params.managerid;
    const users = await userModel.fetchAllUsersWithLeaves(managerId);
    if (!users) return h.response("Not found !").code(404);
    else return h.response(users).code(200);
  } catch (error) {
    console.error("Error occurred:", error.message);
    return h.response("Internal Server Error").code(500);
  }
};

exports.getLeavesForUser = async function (request, h) {
  try {
    const id = request.params.id;
    const user = await userModel.fetchTotalLeavesForUser(id);
    if (!user || user.length<1) return h.response({error : 'user not found !'}).code(404);
    else return h.response(user[0]).code(200);
  } catch (error) {
    console.log("error occurred", error.message);
    return h.response("Internal Server Error").code(500);
  }
};

exports.getCategoryLeavesForUser = async function (request, h) {
  try {
    const userId = request.params.id;
    const leaveId = request.params.leaveid;
    const user = await userModel.fetchTotalCategoryLeavesForUser(
      userId,
      leaveId
    );
    if (!user) return h.response("User not found !").code(404);
    else return h.response(user[0]).code(200);
  } catch (error) {
    console.log("error occurred !", error.message);
    return h.response("Internal Server Error").code(500);
  }
};

exports.getLeavesCountTakenByUser = async (request, h) => {
  try {
    const userId = request.params.userid;
    const leaveTypeId = request.params.leavetypeid;
    const user = await userModel.getTakenLeaves(userId, leaveTypeId);
    if (!user) return h.response("User not found").code(404);
    else return h.response(user[0]).code(200);
  } catch (error) {
    console.log("error occurred ", error.message);
    return h.response("Internal server error").code(500);
  }
};

exports.getRequestForManager = async (request, h) => {
  try {
    const managerId = request.params.managerid;
    const user = await userModel.getRequestForManager(managerId);
    if (!user) return h.response("user not found").code(404);
    else return h.response(user).code(200);
  } catch (error) {
    console.log("error occured ", error.message);
    return h.response("Internal server error").code(500);
  }
};

exports.getPendingRequest = async (request, h) => {
  try {
    const userId = request.params.userid;
    const user = await userModel.getPendingRequests(userId);
    if (!user) return h.response("User not found").code(404);
    else return h.response(user).code(200);
  } catch (error) {
    console.log("error occurred !", error.message);
    return h.response("Internal server error").code(500);
  }
};
exports.getLatestRequests = async (request, h) => {
  try {
    const userId = request.params.userid;
    const user = await userModel.getLatestRequests(userId);
    if (!user) return h.response("User not found !").code(404);
    else return h.response(user).code(200);
  } catch (error) {
    console.log("error occurred in controller", error.message);
    return h.response("Internal server error").code(500);
  }
};

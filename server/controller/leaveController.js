const leaveModel = require('../models/leaveModels');

exports.requestLeaveById = async (request, h) => {
  try {
    const userId = request.params.id;
    const { leave_type_id, start_date, end_date, reason } = request.payload;
    const user = await leaveModel.putLeaveRequestForUser(userId, leave_type_id, start_date, end_date, reason);
    if (!user) return h.response("User not found").code(404);
    else return h.response(user).code(200);
  }
  catch (error) {
    console.log("error occurred", error.message);
    return h.response("Internal server error ! ").code(500);
  }
}
exports.canceleavebyId = async (request, h) => {
  try {
    const leaveRequestId = request.params.leaverequestid;
    const user = await leaveModel.cancelLeaveRequest(leaveRequestId);
    if (!user) return h.response("User not found !").code(404);
    else return h.response(user[0]).code(200);
  }
  catch (error) {
    console.log("error occured", error.message);
    return h.response("Internal server error").code(500);
  }
}
exports.updateLeaveCount = async (request, h) => {
  try {
    const leaveRequestId = request.params.leaverequestid;
    const user = await leaveModel.updateLeaveCount(leaveRequestId);
    if (!user) return h.response("User not found !").code(404);
    else return h.response(user[0]).code(200);
  }
  catch (error) {
    console.log("error occured !", error.message);
    return h.response("Internal server error !").code(500);
  }
}
exports.updateManagerStatus = async (request, h) => {
  try {
    const leaveRequestId = request.params.leaverequestid;
    const user = await leaveModel.updateManagerStatus(leaveRequestId);
    if (!user) return h.response('user not found !').code(404);
    else return h.response(user[0]).code(200);
  }
  catch (error) {
    console.log("error , occured", error.message);
    return h.response("Internal server error").code(500);
  }
}

exports.updateDirectorStatus = async (request, h) => {
  try {
    const leaveRequestId = request.params.leaverequestid;
    const user = await leaveModel.updateDirectorStatus(leaveRequestId);
    if (!user) return h.response("User not found !").code(404);
    else return h.response(user[0]).code(200);
  }
  catch (error) {
    console.log("error occured ", error.message);
    return h.response("Internal server error").code(500);
  }
}

exports.updateHrStatus = async (request, h) => {
  try {
    const leaveRequestId = request.params.leaverequestid;
    const user = await leaveModel.updateHrStatus(leaveRequestId);
    if (!user) return h.response('User not found !').code(404);
    else return h.response(user[0]).code(200);
  }
  catch (error) {
    console.log("error occurred", error.message);
    return h.response("Internal server error").code(500);
  }
}

exports.updateStatus = async (request, h) => {
  try {
    const leaveRequestId = request.params.leaverequestid;
    const user = await leaveModel.updateStatus(leaveRequestId);
    if (!user) return h.response('User not found !').code(404);
    else return h.response(user[0]).code(200);
  }
  catch (error) {
    console.log('error occurred ', error.message);
    return h.response('Internal server error').code(500);
  }
}

exports.getleavesUsed = async (request, h) => {
  try {
    const userId = request.params.userid;
    const user = await leaveModel.getLeaves(userId);
    if (!user) return h.response("User not found !").code(404);
    else return h.response(user[0]).code(200);
  }
  catch (error) {
    console.log("error occurred !", error.message);
    return h.response('Internal server error').code(500);
  }
}

exports.getLeavesList = async (request, h) => {
  const userId = request.params.userid;
  try {
    const user = await leaveModel.getLeavesLists(userId);
    return h.response(user);
  }
  catch (error) {
    console.log('error occured in controller', error.message);
    return h.response("Internal server error").code(500);
  }
}


exports.getName = async (request, h) => {
  try{
    const user = await leaveModel.getNames();
    return h.response(user).code(200);
  }
  catch(error){
    console.log('error occurred in controller !',error.message);
    return h.response('Internal server error').code(500)
  }
}

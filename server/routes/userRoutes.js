const userController = require("../controller/userController");
const authController = require("../controller/authController");
const { verifyToken } = require("../middleware/verification");

module.exports = [
  {
    method: "POST",
    path: "/login",
    handler: authController.loginUser,  //requirred
  },
  {
    method: "POST",
    path: "/user",
    handler: authController.addUser,  //requirred
  },
  // {
  //   method : 'GET',
  //   path : '/userdetails/{id}',
  //   handler: userController.getInfo,
  //   options: {
  //     pre: [{ method: verifyToken }],
  //   },
  // },
  {
    method: "GET",
    path: "/mappedusers/{userid}",
    handler: userController.getAllusers,  //requirred
    options: {
      pre: [{ method: verifyToken }],
    },
  },
  {
    method: "GET",
    path: "/users/{id}/leaves",
    handler: userController.getLeavesForUser, //requirred
    options: {
      pre: [{ method: verifyToken }],
    },
  },
  // {
  //   method: "GET",
  //   path: "/users/{id}/leaves/{leaveid}",
  //   handler: userController.getCategoryLeavesForUser,
  //   options: {
  //     pre: [{ method: verifyToken }],
  //   },
  // },
  // {
  //   method: "GET",
  //   path: "/user/{userid}/leavesused/{leavetypeid}",
  //   handler: userController.getLeavesCountTakenByUser,
  //   options: {
  //     pre: [{ method: verifyToken }],
  //   },
  // },
  {
    method: "GET",
    path: "/userswithrequest/{userId}",
    handler: userController.getRequest,  //requirred
    options: {
      pre: [{ method: verifyToken }],
    },
  },
  {
    method: "GET",
    path: "/pendingleaverequest/{userid}",
    handler: userController.getPendingRequest, //usefull 
    options: {
      pre: [{ method: verifyToken }],
    },
  },
  {
    method: "GET",
    path: "/latestleaverequest/{userid}",
    handler: userController.getLatestRequests,
    options: {
      pre: [{ method: verifyToken }],
    },
  },
];

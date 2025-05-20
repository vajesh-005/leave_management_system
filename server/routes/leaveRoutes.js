const leaveController = require('../controller/leaveController');
const { verifyToken } = require('../middleware/verification');

module.exports = [
  {
    method: 'POST',
    path: '/requestleave/{id}',
    handler: leaveController.requestLeaveById,
    options: {
      pre: [{ method: verifyToken }]
    }
  },
  {
    method: 'PUT',
    path: '/cancelleave/{leaverequestid}',
    handler: leaveController.canceleavebyId,
    options: {
      pre: [{ method: verifyToken }]
    }
  },
  {
    method: 'PUT',
    path: '/leaveapproved/{leaverequestid}',
    handler: leaveController.updateLeaveCount,
    options: {
      pre: [{ method: verifyToken }]
    }
  },
  {
    method: 'PUT',
    path: '/managerapproved/{leaverequestid}',
    handler: leaveController.updateManagerStatus,
    options: {
      pre: [{ method: verifyToken }]
    }
  },
  {
    method: 'PUT',
    path: '/directorapproved/{leaverequestid}',
    handler: leaveController.updateDirectorStatus,
    options: {
      pre: [{ method: verifyToken }]
    }
  },
  {
    method: 'PUT',
    path: '/hrapproved/{leaverequestid}',
    handler: leaveController.updateHrStatus,
    options: {
      pre: [{ method: verifyToken }]
    }
  },
  {
    method: 'PUT',
    path: '/statusapproval/{leaverequestid}',
    handler: leaveController.updateStatus,
    options: {
      pre: [{ method: verifyToken }]
    }
  },

  {
    method: 'GET',
    path: '/totalleavesused/{userid}',
    handler: leaveController.getleavesUsed,
    options: {
      pre: [{ method: verifyToken }]
    }
  },
  {
    method: 'GET',
    path: '/leaveslist/{userid}',
    handler: leaveController.getLeavesList,
    options: {
      pre: [{ method: verifyToken }]
    }
  },

  {
    method: 'GET',
    path: '/leavename',
    handler: leaveController.getName
  }
];

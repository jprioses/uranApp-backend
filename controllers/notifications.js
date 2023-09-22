const UsersServices = require("../services/users");
const NotificationsServices = require("../services/notifications");
const catchedAsync = require("../utils/catchedAsync");
const { response } = require("../utils/response");
const ClientError = require("../utils/errors");

const test = (req, res) => {
  response(res, 200, {
    mensaje: "Sent from ./controllers/notifications,js",
  });
};

const getAllNotifications = async (req, res) => {
  const { page = 1, limit = 10 } = req.params;

  const notifications = await NotificationsServices.getNotifications(
    page,
    limit,
    true
  );

  if (!notifications) throw new ClientError("Couldn't get notifications");

  const totalDocs = await NotificationsServices.countNotifications();

  response(res, 200, {
    notifications,
    total: Math.ceil(totalDocs / limit),
    page: page,
  });
};

const getLastNotifications = async (req, res) => {
  const { limit = 10 } = req.params;

  const notifications = await NotificationsServices.getNotifications(
    1,
    limit,
    false
  );

  if (!notifications) throw new ClientError("Couldn't get notifications");

  response(res, 200, notifications);
};

const deleteNotifications = async (req, res) => {
  const id = req.params.id;

  const notification = await NotificationsServices.deleteNotifications(id);

  if (!notification) throw new ClientError("Couldn't delete notification");

  response(res, 200, notification);
};

const getNotifications = async (req, res) => {
  const id = req.params.id;

  const notification = await NotificationsServices.getNotificationsById(id);

  if (!notification) throw new ClientError("Couldn't find notification");

  response(res, 200, notification);
};

const recoverData = async (req, res) => {
  const id = req.params.id;
  const parentId = req.user._id;

  const notification = await NotificationsServices.getNotificationsById(id);

  if (!notification) throw new ClientError("Couldn't get historic");

  if (notification.recovery) {

    const userId = notification.recovery._id 
    const recovery  = notification.recovery;
    delete recovery._id
  
    const user = await UsersServices.updateUsers(userId, recovery, true, true);
 
    if (!user) throw new ClientError("Couldn't update user");

    await NotificationsServices.createNotifications(
      parentId,
      userId,
      "user recovered",
    );

    response(res, 200, user);
  } else {
    throw new ClientError("Doesn't have data to recover");
  }
};

module.exports = {
  test,
  getAllNotifications: catchedAsync(getAllNotifications),
  getLastNotifications: catchedAsync(getLastNotifications),
  deleteNotifications: catchedAsync(deleteNotifications),
  getNotifications: catchedAsync(getNotifications),
  recoverData: catchedAsync(recoverData),
};

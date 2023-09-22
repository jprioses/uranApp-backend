const Notifications = require("../Models/Notifications");

const createNotifications = (parent, user,type, recovery={}) => {
  return new Notifications({ref_parent: parent, ref_users: user, recovery, type}).save();
};

const getNotifications = (page, limit, all) => {
  if (!all) {
    return Notifications.find().sort({'created_at':-1}).limit(limit).populate(['ref_users', 'ref_parent']);  
  }
  return Notifications.find().sort({'created_at':-1}).limit(limit * 1).skip((page - 1) * limit).populate(['ref_users', 'ref_parent']);
}

const getNotificationsById = (id) => {
  return Notifications.findById(id).populate(['ref_users', 'ref_parent']);
}

const countNotifications = () => {
  return Notifications.countDocuments();
}

const deleteNotifications = (id) => {
  return Notifications.findByIdAndDelete(id);
}

const deleteRecovery = (ref) => {
  const expiringDate = moment().subtract(15, "days").startOf("day");

  return Historics.deleteMany(
    {date: { $lt: { expiringDate } } } 
  );
};



module.exports = {
    createNotifications,
    getNotifications,
    countNotifications,
    deleteNotifications,
    getNotificationsById
}
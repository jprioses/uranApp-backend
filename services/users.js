const Users = require("../Models/Users");

const findUserById = (id) => {
  return Users.findById(id).then((user) => user);
};

const findUsers = (params) => {
  return Users.find(params).then((user) => user);
};

const createUser = (data) => {
  return new Users(data).save();
};

const updateUser = (id, data, getNew) => {
  return Users.findOneAndUpdate({ _id: id }, { $set: data }, { new: getNew });
};

const deleteUser = (id) => {
  return Users.findOneAndDelete({ _id: id });
};



module.exports = {
  findUserById,
  createUser,
  findUsers,
  updateUser,
  deleteUser,
};

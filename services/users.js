const Users = require("../Models/Users");
const { errorResponse } = require("../utils/response");

const findUsersById = (id) => {
  return Users.findById(id).then((user) => user);
};

const findUsers = (params) => {
  return Users.find(params).then((user) => user);
};

const createUsers = (data) => {
  return new Users(data).save();
};

const updateUsers = (id, data, upsert=false, getNew=false) => {
  return Users.findOneAndUpdate({ _id: id }, { $set: data }, {upsert , new: getNew });
};

const deleteUsers = (id) => {
  return Users.findByIdAndDelete(id);
};

const updateUsersByArray = (idArray, data,) => {
  return Users.updateMany({_id: {$in : idArray}}, {$set: data});
}



module.exports = {
  findUsersById,
  createUsers,
  findUsers,
  updateUsers,
  deleteUsers,
  updateUsersByArray
};

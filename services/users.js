const Users = require("../Models/Users");
const ClientError = require("../utils/errors");

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
  return Users.findOneAndUpdate({_id:id}, { $set: data },{ new: getNew});
};

const deleteUser = (id) => {
  return Users.findOneAndDelete({_id:id});
};

const updateUsers = (params, newParams) => {
  return Users.updateMany({ref_leader: params.ref_leader},{ref_leader: newParams.ref_leader, ref_godfather: newParams.ref_godfather}, {new: tue});
}



module.exports = {
  findUserById,
  createUser,
  findUsers,
  updateUser,
  deleteUser,
  updateUsers
};

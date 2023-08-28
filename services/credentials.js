const Credentials = require("../Models/Credentials");

const findCredentials = ({ username }) => {
  return Credentials.findOne({
    username: username.toLowerCase(),
  }).then((user) => user);
};

const saveCredential = (data, user) => {
  return new Credentials(data).save();
};

module.exports = {
  findCredentials,
  saveCredential,
};

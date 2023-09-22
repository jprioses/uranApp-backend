const bcrypt = require('bcrypt');

const encryptPassword = (password) => {
  return bcrypt.hash(password, 10);
};

const decryptPassword = (password, encrypted) => {
  return bcrypt.compareSync(password, encrypted);
};

module.exports = {
  encryptPassword,
  decryptPassword,
};

const jwt = require("jwt-simple");
const moment = require("moment");

//Secret key to generate token, to code and uncode the token
//Restric some methods to certain users
const secret = "SECRET_KEY_FOR_URAN_APP_PROJECT_170911";

//Function to generate tokens, this tokens gives user info to all links
const createToken = (user) => {
  //iat date of session exp expire date
  const payload = {
    _id: user._id,
    username: user.username,
    ref_users: user.ref_users,
    iat: moment().unix(),
    exp: moment().add(10, "days").unix(),
  };

  //Return encoded token
  return jwt.encode(payload, secret);
};

module.exports = {
  secret,
  createToken,
};

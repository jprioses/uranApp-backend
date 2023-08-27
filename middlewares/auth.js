const jwt = require("jwt-simple");
const moment = require("moment");

const libjwt = require("../utils/jwt");
const secret = libjwt.secret;

//next allows to pass to next middleware or function
exports.auth = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(403).send({
      status: "Error",
      message: "Request doesnt have auth header",
    });
  }

  //Clean token, replace ' and "
  let token = req.headers.authorization.replace(/['"]+/g, "");

  try {
    const payload = jwt.decode(token, secret);

    //Check expiration date

    if (payload.exp <= moment().unix()) {
      return res.status(401).send({
        status: "Error",
        message: "Expired token",
      });
    }
    //Add user data to request
    req.user = payload;
  } catch (error) {
    return res.status(404).send({
      status: "Error",
      message: "Invalid Token",
    });
  }

  //Pass to the next functio in this case is the controller
  next();
};

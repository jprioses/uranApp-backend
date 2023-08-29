const jwt = require("jwt-simple");
const moment = require("moment");

const libjwt = require("../services/jwt");
const catchedAsync = require("../utils/catchedAsync");
const secret = libjwt.secret;

const ClientError = require("../utils/errors");

//next allows to pass to next middleware or function
exports.auth = catchedAsync(async (req, res, next) => {
  if (!req.headers.authorization) {
    throw new ClientError("Must provide auth haader", 403);
  }
  
  //Clean token, replace ' and "
  let token = req.headers.authorization.replace(/['"]+/g, "");

  try {
    const payload = jwt.decode(token, secret);

    //Check expiration date

    if (payload.exp <= moment().unix()) {
      throw new ClientError("Expired token", 401);
    }
    //Add user data to request
    req.user = payload;
   
  } catch (error) {
    throw new ClientError("Invalid Token", 404);
  }
  //Pass to the next functio in this case is the controller
  next();
});

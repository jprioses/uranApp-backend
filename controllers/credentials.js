const JwtService = require("../services/jwt");
const CredentialsServices = require("../services/credentials");
const UsersServices = require("../services/users");
const EncryptServices = require("../services/encrypt");
const NotificationsServices = require("../services/notifications");
const catchedAsync = require("../utils/catchedAsync");
const { response } = require("../utils/response");
const ClientError = require("../utils/errors");

//test controller
const testCredentials = (req, res) => {
  conosole.log("Here route");
  response(res, 200, { user: "Juan Pablo Rios" });
};

//Create user
const createCredentials = async (req, res) => {
  const params = req.body;
  const userId = req.params.user_id;

 
  if (!params.username || !params.password)
    throw new ClientError("Must type username and password");

  const credentialsQuery = await CredentialsServices.findCredentials({
    username: params.username.toLowerCase(),
  });


  if (credentialsQuery && credentialsQuery.length >= 1)
    throw new ClientError("Username already taken");

  const userQuery = await CredentialsServices.findCredentials({
    ref_users: userId,
  });

  if (userQuery && userQuery.length >= 1)
    throw new ClientError("User already has credentials");

  const user = await UsersServices.findUsersById(userId);

  if (!user) throw new ClientError("Must give valid user id");

  const pwd = await EncryptServices.encryptPassword(params.password);

  params.password = pwd;
  params.ref_users = userId;

  const credentials = await CredentialsServices.saveCredentials(params);
  await NotificationsServices.createNotifications(
    req.user.ref_users,
    userId,
    "credentials created"
  );

  response(res, 200, {
    _id: credentials._id,
    username: credentials.username,
    ref_users: credentials.ref_users,
  });
};

const login = async (req, res) => {
  const params = req.body;

  if (!params.username || !params.password)
    throw new ClientError("Must type username and password");

  const credentials = await CredentialsServices.findCredentials({
    username: params.username.toLowerCase(),
  });

  if (!credentials || credentials.length == 0) throw new ClientError("Incorrect username or password");
  

  const pwd = EncryptServices.decryptPassword(
    params.password,
    credentials[0].password
  );

  if (!pwd) throw new ClientError("Incorret password");

  const token = JwtService.createToken(credentials[0]);

  response(res, 200, {
    _id: credentials._id,
    username: credentials.username,
    ref_users: credentials.ref_users,
    token,
  });
};

const updateCredentials = async (req, res) => {
  const userId = req.params.user_id;
  const bodyParams = req.body;
  const params = {};

  //Get user credentials
  const credentials = await CredentialsServices.findCredentials({ref_users: userId});

  if (!credentials) throw new ClientError("Incorret user");

  if (bodyParams.username && bodyParams.username.length > 0)
    params.username = bodyParams.username;
  if (bodyParams.password) {
    //get and decrypt old password

    if (!bodyParams.newPassword || bodyParams.newPassword.length == 0)
      throw new ClientError("Must provide a new password");

    const oldPwd = EncryptServices.decryptPassword(
      bodyParams.password,
      credentials[0].password
    );

    if (!oldPwd) throw new ClientError("Incorret password");

    //encrypt new password
    const pwd = await EncryptServices.encryptPassword(bodyParams.newPassword);

    params.password = pwd;
  }

  //update credentials qith new password and username

  if (Object.keys(params).length > 0) {
    const newCredentials = await CredentialsServices.updateCredentials(
      credentials[0]._id,
      params
    );

    if (!newCredentials) throw new ClientError("Couldn´t update credentials");

    await NotificationsServices.createNotifications(
      req.user.ref_users,
      userId,
      "credentials updated"
    );

    response(res, 200, {
      _id: newCredentials._id,
      username: newCredentials.username,
      ref_users: newCredentials.ref_users,
    });
  } else {
    throw new ClientError("Couldn't update credentials");
  }
};

module.exports = {
  testCredentials,
  createCredentials: catchedAsync(createCredentials),
  login: catchedAsync(login),
  updateCredentials: catchedAsync(updateCredentials),
};

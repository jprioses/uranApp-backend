const JwtService = require("../services/jwt");
const CredentialsServices = require("../services/credentials");
const UsersServices = require("../services/users");
const EncryptServices = require("../services/encrypt");
const catchedAsync = require("../utils/catchedAsync");
const { response } = require("../utils/response");
const ClientError = require("../utils/errors");

//test controller
const testCredentials = (req, res) => {
  conosole.log("Here route");
  response(res, 200, { user: "Juan Pablo Rios" });
};

//Create user
const postCredentials = async (req, res) => {
  let bodyParams = req.body;

  if (!bodyParams.username || !bodyParams.password)
    throw new ClientError("Must type username and password");

  const credentialQuery = await CredentialsServices.findCredentials(bodyParams);

  if (credentialQuery && credentialQuery.length >= 1)
    throw new ClientError("Username already taken");

  const userQuery = await UsersServices.findUserById(req.params.user);

  if (!userQuery) throw new new ClientError("Must give valid user id")();

  const pwd = await EncryptServices.encryptPassword(bodyParams);

  bodyParams.password = pwd;
  bodyParams.ref_users = req.params.user;

  const credential = await CredentialsServices.saveCredential(bodyParams);

  response(res, 200, credential);
};

const postCredentialsLogin = async (req, res) => {
  const bodyParams = req.body;

  if (!bodyParams.username || !bodyParams.password)
    throw new ClientError("Must type username and password");

  const credential = await CredentialsServices.findCredentials(bodyParams);

  if (!credential) throw new ClientError("Incorret username");

  const pwd = EncryptServices.decryptPassword(
    bodyParams.password,
    credential.password
  );

  if (!pwd) throw new ClientError("Incorret password");

  const token = JwtService.createToken(credential);

  response(res, 200, {
    _id: credential._id,
    username: credential.username,
    ref_users: credential.ref_users,
    token,
  });
};

module.exports = {
  testCredentials,
  postCredentials: catchedAsync(postCredentials),
  postCredentialsLogin: catchedAsync(postCredentialsLogin),
};

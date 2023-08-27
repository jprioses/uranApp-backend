const bcrypt = require("bcrypt");
const Credentials = require("../Models/Credentials");
const Users = require("../Models/Users");
const jwt = require("../utils/jwt");

//test controller
const testCredentials = (req, res) => {
  console.log(req.user)
  return res.status(200).send({
    mensaje: "Sent from ./controllers/user,js",
    usuario: req.user,
  });
};

//Create user
const postCredentials = async (req, res) => {
  try {
    let bodyParams = req.body;

    if (!bodyParams.username || !bodyParams.password) {
      throw new Error("Must type username and password");
    }

    const credentialQuery = await Credentials.find({
      username: bodyParams.username.toLowerCase(),
    }).then((user) => user);

    if (credentialQuery && credentialQuery.length >= 1) {
      throw new Error("Username already taken");
    }

    const userQuery = await Users.findById(req.params.user).then(
      (user) => user
    );

    if (!userQuery) {
      throw new Error("Must give valid user id");
    }

    const pwd = await bcrypt.hash(bodyParams.password, 10);

    bodyParams.password = pwd;
    bodyParams.ref_users = req.params.user;

    const credential = new Credentials(bodyParams);

    const savedCredential = await credential.save();

    return res.status(200).json({
      message: "User added succesfully",
      user: savedCredential,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Couldnt create user",
    });
  }
};

const postCredentialsLogin = async (req, res) => {
  try {
    const bodyParams = req.body;

    if (!bodyParams.username || !bodyParams.password) {
      throw new Error("Must type username and password");
    }

    const credentialQuery = await Credentials.findOne({
      username: bodyParams.username.toLowerCase(),
    }).then((user) => user);

    if (!credentialQuery) {
      throw new Error("Incorret username or password");
    }

    const pwd = bcrypt.compareSync(bodyParams.password, credentialQuery.password);

    if (!pwd) {
      throw new Error("Must give valid password");
    }

    const token = jwt.createToken(credentialQuery);

    return res.status(200).json({
      message: "Success",
      user: {
        
        _id: credentialQuery._id,
        username: credentialQuery.username,
        ref_users: credentialQuery.ref_users
      },
      token,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error while auth user",
    });
  }
};

module.exports = {
  testCredentials,
  postCredentials,
  postCredentialsLogin,
};

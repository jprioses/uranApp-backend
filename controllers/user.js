const bcrypt = require("bcrypt");
const User = require("../Models/User");
const UserData = require("../Models/UserData");
const jwt = require("../services/jwt");

//test controller
const userTest = (req, res) => {
  console.log(req.user)
  return res.status(200).send({
    mensaje: "Sent from ./controllers/user,js",
    usuario: req.user,
  });
};

//Create user
const createUser = async (req, res) => {
  try {
    let bodyParams = req.body;

    if (!bodyParams.username || !bodyParams.password) {
      throw new Error("Must type username and password");
    }

    const userQuery = await User.find({
      username: bodyParams.username.toLowerCase(),
    }).then((user) => user);

    if (userQuery && userQuery.length >= 1) {
      throw new Error("Username already taken");
    }

    const userDataQuery = await UserData.findById(req.params.userData).then(
      (user) => user
    );

    if (!userDataQuery) {
      throw new Error("Must give valid user id");
    }

    const pwd = await bcrypt.hash(bodyParams.password, 10);

    bodyParams.password = pwd;
    bodyParams.ref_user_data = req.params.userData;

    const user = new User(bodyParams);

    const savedUser = await user.save();

    return res.status(200).json({
      message: "User added succesfully",
      user: savedUser,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Couldnt create user",
    });
  }
};

const login = async (req, res) => {
  try {
    const bodyParams = req.body;

    if (!bodyParams.username || !bodyParams.password) {
      throw new Error("Must type username and password");
    }

    const userQuery = await User.findOne({
      username: bodyParams.username.toLowerCase(),
    }).then((user) => user);

    if (!userQuery) {
      throw new Error("Incorret username or password");
    }

    const pwd = bcrypt.compareSync(bodyParams.password, userQuery.password);

    if (!pwd) {
      throw new Error("Must give valid password");
    }

    const token = jwt.createToken(userQuery);

    return res.status(200).json({
      message: "Success",
      user: {
        _id: userQuery._id,
        username: userQuery.username,
        ref_user_data: userQuery.ref_user_data,
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
  userTest,
  createUser,
  login,
};

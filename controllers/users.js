const validator = require("validator");
const Users = require("../Models/Users");

const testUsers = (req, res) => {
  return res.status(200).send({
    mensaje: "Sent from ./controllers/userData,js",
  });
};

const postUsers = async (req, res) => {
  try {
    const bodyParams = req.body;

    let checkData =
      !validator.isEmpty(bodyParams.name) &&
      !validator.isEmpty(bodyParams.surname) &&
      !validator.isEmpty(bodyParams.national_id) &&
      !validator.isEmpty(bodyParams.address) &&
      (validator.equals(req.params.role, "godfather") ||
        (validator.equals(req.params.role, "leader") &&
          !validator.isEmpty(req.params.ref_godfather)) ||
        (validator.equals(req.params.role, "voter") &&
          !validator.isEmpty(req.params.ref_godfather) &&
          !validator.isEmpty(req.params.ref_leader)));

    if (!checkData) throw new Error("Missing some data");

    bodyParams.role = req.params.role;
    if (req.params.ref_godfather) bodyParams.ref_godfather = req.params.ref_godfather;
    if (req.params.ref_leader) bodyParams.ref_leader = req.params.ref_leader;

    const user = new Users(bodyParams);

    const savedUser = await user.save();

    return res.status(200).json({
      status: "Ok",
      user: savedUser,
      message: "User created succesfully",
    });
  } catch (error) {
    return res.status(404).json({
      status: "Not found",
      mensaje: "Couldnt create user",
    });
  }
};

//An idea to make this with only one reference into the collection is to look for all the leaders who reference a godfather and then look for voters with some of the leader references that has been already found
const getUsersDashboard = async (req, res) => {
  try {
    const userId = req.user.ref_users;
    //const userId = '64e5035238cc08fccbc19a5b';

    const userQuery = await Users.findById(userId).then((user) => user);
    let usersQuery;
    if (userQuery.role == "administrator") {
      usersQuery = await Users.find({ role: "godfather" }).then(
        (user) => user
      );
    } else if (userQuery.role == "godfather") {
      usersQuery = await Users.find({
        role: "leader",
        ref_godfather: userId,
      }).then((user) => user);
    } else if (userQuery.role == "leader") {
      usersQuery = await Users.find({
        role: "voter",
        ref_leader: userId,
      }).then((user) => user);
    }

    if (!usersQuery) {
      throw new Error("Incorret username or password");
    }
    return res.status(200).json({
      status: "Success",
      message: "Data gotten sucesfully",
      users: usersQuery,
    });
  } catch (error) {
    return res.status(400).json({
      status: "Bad request",
      mensaje: "Couldnt get users data",
      error: error.message,
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const role = req.params.role;
    const ref = req.params.ref;

    let usersQuery;
    if (role == "godfather") {
      usersQuery = await Users.find({
        _id: ref,
        role,
      }).then((user) => user);
    } else if (role == "leader") {
      usersQuery = await Users.find({
        $or: [
          {
            _id: ref,
            role,
          },
          {
            ref_godfather: ref,
            role,
          },
        ],
      }).then((user) => user);
    } else if (role == "voter") {
      usersQuery = await Users.find({
        $or: [
          {
            ref_godfather: ref,
            role,
          },
          {
            ref_leader: ref,
            role,
          },
        ],
      }).then((user) => user);
    }

    if (!usersQuery) {
      throw new Error("Incorret username or password");
    }
    return res.status(200).json({
      status: "success",
      message: "Data get susccefully",
      users: usersQuery,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      mensaje: "Couldnt store data",
      error: error.message,
    });
  }
};

const putUsers = async (req, res) => {
  try {
    const bodyParams = req.body;
    const id = req.params.id;

    const userQuery = await Users.findOneAndUpdate(
      { _id: id },
      { $set: bodyParams },
      { new: true }
    );

    return res.status(200).json({
      status: "success",
      user: userQuery,
      message: "User updated succesfully",
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      mensaje: "Couldnt store data",
      error: error.message,
    });
  }
};

const deleteUsers = async(req, res) => {
  try {
    const id = req.params.id;
    const userQuery = await Users.findOneAndDelete({ _id: id });

    return res.status(200).json({
      status: "success",
      user: userQuery,
      message: "User updated succesfully",
    });
  } catch (error) {
      return res.status(400).json({
        status: "error",
        mensaje: "Couldnt store data",
        error: error.message,
      });
  }
}

module.exports = {
  testUsers,
  postUsers,
  getUsersDashboard,
  getUsers,
  putUsers,
  deleteUsers
};

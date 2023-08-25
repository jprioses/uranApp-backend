const validator = require("validator");
const UserData = require("../Models/UserData");

const userDataTest = (req, res) => {
  return res.status(200).send({
    mensaje: "Sent from ./controllers/userData,js",
  });
};

const createUserData = async (req, res) => {
  try {
    const bodyParams = req.body;

    let checkData =
      !validator.isEmpty(bodyParams.name) &&
      !validator.isEmpty(bodyParams.surname) &&
      !validator.isEmpty(bodyParams.national_id) &&
      !validator.isEmpty(bodyParams.address) &&
      (validator.equals(req.params.role, "godfather") ||
        (validator.equals(req.params.role, "leader") &&
          !validator.isEmpty(req.params.godfather)) ||
        (validator.equals(req.params.role, "voter") &&
          !validator.isEmpty(req.params.godfather) &&
          !validator.isEmpty(req.params.leader)));

    if (!checkData) throw new Error("Missing some data");

    bodyParams.role = req.params.role;
    if (req.params.godfather) bodyParams.ref_godfather = req.params.godfather;
    if (req.params.leader) bodyParams.ref_leader = req.params.leader;

    const userData = new UserData(bodyParams);

    const savedUserData = await userData.save();

    return res.status(200).json({
      status: "success",
      user: savedUserData,
      message: "User added succesfully",
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      mensaje: "Couldnt store data",
      error: error.message,
    });
  }
};

//An idea to make this with only one reference into the collection is to look for all the leaders who reference a godfather and then look for voters with some of the leader references that has been already found
const redUserDashboard = async (req, res) => {
  try {
    const userId = req.user.ref_user_data;
    //const userId = '64e5035238cc08fccbc19a5b';

    const userDataQuery = await UserData.findById(userId).then((user) => user);
    let usersDataQuery;
    if (userDataQuery.role == "administrator") {
      usersDataQuery = await UserData.find({ role: "godfather" }).then(
        (user) => user
      );
    } else if (userDataQuery.role == "godfather") {
      usersDataQuery = await UserData.find({
        role: "leader",
        ref_godfather: userId,
      }).then((user) => user);
    } else if (userDataQuery.role == "leader") {
      usersDataQuery = await UserData.find({
        role: "voter",
        ref_leader: userId,
      }).then((user) => user);
    }

    if (!usersDataQuery) {
      throw new Error("Incorret username or password");
    }
    return res.status(200).json({
      status: "success",
      message: "Data get susccefully",
      usersDataQuery,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      mensaje: "Couldnt store data",
      error: error.message,
    });
  }
};

const readUsersData = async (req, res) => {
  try {
    const role = req.params.role;
    const idRef = req.params.idRef;

    let usersDataQuery;
    if (role == "godfather") {
      usersDataQuery = await UserData.find({
        _id: idRef,
        role,
      }).then((user) => user);
    } else if (role == "leader") {
      usersDataQuery = await UserData.find({
        $or: [
          {
            _id: idRef,
            role,
          },
          {
            ref_godfather: idRef,
            role,
          },
        ],
      }).then((user) => user);
    } else if (role == "voter") {
      usersDataQuery = await UserData.find({
        $or: [
          {
            ref_godfather: idRef,
            role,
          },
          {
            ref_leader: idRef,
            role,
          },
        ],
      }).then((user) => user);
    }

    if (!usersDataQuery) {
      throw new Error("Incorret username or password");
    }
    return res.status(200).json({
      status: "success",
      message: "Data get susccefully",
      usersDataQuery,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      mensaje: "Couldnt store data",
      error: error.message,
    });
  }
};

const updateUserData = async(req, res) => {
  try {
    const bodyParams = req.body;

    let checkData =
      !validator.isEmpty(bodyParams.name) &&
      !validator.isEmpty(bodyParams.surname) &&
      !validator.isEmpty(bodyParams.national_id) &&
      !validator.isEmpty(bodyParams.address) &&
      (validator.equals(req.params.role, "godfather") ||
        (validator.equals(req.params.role, "leader") &&
          !validator.isEmpty(req.params.godfather)) ||
        (validator.equals(req.params.role, "voter") &&
          !validator.isEmpty(req.params.godfather) &&
          !validator.isEmpty(req.params.leader)));

    if (!checkData) throw new Error("Missing some data");

    bodyParams.role = req.params.role;
    if (req.params.godfather) bodyParams.ref_godfather = req.params.godfather;
    if (req.params.leader) bodyParams.ref_leader = req.params.leader;

    const query = await Article.findOneAndUpdate({_id:id}, req.body, {new: true}); 

    const userData = new UserData(bodyParams);

    const savedUserData = await userData.save();

    return res.status(200).json({
      status: "success",
      user: savedUserData,
      message: "User added succesfully",
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
  userDataTest,
  createUserData,
  redUserDashboard,
  readUsersData,
  updateUserData
};

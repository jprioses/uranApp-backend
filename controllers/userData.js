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

module.exports = {
  userDataTest,
  createUserData,
};

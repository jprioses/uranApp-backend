const bcrypt = require("bcrypt");
const User = require("../Models/User");
const jwt = require('../services/jwt')

//test controller
const userTest = (req, res) => {
  return res.status(200).send({
    mensaje: "Sent from ./controllers/user,js",
  });
};

//Add user
const addUSer = (req, res) => {
  
    let params = req.body;

    if (!params.username || !params.password) {
      return res.status(500).json({
        status:"error", 
        message: "Must type username and password"})
    }

    User.find({ username: params.username.toLowerCase() })
    .then(async(user) => {

      if (user && user.length >= 1) {
        return res.status(200).json({
          status: "Succes",
          mesage: "Must type different username",
        });
      }

      const pwd = await bcrypt.hash(params.password, 10);

      params.password = pwd;

      let userData = new User(params);

      userData.save();

      return res.status(200).json({
        message: "User added succesfully",
        userData,
      });

    }).catch(error => {
      return res.status(500).json({
        status:"error", 
        message: "Error while saving user"})
    });
};

const login = (req, res) => {
 
    const params = req.body;

    if (!params.username || !params.password) {
      return res.status(500).json({
        status:"error", 
        message: "Must type username and password"})
    }

    User.findOne({username: params.username.toLowerCase()})
    .then(user => {

        const pwd = bcrypt.compareSync(params.password, user.password);

        if (!pwd) {
          return res.status(400).json({
            message: "Password incorrect",
            status: "Error",
          });
        }

        const token = jwt.createToken(user);

        return res.status(200).json({
          message: "Success",
          user: {
            _id: user._id,
            username: user.username
          },
          token
        });

    }).catch(error => {
      console.log(error)
      return res.status(500).json({
        status:"error", 
        message: "Error while auth user"})
    });


};

module.exports = {
  userTest,
  addUSer,
  login,
};

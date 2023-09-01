const Users = require("../Models/Users");
const UsersServices = require("../services/users");
const ValidateServices = require("../services/validate");
const catchedAsync = require("../utils/catchedAsync");
const { response } = require("../utils/response");
const ClientError = require("../utils/errors");

const testUsers = (req, res) => {
  return res.status(200).send({
    mensaje: "Sent from ./controllers/userData,js",
  });
};

const postUser = async (req, res) => {
  const bodyParams = req.body;
  bodyParams.role = req.params.role;
  bodyParams.ref_godfather = req.params.ref_godfather;
  bodyParams.ref_leader = req.params.ref_leader;

  console.log(bodyParams);
  let checkData = ValidateServices.validateNewUserData(bodyParams);

  if (!checkData) throw new ClientError("Missing some data");

  const user = await UsersServices.createUser(bodyParams);

  response(res, 200, user);
};

//An idea to make this with only one reference into the collection is to look for all the leaders who reference a godfather and then look for voters with some of the leader references that has been already found
const getUsersDashboard = async (req, res) => {
  const userId = req.user.ref_users;
  //const userId = '64e5035238cc08fccbc19a5b';

  const user = await UsersServices.findUserById(userId);

  if (!user) throw new ClientError("Dindt find any valid user");

  let users;
  if (user.role == "administrator") {
    users = await UsersServices.findUsers({ role: "godfather" });
  } else if (user.role == "godfather") {
    users = await UsersServices.findUsers({
      role: "leader",
      ref_godfather: userId,
    });
  } else if (user.role == "leader") {
    users = await UsersServices.findUsers({
      role: "voter",
      ref_leader: userId,
    });
  }

  if (!users) throw new ClientError("Error while searching users");

  response(res, 200, users);
};

const getUsers = async (req, res) => {
  const role = req.params.role;
  const ref = req.params.ref;
  let users;
  if (role == "godfather") {
    users = await UsersServices.findUsers({
      _id: ref,
      role,
    });
  } else if (role == "leader") {
    users = await UsersServices.findUsers({
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
    });
  } else if (role == "voter") {
    users = await UsersServices.findUsers({
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
    });
  }

  if (!users) throw new ClientError("Error while searching users");

  response(res, 200, users);
};

const putUser = async (req, res) => {
  const bodyParams = req.body;
  const id = req.params.id;

  const user = await UsersServices.updateUser(id, bodyParams, true);

  if (!user) throw new ClientError("Error while updating user");

  response(res, 200, user);
};

const deleteUser = async (req, res) => {
  const id = req.params.id;

  const user = await UsersServices.deleteUser(id);

  if (!user) throw new ClientError("Error while deleting user");

  response(res, 200, user);
};

const getGodfathers = async (req, res) => {

  const godfathers = await UsersServices.findUsers({
    role: "godfather",
  }).select({ _id, name, surename });

  if (!godfathers) throw new ClientError("Error while searching user");

  response(res, 200, godfathers);
};

const getLeaders = async (req, res) => {
  const ref_godfather = req.params.ref_godfather;

  const leaders = await UsersServices.findUsers({
    role: "leader",
    ref_godfather: ref_godfather
  }).select({ _id, name, surename });

  if (!leaders) throw new ClientError("Error while searching user");

  response(res, 200, leaders);

}

const updateParents = async (res, req) => {
    const id = req.params.id
    const role = req.body.role
    const ref_godfather = req.body.ref_godfather
    const ref_leader = req.body.ref_leader

    let users
    let user
    if (role == 'leader'){ 
      users = await UsersServices.updateUsers({ref_leader: id}, {ref_leader, ref_godfather});
      user = await UsersServices.updateUser(id, {ref_godfather}, true );
    } else {
      user = await UsersServices.updateUser(id, {ref_godfather, ref_leader}, true );
    }

    if (!user) throw new ClientError("Error while updating user");

    response(res, 200, user);
}

module.exports = {
  testUsers,
  postUser: catchedAsync(postUser),
  getUsersDashboard: catchedAsync(getUsersDashboard),
  getUsers: catchedAsync(getUsers),
  putUser: catchedAsync(putUser),
  deleteUser: catchedAsync(deleteUser),
  getGodfathers: catchedAsync(getGodfathers),
  getLeaders: catchedAsync(getLeaders),
  updateParents: catchedAsync(updateParents)
};

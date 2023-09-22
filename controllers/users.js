const UsersServices = require("../services/users");
const ValidateServices = require("../services/validate");
const NotificationsServices = require("../services/notifications");
const CredentialsServices = require("../services/credentials");
const catchedAsync = require("../utils/catchedAsync");
const { response } = require("../utils/response");
const ClientError = require("../utils/errors");

const fs = require("fs");
const path = require("path");

const testUsers = (req, res) => {
  return res.status(200).send({
    mensaje: "Sent from ./controllers/userData,js",
  });
};

const createUsers = async (req, res) => {
  const params = req.body;
  params.role = req.params.role;
  params.ref_parent = req.params.parent;

  let checkData = ValidateServices.validateNewUserData(params);

  if (!checkData) throw new ClientError("Missing some data");

  if (params.ref_parent) {
    const user = await UsersServices.findUsersById(params.ref_parent);
    if (!user) throw new ClientError("Must give a valid parent id");
  }

  const user = await UsersServices.createUsers(params);

  await NotificationsServices.createNotifications(
    req.user.ref_users,
    user._id,
    "user created"
  );

  response(res, 200, user);
};

//An idea to make this with only one reference into the collection is to look for all the leaders who reference a godfather and then look for voters with some of the leader references that has been already found
const getUsersDashboard = async (req, res) => {
  const id = req.user.ref_users;
  //const userId = '64e5035238cc08fccbc19a5b';

  const user = await UsersServices.findUsersById(id);

  if (!user) throw new ClientError("Didn't find any valid user");

  let users;
  if (user.role == "administrator") {
    users = await UsersServices.findUsers({ role: "godfather" });
  } else if (user.role == "godfather") {
    users = await UsersServices.findUsers({
      role: "leader",
      ref_parent: id,
    });
  } else if (user.role == "leader") {
    users = await UsersServices.findUsers({
      role: "voter",
      ref_parent: id,
    });
  }

  if (!users) throw new ClientError("Error while searching users");

  response(res, 200, { user: user, users: users });
};

const getUsers = async (req, res) => {
  const role = req.params.role;
  const parent = req.params.parent;
  let users;
  if (role == "godfather") {
    users = await UsersServices.findUsers({
      _id: parent,
      role,
    });
  } else if (role == "leader") {
    users = await UsersServices.findUsers({
      $or: [
        {
          _id: parent,
          role,
        },
        {
          ref_parent: parent,
          role,
        },
      ],
    });
  } else if (role == "voter") {
    //If parent is godfather to get all voters
    //get array of all leaders from that godfather
    const leaders = await UsersServices.findUsers({
      ref_parent: parent,
      role: "leader",
    });

    let leadersArray = [];
    if (leaders) {
      leadersArray = leaders.map((leader) => leader._id && leader._id);
    }

    //find all voters who have one of those leaders
    users = await UsersServices.findUsers({
      $or: [
        {
          ref_parent: parent,
          role,
        },
        {
          ref_parent: { $in: leadersArray },
          role,
        },
      ],
    });
  }

  if (!users) throw new ClientError("Error while searching users");

  response(res, 200, users);
};

const getAllChildren = async (req, res) => {
  const role = req.params.role;

  const users = await UsersServices.findUsers({
    role,
  });

  if (!users) throw new ClientError("Error while searching users");

  response(res, 200, users);
};

const updateUsers = async (req, res) => {
  const params = req.body;
  const id = req.params.id;

  if (Object.keys(params).length == 0)
    throw new ClientError("Must enter data to update");

  const user = await UsersServices.updateUsers(id, params);

  if (!user) throw new ClientError("User not found");

  await NotificationsServices.createNotifications(
    req.user.ref_users,
    id,
    "user updated",
    user
  );

  response(res, 200, user);
};

const deleteUsers = async (req, res) => {
  const id = req.params.id;

  const user = await UsersServices.deleteUsers(id);

  if (!user) throw new ClientError("User not found");

  if (user.photo && user.photo != "default.png") {
    const file = user.photo;
    const filePath = "./uploads/avatars/" + file;

    fs.stat(filePath, (error, exist) => {
      if (exist) fs.unlinkSync(filePath);
    });
  }

  //Find and delete credentials
  const credentials = await CredentialsServices.deleteCredentials({
    ref_users: id,
  });

  if (credentials) {
    await NotificationsServices.createNotifications(
      req.user.ref_users,
      id,
      "credentials deleted",
      credentials
    );
  }

  if (user.role == "godfather") {
    //Find and update children
    const children = await UsersServices.findUsers({ ref_parent: user._id });
    if (children.length > 0) {
      const childrenArray = children.map((child) => child._id);
      await UsersServices.updateUsersByArray(childrenArray, {
        ref_parent: "6504a3c94b41a52e4910c608",
      });
    }
  } else if (user.role == "leader") {
    const children = await UsersServices.findUsers({ ref_parent: user._id });
    if (children.length > 0) {
      const childrenArray = children.map((child) => child._id);
      await UsersServices.updateUsersByArray(childrenArray, {
        ref_parent: "6504a3fd4b41a52e4910c609",
      });
    }
  }

  await NotificationsServices.createNotifications(
    req.user.ref_users,
    id,
    "user deleted",
    user
  );

  response(res, 200, user);
};

const getGodfathers = async (req, res) => {
  const godfathers = await UsersServices.findUsers({
    role: "godfather",
  });

  if (!godfathers) throw new ClientError("Error while searching godfathers");

  const godfathersArray = godfathers.map((godfather) => {
    return {
      _id: godfather._id,
      name: godfather.name,
      surname: godfather.surname,
    };
  });

  response(res, 200, godfathersArray);
};

const getLeaders = async (req, res) => {
  const parent = req.params.parent;

  const leaders = await UsersServices.findUsers({
    role: "leader",
    ref_parent: parent,
  });

  if (!leaders) throw new ClientError("Error while searching leaders");

  const leadersArray = leaders.map((leader) => {
    return {
      _id: leader._id,
      name: leader.name,
      surname: leader.surname,
    };
  });

  response(res, 200, leadersArray);
};

const updateParent = async (req, res) => {
  const id = req.params.id;

  if (!req.body.ref_parent) throw new ClientError("Must provide a parent");

  const { ref_parent } = req.body;

  const user = await UsersServices.updateUsers(id, { ref_parent });

  if (!user) throw new ClientError("Error while updating user");

  const notifications = await NotificationsServices.createNotifications(
    req.user.ref_users,
    id,
    "user updated",
    user
  );

  response(res, 200, user);
};

//Upload and get images

const uploadAvatar = async (req, res) => {
  if (!req.file) throw new ClientError("Must give a file");

  const image = req.file.originalname;

  const imgSplit = image.split(".");
  const ext = imgSplit[1];

  if (ext != "png" && ext != "jpg" && ext != "jpeg" && ext != "gif") {
    const filePath = req.file.path;
    //Si la extensión no cumple puedo usar el unlink, de la libreria fs para eliminarlo,
    //unlinkSycn es sincrono, no hay que esperar el callback
    fs.unlinkSync(filePath);

    throw new ClientError("Must give a valid image format");
  }
  const user = await UsersServices.updateUsers(
    req.params.id,
    { photo: req.file.filename },
    false,
    true
  );

  if (!user || Object.keys(user).length == 0) {
    const filePath = req.file.path;
    //Si la extensión no cumple puedo usar el unlink, de la libreria fs para eliminarlo,
    //unlinkSycn es sincrono, no hay que esperar el callback
    fs.unlinkSync(filePath);

    throw new ClientError("User not found");
  }
  response(res, 200, user);
};

const getAvatar = async (req, res) => {
  const file = req.params.file;
  const filePath = "./uploads/avatars/" + file;

  //Comprobar si existe
  fs.stat(filePath, (error, exist) => {
    if (!exist) new ClientError("Image not found");
    return res.sendFile(path.resolve(filePath));

    //Sendfile es un metodo que devuelve un archivo, debo poner rutas absolutas con la libreria path y el metodo resolve
  });
};

module.exports = {
  testUsers,
  createUsers: catchedAsync(createUsers),
  getUsersDashboard: catchedAsync(getUsersDashboard),
  getUsers: catchedAsync(getUsers),
  getAllChildren: catchedAsync(getAllChildren),
  updateUsers: catchedAsync(updateUsers),
  deleteUsers: catchedAsync(deleteUsers),
  getGodfathers: catchedAsync(getGodfathers),
  getLeaders: catchedAsync(getLeaders),
  updateParent: catchedAsync(updateParent),
  uploadAvatar: catchedAsync(uploadAvatar),
  getAvatar: catchedAsync(getAvatar),
};

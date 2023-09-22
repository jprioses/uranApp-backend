const CommentsServices = require("../services/comments");
const UsersServices = require("../services/users");
const catchedAsync = require("../utils/catchedAsync");
const { response } = require("../utils/response");
const ClientError = require("../utils/errors");

const getComments = async (req, res) => {
  const userId = req.params.user;

  const user = await UsersServices.findUsersById(userId);

  if (!user || Object.keys(user).length == 0)
    throw new ClientError("User not found");

  const comments = await CommentsServices.getComments(userId);

  if (!comments) throw new ClientError("Couldnt get comments");

  response(res, 200, comments);
};

const addComments = async (req, res) => {
  const userId = req.params.user;

  if (!req.body.content) throw new ClientError("Must provide a comment");

  const user = await UsersServices.findUsersById(userId);

  if (!user || Object.keys(user).length == 0)
    throw new ClientError("User not found");

  const content = req.body.content;

  const comments = await CommentsServices.addComments(userId, content);

  if (!comments) throw new ClientError("Couldn't add comments");

  response(res, 200, comments);
};

const updateComments = async (req, res) => {
  const id = req.params.id;
  const content = req.body.content;

  if (!req.body.content) throw new ClientError("Must provide a comment");

  const comments = await CommentsServices.updateComments(id, content);

  if (!comments) throw new ClientError("Comment not found");

  response(res, 200, comments);
};

const deleteComments = async (req, res) => {
  const id = req.params.id;

  const comments = await CommentsServices.deleteComments(id);

  if (!comments) throw new ClientError("Couldnt delete comments");

  response(res, 200, comments);
};

module.exports = {
  getComments: catchedAsync(getComments),
  addComments: catchedAsync(addComments),
  updateComments: catchedAsync(updateComments),
  deleteComments: catchedAsync(deleteComments),
};

const Comments = require("../Models/Comments");

const getComments = (user) => {
  return Comments.find({ref_users: user})
}

const addComments = (user, content) => {
    return new Comments({content, ref_users: user}).save();
}

const updateComments = (id, content) => {
    return Comments.findByIdAndUpdate(id, {content}, {new: true});
}

const deleteComments = (id) => {
    return Comments.findByIdAndDelete(id);
}

module.exports = {
    getComments,
    addComments,
    updateComments,
    deleteComments
}
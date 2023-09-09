const Historics = require("../Models/Historics");

const feedHistoric = (ref, data, deleted) => {
  return new Historics(
    { ref_users: ref },
    { $push: { recovery: { data, deleted } } },
    { upsert: true }
  ).save();
};



module.exports = {
  feedHistoric,
};

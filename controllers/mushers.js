const { fetchAllMushers } = require("../models/mushers");

exports.getAllMushers = (req, res, next) => {
  fetchAllMushers()
    .then((mushers) => {
      res.status(200).send({ mushers });
    })
    .catch(next);
};

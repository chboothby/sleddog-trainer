const { fetchAllKennels, createNewKennel } = require("../models/kennels");
exports.getAllKennels = (req, res, next) => {
  fetchAllKennels()
    .then((kennels) => {
      res.status(200).send({ kennels });
    })
    .catch(next);
};

exports.postNewKennel = (req, res, next) => {
  const { body } = req;
  createNewKennel(body)
    .then((kennel) => {
      res.status(201).send({ kennel });
    })
    .catch(next);
};

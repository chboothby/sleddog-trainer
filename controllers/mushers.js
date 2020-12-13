const {
  fetchAllMushers,
  removeMusherById,
  fetchMusherById,
  createNewMusher,
  patchMusherById,
} = require("../models/mushers");

exports.getAllMushers = (req, res, next) => {
  const { sort_by, order } = req.params;
  fetchAllMushers(sort_by, order)
    .then((mushers) => {
      res.status(200).send({ mushers });
    })
    .catch(next);
};

exports.deleteMusherById = (req, res, next) => {
  const { musher_id } = req.params;
  removeMusherById(musher_id)
    .then((rows) => {
      if (rows === 0)
        return Promise.reject({ status: 404, msg: "Dog musher not found" });
      else res.sendStatus(204);
    })
    .catch(next);
};

exports.getMusherById = (req, res, next) => {
  const { musher_id } = req.params;
  fetchMusherById(musher_id)
    .then((mushers) => {
      if (mushers.length === 0) {
        return Promise.reject({ status: 404, msg: "Dog musher not found" });
      } else {
        const [musher] = mushers;
        res.status(200).send({ musher });
      }
    })
    .catch(next);
};

exports.addNewMusher = (req, res, next) => {
  const { body } = req;
  createNewMusher(body)
    .then((musher) => {
      res.status(201).send({ musher });
    })
    .catch((err) => {
      if (!err.code) {
        return Promise.reject({
          status: 400,
          msg: "Request missing kennel name",
        });
      } else next(err);
    })
    .catch(next);
};

exports.updateMusherById = (req, res, next) => {
  const { body } = req;
  const { musher_id } = req.params;
  patchMusherById(musher_id, body)
    .then((musher) => {
      res.status(201).send({ musher });
    })
    .catch(next);
};

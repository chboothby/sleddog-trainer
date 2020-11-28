const {
  fetchAllMushers,
  removeMusherById,
  fetchMusherById,
} = require("../models/mushers");

exports.getAllMushers = (req, res, next) => {
  fetchAllMushers()
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

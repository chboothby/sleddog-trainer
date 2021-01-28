const {
  postRun,
  fetchRuns,
  deleteRunById,
  patchRunById,
  fetchRunsByDog,
} = require('../models/runs');

exports.addRun = (req, res, next) => {
  const { dogs, km_ran, mushers, route, date } = req.body;
  const { kennel_id } = req.params;
  const newRun = {
    dogs,
    mushers,
    route,
    distance: km_ran,
    kennel_id,
    date,
  };
  postRun(dogs, km_ran, newRun)
    .then((newRun) => {
      res.status(201).send({ newRun });
    })
    .catch(next);
};

exports.getRuns = (req, res, next) => {
  const { kennel_id } = req.params;

  fetchRuns(kennel_id, req.query)
    .then((runs) => {
      res.status(200).send({ runs });
    })
    .catch(next);
};

exports.getRunsByDog = (req, res, next) => {
  const { dog_id } = req.params;
  fetchRunsByDog(dog_id, req.query)
    .then((runs) => {
      res.status(200).send({ runs });
    })
    .catch(next);
};

exports.removeRunById = (req, res, next) => {
  const { run_id } = req.params;
  deleteRunById(run_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

exports.updateRunById = (req, res, next) => {
  const updates = req.body;
  const { run_id } = req.params;
  patchRunById(run_id, updates)
    .then((run) => {
      res.status(201).send({ run });
    })
    .catch(next);
};

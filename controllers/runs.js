const { postRun, fetchRuns } = require("../models/runs");

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
  fetchRuns(kennel_id)
    .then((runs) => {
      res.status(200).send({ runs });
    })
    .catch(next);
};

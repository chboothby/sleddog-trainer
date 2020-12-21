const { fetchDogsByKennelId, postDogToKennel } = require("../models/dogs");

exports.getDogsByKennelId = (req, res, next) => {
  const {
    name,
    needs_booties,
    gender,
    team_position,
    sort_by,
    order,
  } = req.query;
  const { kennel_id } = req.params;
  fetchDogsByKennelId(
    kennel_id,
    name,
    needs_booties,
    gender,
    team_position,
    sort_by,
    order
  )
    .then((dogs) => {
      res.status(200).send({ dogs });
    })
    .catch(next);
};

exports.addDogToKennel = (req, res, next) => {
  const { kennel_id } = req.params;
  const newDog = req.body;
  newDog.kennel_id = kennel_id;
  postDogToKennel(newDog)
    .then((dog) => {
      res.status(201).send({ dog });
    })
    .catch(next);
};

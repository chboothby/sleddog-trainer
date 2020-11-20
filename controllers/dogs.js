const { fetchDogsByKennelId } = require("../models/dogs");

exports.getDogsByKennelId = (req, res, next) => {
  const { kennel_id } = req.params;
  fetchDogsByKennelId(kennel_id).then((dogs) => {
    res.status(200).send({ dogs });
  });
};

const kennelRouter = require("express").Router();
const { getAllKennels, postNewKennel } = require("../controllers/kennels");
const {
  getDogsByKennelId,
  addDogToKennel,
  addRun,
} = require("../controllers/dogs");

kennelRouter.route("/").get(getAllKennels).post(postNewKennel);
kennelRouter.route("/:kennel_id").post(addDogToKennel);
kennelRouter.route("/:kennel_id/run").post(addRun);
kennelRouter.route("/:kennel_id/dogs").get(getDogsByKennelId);

module.exports = kennelRouter;

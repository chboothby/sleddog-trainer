const kennelRouter = require("express").Router();
const { getAllKennels, postNewKennel } = require("../controllers/kennels");
const { getDogsByKennelId, addDogToKennel } = require("../controllers/dogs");
const { getRuns, addRun } = require("../controllers/runs");

kennelRouter.route("/").get(getAllKennels).post(postNewKennel);
kennelRouter.route("/:kennel_id").post(addDogToKennel);
kennelRouter.route("/:kennel_id/runs").post(addRun).get(getRuns);
kennelRouter.route("/:kennel_id/dogs").get(getDogsByKennelId);

module.exports = kennelRouter;

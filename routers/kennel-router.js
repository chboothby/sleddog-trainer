const kennelRouter = require("express").Router();
const { getAllKennels, postNewKennel } = require("../controllers/kennels");
const { getDogsByKennelId } = require("../controllers/dogs");

kennelRouter.route("/").get(getAllKennels).post(postNewKennel);
kennelRouter.route("/:kennel_id/dogs").get(getDogsByKennelId);

module.exports = kennelRouter;

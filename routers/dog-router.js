const dogRouter = require("express").Router();
const { getDogById } = require("../controllers/dogs");

dogRouter.route("/:dog_id").get(getDogById);
module.exports = dogRouter;

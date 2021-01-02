const dogRouter = require("express").Router();
const { getDogById, updateDog } = require("../controllers/dogs");
const { send405 } = require("../controllers/errors");

dogRouter.route("/:dog_id").get(getDogById).patch(updateDog).all(send405);
module.exports = dogRouter;

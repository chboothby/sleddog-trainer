const dogRouter = require("express").Router();
const { getDogById, updateDog } = require("../controllers/dogs");
dogRouter.route("/:dog_id").get(getDogById); //.patch(updateDog);
module.exports = dogRouter;

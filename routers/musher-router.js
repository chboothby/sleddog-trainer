const { getAllMushers } = require("../controllers/mushers");

const musherRouter = require("express").Router();

musherRouter.route("/").get(getAllMushers);

module.exports = musherRouter;

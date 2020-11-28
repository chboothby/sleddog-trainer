const {
  getAllMushers,
  deleteMusherById,
  getMusherById,
} = require("../controllers/mushers");

const musherRouter = require("express").Router();

musherRouter.route("/").get(getAllMushers);
musherRouter.route("/:musher_id").get(getMusherById).delete(deleteMusherById);

module.exports = musherRouter;

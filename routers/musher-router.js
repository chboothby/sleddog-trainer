const {
  getAllMushers,
  deleteMusherById,
  getMusherById,
  addNewMusher,
  updateMusherById,
} = require("../controllers/mushers");

const musherRouter = require("express").Router();

musherRouter.route("/").get(getAllMushers).post(addNewMusher);
musherRouter
  .route("/:musher_id")
  .get(getMusherById)
  .delete(deleteMusherById)
  .patch(updateMusherById);

module.exports = musherRouter;

const { removeRunById, updateRunById } = require("../controllers/runs");

const runRouter = require("express").Router();

runRouter.route("/:run_id").delete(removeRunById).patch(updateRunById);

module.exports = runRouter;
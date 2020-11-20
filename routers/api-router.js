const apiRouter = require("express").Router();
const kennelRouter = require("./kennel-router");
const musherRouter = require("./musher-router");

apiRouter.use("/kennels", kennelRouter);
apiRouter.use("/mushers", musherRouter);

module.exports = apiRouter;

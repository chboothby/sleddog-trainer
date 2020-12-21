const apiRouter = require("express").Router();
const kennelRouter = require("./kennel-router");
const musherRouter = require("./musher-router");
const dogRouter = require("./dog-router");

apiRouter.use("/kennels", kennelRouter);
apiRouter.use("/mushers", musherRouter);
apiRouter.use("/dogs", dogRouter);

module.exports = apiRouter;

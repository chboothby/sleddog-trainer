const apiRouter = require("express").Router();
const kennelRouter = require("./kennel-router");
const musherRouter = require("./musher-router");
const dogRouter = require("./dog-router");
const { send404 } = require("../controllers/errors");

apiRouter.use("/kennels", kennelRouter);
apiRouter.use("/mushers", musherRouter);
apiRouter.use("/dogs", dogRouter);
apiRouter.use("*", send404);

module.exports = apiRouter;

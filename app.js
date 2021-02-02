const express = require('express');
const app = express();
const apiRouter = require('./routers/api-router');
const cors = require('cors');

const {
  handleCustomErrors,
  handlePSQLErrors,
  handleInternalErrors,
} = require('./controllers/errors');

app.use(cors());
app.use(express.json());

app.use('/api', apiRouter);

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handleInternalErrors);

module.exports = app;

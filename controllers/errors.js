exports.handlePSQLErrors = (err, req, res, next) => {
  console.log(err);
  const codes = {
    '22P02': { status: 400, msg: 'Invalid input type' },
    42703: { status: 400, msg: 'Invalid input type' },
    23503: { status: 400, msg: 'Bad request' },
    '2201X': { status: 400, msg: 'Invalid page request' },
    23502: { status: 400, msg: 'Incomplete request' },
  };
  const code = err.code;
  if (codes[code]) {
    res.status(codes[code].status).send({ msg: codes[code].msg });
  } else next(err);
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    // console.log("custom err");
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.handleInternalErrors = (err, req, res, next) => {
  res.status(500).send({ msg: 'Internal server error' });
};

exports.send404 = (req, res, next) => {
  res.status(404).send({ msg: 'Not found' });
};

exports.send405 = (req, res, next) => {
  res.status(405).send({ msg: 'Invalid method' });
};

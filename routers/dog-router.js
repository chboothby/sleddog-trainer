const dogRouter = require('express').Router();
const { getDogById, updateDog } = require('../controllers/dogs');
const { getRunsByDog } = require('../controllers/runs');
const { send405 } = require('../controllers/errors');

dogRouter.route('/:dog_id').get(getDogById).patch(updateDog).all(send405);
dogRouter.route('/:dog_id/runs').get(getRunsByDog);
module.exports = dogRouter;

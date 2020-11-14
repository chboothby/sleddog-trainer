const { kennelData, musherData, dogData } = require("../data/index");
const {
  createKennelRef,
  addKennelId,
  formatDate,
} = require("../utils/data-manipulation");

exports.seed = (knex) => {
  return knex.migrate
    .rollback()
    .then(() => {
      return knex.migrate.latest();
    })
    .then(() => {
      return knex.insert(kennelData).into("kennels").returning("*");
    })
    .then((kennelRows) => {
      const kennelRef = createKennelRef(kennelRows);
      const formattedMushers = addKennelId(musherData, kennelRef);
      const dogsWithId = addKennelId(dogData, kennelRef);
      const formattedDogs = formatDate(dogsWithId);

      const addMushers = knex
        .insert(formattedMushers)
        .into("mushers")
        .returning("*");

      const addDogs = knex.insert(formattedDogs).into("dogs").returning("*");
      return Promise.all([addMushers, addDogs]);
    });
};

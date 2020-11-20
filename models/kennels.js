const connection = require("../db/connection");

exports.fetchAllKennels = () => {
  return connection
    .select("kennels.*")
    .from("kennels")
    .join("dogs", "dogs.kennel_id", "kennels.kennel_id")
    .groupBy("kennels.kennel_id")
    .count("dogs.kennel_id AS dogCount")
    .orderBy("kennel_id", "asc")
    .then((response) => {
      return response;
    });
};

exports.createNewKennel = (newKennel) => {
  return connection
    .insert(newKennel)
    .into("kennels")
    .returning("*")
    .then((kennel) => {
      return kennel[0];
    });
};

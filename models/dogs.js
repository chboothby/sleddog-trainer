const connection = require("../db/connection");

exports.fetchDogsByKennelId = (kennel_id) => {
  return connection.select("*").from("dogs").where("kennel_id", "=", kennel_id);
};

const connection = require("../db/connection");

exports.fetchAllMushers = () => {
  return connection
    .select(
      "musher_id",
      "mushers.name",
      "kennels.kennel_name AS kennel",
      "mushers.nationality",
      "mushers.display_pic"
    )
    .from("mushers")
    .join("kennels", "kennels.kennel_id", "mushers.kennel_id")
    .join("dogs", "dogs.kennel_id", "mushers.kennel_id")
    .count("dogs.kennel_id AS dogCount")
    .groupBy(
      "mushers.name",
      "kennels.kennel_name",
      "mushers.nationality",
      "mushers.display_pic",
      "mushers.musher_id"
    )
    .orderBy("kennel", "asc");
};

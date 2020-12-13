const connection = require("../db/connection");

exports.fetchAllMushers = (sort_by, order) => {
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
    .orderBy(sort_by || "mushers.name", order || "asc");
};

exports.removeMusherById = (musher_id) => {
  return connection
    .select("*")
    .from("mushers")
    .where("musher_id", "=", musher_id)
    .del();
};

exports.fetchMusherById = (musher_id) => {
  return connection
    .select(
      "musher_id",
      "mushers.name",
      "kennels.kennel_name AS kennel",
      "mushers.nationality",
      "mushers.display_pic"
    )
    .from("mushers")
    .where("musher_id", "=", musher_id)
    .join("kennels", "kennels.kennel_id", "mushers.kennel_id")
    .join("dogs", "dogs.kennel_id", "mushers.kennel_id")
    .count("dogs.kennel_id AS dogCount")
    .groupBy(
      "mushers.name",
      "kennels.kennel_name",
      "mushers.nationality",
      "mushers.display_pic",
      "mushers.musher_id"
    );
};

exports.createNewMusher = async ({ kennel, ...rest }) => {
  const [{ kennel_id }] = await connection
    .select("kennel_id")
    .from("kennels")
    .where("kennel_name", "LIKE", kennel);

  const newMusher = {
    ...rest,
    kennel_id,
  };
  return connection
    .insert(newMusher)
    .into("mushers")
    .returning("*")
    .then((musher) => {
      return musher[0];
    });
};

exports.patchMusherById = (musher_id, updates) => {
  return connection("mushers")
    .update(updates)
    .where("musher_id", "=", musher_id)
    .returning("*")
    .then((musher) => {
      return musher[0];
    });
};

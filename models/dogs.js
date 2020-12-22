const { request } = require("express");
const connection = require("../db/connection");

exports.fetchDogsByKennelId = (
  kennel_id,
  name,
  needs_booties,
  gender,
  team_position,
  sort_by,
  order
) => {
  return connection
    .select(
      "name",
      "dog_id",
      "birth_date",
      "gender",
      "km_ran",
      "kennels.kennel_name AS kennel",
      "display_pic",
      "needs_booties",
      "nickname",
      "team_position"
    )
    .from("dogs")
    .where("dogs.kennel_id", "=", kennel_id)
    .modify((qb) => {
      if (name) {
        qb.where("name", "~*", name);
      }
      if (needs_booties) {
        qb.where("needs_booties", "=", needs_booties);
      }
      if (gender) {
        qb.where("gender", "=", gender);
      }
      if (team_position) {
        qb.where("team_position", "~*", team_position);
      }
    })
    .join("kennels", "kennels.kennel_id", "dogs.kennel_id")
    .orderBy(sort_by || "name", order || "asc");
};

exports.postDogToKennel = (newDog) => {
  return connection("dogs")
    .insert(newDog)
    .returning("*")
    .then((dog) => {
      return dog[0];
    });
};

exports.fetchDogById = (dog_id) => {
  return connection
    .select(
      "name",
      "dog_id",
      "birth_date",
      "gender",
      "km_ran",
      "kennels.kennel_name AS kennel",
      "display_pic",
      "needs_booties",
      "nickname",
      "team_position"
    )
    .from("dogs")
    .where("dogs.dog_id", "=", dog_id)
    .join("kennels", "kennels.kennel_id", "dogs.kennel_id")
    .then((dog) => {
      return dog[0];
    });
};

// exports.patchDog = (update, dog_id) => {
//   const { km_ran } = update;
//   console.log(km_ran);
//   return km_ran ? connection("dogs").increment("km_ran", km_ran) : null;
// };

exports.postRun = async (dogs, km_ran, kennel_id) => {
  // update each dogs milage
  const dogsPromises = await dogs.map((dog) => {
    return connection("dogs")
      .increment({ km_ran })
      .where("dogs.dog_id", "=", dog)
      .returning("*");
  });
  // iterate over each updated dog and add them to new array
  const updatedDogs = [];
  return Promise.all(dogsPromises).then((response) => {
    response.forEach((dogArr, index) => {
      updatedDogs.push(dogArr[0]);
    });
    return updatedDogs;
  });
};

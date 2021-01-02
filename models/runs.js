const connection = require("../db/connection");

exports.postRun = async (dogs, km_ran, newRun) => {
  // update each dogs milage
  const runAdded = await connection("runs").insert(newRun).returning("*");
  const dogsPromises = await dogs.map((dog) => {
    return connection("dogs")
      .returning([
        "dog_id",
        "name",
        "display_pic",
        "km_ran",
        "needs_booties",
        "team_position",
      ])
      .increment({ km_ran })
      .where("dogs.dog_id", "=", dog);
  });

  // iterate over each updated dog and add them to new array
  const updatedDogs = [];
  return Promise.all([runAdded, ...dogsPromises]).then((response) => {
    const run = response[0];
    response.slice(1).forEach((dogArr) => {
      updatedDogs.push(dogArr[0]);
    });
    return { run: run[0], dogs: updatedDogs };
  });
};

exports.fetchRuns = (kennel_id) => {
  return connection.select("*").from("runs").where("kennel_id", "=", kennel_id);
};

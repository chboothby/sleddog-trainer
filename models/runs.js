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

exports.deleteRunById = (run_id) => {
  return connection("runs").delete().where("run_id", run_id).then(rows => {
    if (rows === 0) {
      return Promise.reject({status: 404, msg: "Run ID does not exist"});
    };
  });
};

exports.patchRunById = async (run_id, updates) => {
  const {dogs, distance} = updates;
  if (dogs) {
    // get previous dogs on run - decrement kms
    const [prevDogs] = await connection.select(["dogs", "distance"]).from("runs").where("run_id", run_id);
    const removeKMs = await prevDogs.dogs.map((dog) => {
      return connection("dogs")
        .increment({ km_ran: -prevDogs.distance })
        .where("dogs.dog_id", "=", dog)
    });

      const addKMs = await dogs.map((dog) => {
        if (distance) {
          return connection("dogs").increment({km_ran: distance}).where("dog_id", dog);
        } else {
          return connection("dogs").increment({km_ran: prevDogs.distance}).where("dog_id", dog);
        }
      })

  }
  return connection("runs").update(updates).where("run_id", run_id).returning("*").then(runs => {
    if (runs.length === 0) {
      return Promise.reject({status:404, msg: "Run ID does not exist"});
    }
    else return runs[0];
  });
};
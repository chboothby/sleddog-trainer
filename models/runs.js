const connection = require('../db/connection');

exports.postRun = async (dogs, km_ran, newRun) => {
  // update each dogs milage
  const runAdded = await connection('runs').insert(newRun).returning('*');
  const dogsPromises = await dogs.map((dog) => {
    return connection('dogs')
      .returning([
        'dog_id',
        'name',
        'display_pic',
        'km_ran',
        'needs_booties',
        'team_position',
      ])
      .increment({ km_ran })
      .where('dogs.dog_id', '=', dog);
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

exports.fetchRuns = async (kennel_id, { dateFrom, dateTo }) => {
  if (dateFrom) {
    const year = dateFrom.slice(4);
    const day = dateFrom[0] + dateFrom[1];
    const month = dateFrom[2] + dateFrom[3];
    dateFrom = new Date(year, parseInt(month) + 1, day);
  }
  if (dateTo) {
    const year = dateTo.slice(4);
    const day = dateTo[0] + dateTo[1];
    const month = dateTo[2] + dateTo[3];
    dateTo = new Date(year, parseInt(month) + 1, day);
  }
  const runs = await connection
    .select('*')
    .from('runs')
    .where('kennel_id', '=', kennel_id)
    .modify((queryBuilder) => {
      if (dateFrom || dateTo) {
        queryBuilder.whereBetween('date', [
          dateFrom || '01/01/2000',
          dateTo || new Date(),
        ]);
      }
    });

  const distance = await connection('runs')
    .sum({ totalDistance: 'distance' })
    .where('kennel_id', kennel_id)
    .modify((queryBuilder) => {
      if (dateFrom || dateTo) {
        queryBuilder.whereBetween('date', [
          dateFrom || '01/01/2000',
          dateTo || new Date(),
        ]);
      }
    });

  return {
    totalDistance: distance[0].totalDistance,
    runs,
  };
};

exports.fetchRunsByDog = async (dog_id, { dateTo, dateFrom }) => {
  if (dateFrom) {
    const year = dateFrom.slice(4);
    const day = dateFrom[0] + dateFrom[1];
    const month = dateFrom[2] + dateFrom[3];
    dateFrom = new Date(year, parseInt(month) + 1, day);
  }
  if (dateTo) {
    const year = dateTo.slice(4);
    const day = dateTo[0] + dateTo[1];
    const month = dateTo[2] + dateTo[3];
    dateTo = new Date(year, parseInt(month) + 1, day);
  }
  const runs = await connection
    .select('*')
    .from('runs')
    .where('dogs', '@>', `{${dog_id}}`)
    .modify((queryBuilder) => {
      if (dateFrom || dateTo) {
        queryBuilder.whereBetween('date', [
          dateFrom || '01/01/2000',
          dateTo || new Date(),
        ]);
      }
    });
  const distance = await connection('runs')
    .sum({ totalDistance: 'distance' })
    .where('dogs', '@>', `{${dog_id}}`)
    .modify((queryBuilder) => {
      if (dateFrom || dateTo) {
        queryBuilder.whereBetween('date', [
          dateFrom || '01/01/2000',
          dateTo || new Date(),
        ]);
      }
    });

  return {
    totalDistance: distance[0].totalDistance,
    runs,
  };
};

exports.deleteRunById = (run_id) => {
  return connection('runs')
    .delete()
    .where('run_id', run_id)
    .then((rows) => {
      if (rows === 0) {
        return Promise.reject({ status: 404, msg: 'Run ID does not exist' });
      }
    });
};

exports.patchRunById = async (run_id, updates) => {
  const { dogs, distance } = updates;
  if (dogs) {
    // get previous dogs on run - decrement kms
    const [prevDogs] = await connection
      .select(['dogs', 'distance'])
      .from('runs')
      .where('run_id', run_id);
    const removeKMs = await prevDogs.dogs.map((dog) => {
      return connection('dogs')
        .increment({ km_ran: -prevDogs.distance })
        .where('dogs.dog_id', '=', dog);
    });

    await dogs.forEach((dog) => {
      if (distance) {
        return connection('dogs')
          .increment({ km_ran: distance })
          .where('dog_id', dog);
      } else {
        return connection('dogs')
          .increment({ km_ran: prevDogs.distance })
          .where('dog_id', dog);
      }
    });
  }

  return connection('runs')
    .update(updates)
    .where('run_id', run_id)
    .returning('*')
    .then((runs) => {
      if (runs.length === 0) {
        return Promise.reject({ status: 404, msg: 'Run ID does not exist' });
      } else return runs[0];
    });
};

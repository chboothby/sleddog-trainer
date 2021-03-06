const connection = require('../db/connection');

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
      'name',
      'dog_id',
      'birth_date',
      'gender',
      'km_ran',
      'kennels.kennel_name AS kennel',
      'display_pic',
      'needs_booties',
      'team_position'
    )
    .from('dogs')
    .where('dogs.kennel_id', '=', kennel_id)
    .modify((qb) => {
      if (name) {
        qb.where('name', '~*', name);
      }
      if (needs_booties) {
        qb.where('needs_booties', '=', needs_booties);
      }
      if (gender) {
        qb.where('gender', '=', gender);
      }
      if (team_position) {
        qb.where('team_position', '~*', team_position);
      }
    })
    .join('kennels', 'kennels.kennel_id', 'dogs.kennel_id')
    .orderBy(sort_by || 'name', order || 'asc');
};

exports.postDogToKennel = (newDog) => {
  return connection('dogs')
    .insert(newDog)
    .returning('*')
    .then((dog) => {
      return dog[0];
    });
};

exports.fetchDogById = (dog_id) => {
  return connection
    .select(
      'name',
      'dog_id',
      'birth_date',
      'gender',
      'km_ran',
      'kennels.kennel_name AS kennel',
      'display_pic',
      'needs_booties',
      'team_position'
    )
    .from('dogs')
    .where('dogs.dog_id', '=', dog_id)
    .join('kennels', 'kennels.kennel_id', 'dogs.kennel_id')
    .then((dog) => {
      return dog[0];
    });
};

exports.patchDog = (update, dog_id) => {
  if (Object.keys(update).length === 0) {
    return Promise.reject({ status: 400, msg: 'Empty request body' });
  }
  return connection('dogs')
    .update(update)
    .where('dogs.dog_id', '=', dog_id)
    .returning('*');
};

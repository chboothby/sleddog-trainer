const { toLocaleString } = require("../data/test-data/dogs");

exports.createKennelRef = (kennelRows) => {
  const kennelRef = {};
  kennelRows.forEach((kennel) => {
    kennelRef[kennel.kennel_name] = kennel.kennel_id;
  });
  return kennelRef;
};

exports.addKennelId = (data, kennelRef) => {
  return data.map(({ kennel, ...rest }) => {
    return { ...rest, kennel_id: kennelRef[kennel] };
  });
};

exports.formatDate = (dogs) => {
  return dogs.map(({ birth_date, ...rest }) => {
    const date = birth_date.split("/");
    const newDate = new Date(date[2], date[1], date[0]);
    return {
      ...rest,
      birth_date: newDate,
    };
  });
};

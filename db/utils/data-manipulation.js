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

exports.formatDate = (data) => {
  return data[0].birth_date
    ? data.map(({ birth_date, ...rest }) => {
        const date = birth_date.split('/');
        const newDate = new Date(date[2], parseInt(date[1]) - 1, date[0]);
        return {
          ...rest,
          birth_date: newDate,
        };
      })
    : data.map(({ date, ...rest }) => {
        const d = date.split('/');
        if (d[2].length === 2) {
          d[2] = '20' + d[2];
        }
        const newDate = new Date(d[2], parseInt(d[1]) - 1, d[0]);
        return {
          ...rest,
          date: newDate,
        };
      });
};

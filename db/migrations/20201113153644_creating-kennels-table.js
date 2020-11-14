exports.up = function (knex) {
  return knex.schema.createTable("kennels", (kennelsTable) => {
    kennelsTable.increments("kennel_id").primary();
    kennelsTable.text("kennel_name").unique();
    kennelsTable.integer("established");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("kennels");
};

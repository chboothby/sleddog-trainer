exports.up = function (knex) {
  return knex.schema.createTable("kennels", (kennelsTable) => {
    kennelsTable.increments("kennel_id").primary();
    kennelsTable.text("kennel_name").unique().notNullable();
    kennelsTable.integer("established");
    kennelsTable.text("location").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("kennels");
};

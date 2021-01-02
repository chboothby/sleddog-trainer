exports.up = function (knex) {
  return knex.schema.createTable("runs", (runsTable) => {
    runsTable.increments("run_id").primary();
    runsTable.text("route").notNullable();
    runsTable.integer("kennel_id").references("kennels.kennel_id");
    runsTable.specificType("dogs", "integer ARRAY").notNullable();
    runsTable.integer("distance").notNullable();
    runsTable.date("date").notNullable();
    runsTable.specificType("mushers", "integer ARRAY");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("runs");
};

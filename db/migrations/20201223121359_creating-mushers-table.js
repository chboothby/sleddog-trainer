exports.up = function (knex) {
  return knex.schema.createTable("mushers", (mushersTable) => {
    mushersTable.increments("musher_id").primary();
    mushersTable.text("name").notNullable();
    mushersTable
      .integer("kennel_id")
      .references("kennels.kennel_id")
      .notNullable();
    mushersTable.text("display_pic");
    mushersTable.text("nationality").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("mushers");
};

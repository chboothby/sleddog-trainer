exports.up = function (knex) {
  return knex.schema.createTable("mushers", (mushersTable) => {
    mushersTable.text("name").primary();
    mushersTable.integer("kennel_id").references("kennels.kennel_id");
    mushersTable.text("display_pic");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("mushers");
};

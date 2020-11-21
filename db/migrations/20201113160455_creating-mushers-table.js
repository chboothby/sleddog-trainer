exports.up = function (knex) {
  return knex.schema.createTable("mushers", (mushersTable) => {
    mushersTable.increments("musher_id").primary();
    mushersTable.text("name");
    mushersTable.integer("kennel_id").references("kennels.kennel_id");
    mushersTable.text("display_pic");
    mushersTable.text("nationality");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("mushers");
};

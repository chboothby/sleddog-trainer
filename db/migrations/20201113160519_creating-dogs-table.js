exports.up = function (knex) {
  return knex.schema.createTable("dogs", (dogsTable) => {
    dogsTable.text("name").primary();
    dogsTable.text("nickname");
    dogsTable.integer("kennel_id").references("kennels.kennel_id");
    dogsTable.text("display_pic");
    dogsTable.date("birth_date");
    dogsTable.integer("km_ran").defaultTo(0);
    dogsTable.boolean("needs-booties").defaultTo(false);
    dogsTable.text("team_position");
    dogsTable.text("gender").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("dogs");
};

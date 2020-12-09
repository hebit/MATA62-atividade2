"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class InstitutionsSchema extends Schema {
  up() {
    this.create("institutions", (table) => {
      table.increments();
      table.string("name");
      table.string("city");
      table.string("address");
      table.string("state");
      table.string("maintainer");
      table.enum("type", ["validator", "partner"]);
      table.boolean("is_valid").defaultTo(false);
      table.timestamps();
    });
  }

  down() {
    this.drop("institutions");
  }
}

module.exports = InstitutionsSchema;

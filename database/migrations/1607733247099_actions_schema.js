"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ActionsSchema extends Schema {
  up() {
    this.create("actions", (table) => {
      table.increments();
      table.string("description");
      table.integer("user_id").unsigned();
      table.foreign("user_id").references("id").inTable("users");
      table.integer("institution_id").unsigned();
      table.foreign("institution_id").references("id").inTable("institutions");
      table.timestamps();
    });
  }

  down() {
    this.drop("actions");
  }
}

module.exports = ActionsSchema;

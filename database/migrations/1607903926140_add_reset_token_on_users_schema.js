"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AddResetTokenOnUsersSchema extends Schema {
  up() {
    this.table("users", (table) => {
      // alter table
      table.string("reset_token");
    });
  }

  down() {
    this.table("users", (table) => {
      // reverse alternations
      table.dropColumn("reset_token");
    });
  }
}

module.exports = AddResetTokenOnUsersSchema;

"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class RemoveUidFromUsersSchema extends Schema {
  up() {
    this.table("users", (table) => {
      // alter table
      table.dropColumn("uid");
    });
  }

  down() {
    this.table("users", (table) => {
      // reverse alternations
      table.string("uid").notNullable();
    });
  }
}

module.exports = RemoveUidFromUsersSchema;

"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class UserSchema extends Schema {
  up() {
    this.create("users", (table) => {
      table.increments();
      table.string("uid").notNullable();
      table.string("email", 254).notNullable().unique();
      table.string("password", 60).notNullable();
      table.string("full_name");
      table.string("phone", 14);
      table.enum("role", [
        "admin",
        "leader",
        "superintent",
        "coordinator",
        "director",
        "employe",
      ]);
      table.string("confirmation_token");
      table.datetime("last_login");
      table.timestamps();
    });
  }

  down() {
    this.drop("users");
  }
}

module.exports = UserSchema;

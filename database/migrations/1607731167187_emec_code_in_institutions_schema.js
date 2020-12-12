"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AddDatesInInstitutionsSchema extends Schema {
  up() {
    this.table("institutions", (table) => {
      // alter table
      table.string("emec_code");
    });
  }

  down() {
    this.table("institutions", (table) => {
      // reverse alternations
      table.dropColumn("emec_code");
    });
  }
}

module.exports = AddDatesInInstitutionsSchema;

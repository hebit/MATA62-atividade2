"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AddAccreditationFieldSchema extends Schema {
  up() {
    this.table("institutions", (table) => {
      // alter table
      table.string("accreditation");
    });
  }

  down() {
    this.table("institutions", (table) => {
      // reverse alternations
      table.dropColumn("accreditation");
    });
  }
}

module.exports = AddAccreditationFieldSchema;

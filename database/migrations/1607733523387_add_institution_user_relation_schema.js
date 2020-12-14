"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AddInstitutionUserRelationSchema extends Schema {
  up() {
    this.table("users", (table) => {
      // alter table
      table.integer("institution_id").unsigned();
      table.string("cpf").unique();
      table.foreign("institution_id").references("id").inTable("institutions");
      // table
      //   .enum("role", [
      //     "admin",
      //     "leader",
      //     "superintent",
      //     "coordinator",
      //     "director",
      //     "employe_v",
      //     "employe_p",
      //   ])
      //   .alter();
    });
  }

  down() {
    this.table("users", (table) => {
      // reverse alternations
      table.dropColumn("institution_id");
      table.dropColumn("cpf");
      // table
      //   .enum("role", [
      //     "admin",
      //     "leader",
      //     "superintent",
      //     "coordinator",
      //     "director",
      //     "employe",
      //   ])
      //   .alter();
    });
  }
}

module.exports = AddInstitutionUserRelationSchema;

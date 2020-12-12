"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class CoursesSchema extends Schema {
  up() {
    this.create("courses", (table) => {
      table.increments();
      table.string("name");
      table.string("degree");
      table.string("emec_code");
      table.string("authorization");
      table.date("authorization_date");
      table.string("recognition");
      table.date("recognition_date");
      table.string("renovation");
      table.date("renovation_date");
      table.text("note");
      table.integer("institution_id").unsigned();
      table.foreign("institution_id").references("id").inTable("institutions");
      table.timestamps();
    });
  }

  down() {
    this.drop("courses");
  }
}

module.exports = CoursesSchema;

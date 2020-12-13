"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Course extends Model {
  institution() {
    return this.belongsTo("App/Models/Institution");
  }
}

module.exports = Course;

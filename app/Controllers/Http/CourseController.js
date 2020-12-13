"use strict";

const { param } = require("jquery");

const Course = use("App/Models/Course");

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with courses
 */
class CourseController {
  /**
   * Show a list of all courses.
   * GET courses
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ auth, request, response, view }) {
    const user = auth.user;
    // return response.send()
    const institution = await user.institution().fetch();
    const courses = await institution.courses().fetch();
    return view.render("course.index", { courses: courses.rows, institution });
  }

  /**
   * Render a form to be used for creating a new course.
   * GET courses/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {
    return view.render("course.create");
  }

  /**
   * Create/save a new course.
   * POST courses
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ auth, request, response }) {
    const data = request.only([
      "name",
      "degree",
      "emec_code",
      "aut",
      "authorization",
      "authorization_date",
      "recognition",
      "recognition_date",
      "renovation",
      "renovation_date",
      "note",
    ]);
    const user = auth.user;
    const institution = await user.institution().fetch();
    await institution.courses().create(data);
    return response.route("courses.index");
  }

  /**
   * Display a single course.
   * GET courses/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {}

  /**
   * Render a form to update an existing course.
   * GET courses/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {
    const course = await Course.find(params.id);
    return view.render("course.edit", { course });
  }

  /**
   * Update course details.
   * PUT or PATCH courses/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
    const data = request.only([
      "name",
      "degree",
      "emec_code",
      "aut",
      "authorization",
      "authorization_date",
      "recognition",
      "recognition_date",
      "renovation",
      "renovation_date",
      "note",
    ]);
    console.log({ data });
    try {
      const course = await Course.find(params.id);
      course.merge({ ...data, institution_id: course.institution_id });
      await course.save();
      console.log("{ ex }");
    } catch (ex) {
      console.log({ ex });
    }
    return response.route("courses.index");
  }

  /**
   * Delete a course with id.
   * DELETE courses/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
    const course = await Course.find(params.id);
    await course.delete();
    return response.route("courses.index");
  }
}

module.exports = CourseController;

"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Route = use("Route");
const Institution = use("App/Models/Institution");
const User = use("App/Models/User");

var moment = require("moment");

/**
 * Resourceful controller for interacting with institutions
 */
class InstitutionController {
  /**
   * Show a list of all institutions.
   * GET institutions
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ auth, view }) {
    let institutions;
    if (auth.user.role == "superintent") {
      institutions = await Institution.query()
        .where("type", "=", "partner")
        .fetch();
    } else {
      institutions = await Institution.find(auth.user.institution_id);
    }
    return view.render("institution.index", {
      institutions: institutions.rows,
      user: auth.user,
    });
  }

  /**
   * Render a form to be used for creating a new institution.
   * GET institutions/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {
    // retorna html com o formulario
    return view.render("institution.create");
  }

  /**
   * Create/save a new institution.
   * POST institutions
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ auth, request, response }) {
    const emails = request.only(["email", "d_email", "cpf", "d_cpf"]);
    const alreadyExists = await User.query()
      .where("email", "=", emails.email)
      .orWhere("email", "=", emails.d_email ? emails.d_email : "")
      .orWhere("cpf", "=", emails.cpf)
      .orWhere("cpf", "=", emails.d_cpf ? emails.d_email : "")
      .first();
    if (alreadyExists) {
      return response.redirect("back");
    }
    const data = request.only([
      "name",
      "address",
      "city",
      "state",
      "emec_code",
      "maintainer",
      "accreditation",
    ]);
    const user = auth ? auth.user : undefined;
    const is_valid = user && user.role === "superintent";
    let type;
    if (user && user.role === "superintent" && user.institution_id == null) {
      type = "validator";
      const leaderData = request.only([
        "first_name",
        "last_name",
        "email",
        "cpf",
        "role",
        "phone",
        "password",
      ]);
      const institution = await Institution.create({ ...data, is_valid, type });
      const leader = await institution
        .users()
        .create({ ...leaderData, role: "leader" });
      await user.institution().associate(institution);
    } else {
      type = "partner";
      const leaderData = request.only([
        "first_name",
        "last_name",
        "email",
        "cpf",
        "role",
        "phone",
        "password",
      ]);
      const directorData = request.only([
        "d_first_name",
        "d_last_name",
        "d_email",
        "d_cpf",
        "d_role",
        "d_phone",
        "d_password",
      ]);
      const institution = await Institution.create({ ...data, is_valid, type });
      const leader = await institution
        .users()
        .create({ ...leaderData, role: "leader" });
      const director = await institution.users().create({
        first_name: directorData.d_first_name,
        last_name: directorData.d_last_name,
        email: directorData.d_email,
        cpf: directorData.d_cpf,
        phone: directorData.d_phone,
        password: directorData.d_password,
        role: "director",
      });
      console.log({ director });
      await auth.login(leader);
      leader.last_login = moment().format("YYYY-MM-D H:mm:ss"); // August 13th 2019, 3:19:18 pm
      await leader.save();
    }

    return response.redirect(Route.url("root"));
  }

  /**
   * Display a single institution.
   * GET institutions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {}

  /**
   * Render a form to update an existing institution.
   * GET institutions/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ auth, request, response, view }) {
    // retorna o html do form preenchido (pega os dados do DB)
    console.log("on");
    const user = auth.user;
    const institution = await user.institution().fetch();
    return view.render("institution.edit", { institution });
  }

  /**
   * Update institution details.
   * PUT or PATCH institutions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ auth, params, request, response }) {
    //mexe com o DB
    const data = request.only([
      "name",
      "address",
      "city",
      "state",
      "emec_code",
      "maintainer",
      "accreditation",
    ]);
    const user = auth.user;
    const institution = await user.institution().fetch();
    // return response.send({ institution });
    institution.merge({ ...data, is_valid: institution.is_valid });
    await institution.save();
    return response.redirect(Route.url("institutions.index"));
  }

  /**
   * Delete a institution with id.
   * DELETE institutions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
    const institution = await Institution.find(params.id);
    await institution.delete();
    return response.redirect(Route.url("institutions.index"));
  }

  /**
   * Allow a institution with id.
   * GET institutions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async allow({ auth, params, response }) {
    const institution = await Institution.find(params.id);
    institution.is_valid = true;
    await institution.save();
    response.redirect(Route.url("institutions.index"));
  }
}

module.exports = InstitutionController;

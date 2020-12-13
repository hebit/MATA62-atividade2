"use strict";

const Route = use("Route");
const User = use("App/Models/User");
const path = require("path");
const fs = require("fs-extra");
const Response = require("@adonisjs/framework/src/Response");

class HomeController {
  async index({ auth, view, response }) {
    // const a = await auth.user.institution().fetch();
    // console.log({ a });
    // response.send({ a });
    const user = auth.user;
    const institution = await user.institution().fetch();
    return view.render("dashboard.index", { user, institution });
  }
}

module.exports = HomeController;

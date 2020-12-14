"use strict";
let BaseController = require("../BaseController");

const Route = use("Route");
const Logger = use("Logger");

const User = use("App/Models/User");
const { validate } = use("Validator");
class UserController extends BaseController {
  // async index({ route, request, response, session, view }) {
  //   let users = await User.all();
  //   return view.render("User.index", {
  //     users: users.rows,
  //   });
  // }
  async manage({ auth, view }) {
    //url: Route.url('User/UserController.manage'),
    view.share({
      title: "Usuários",
    });
    const user = auth.user;
    let users = await User.query()
      .where("institution_id", "=", user.institution_id)
      .fetch();
    return view.render("User.manage", {
      users: users.rows,
    });
  }
  async add({ route, request, response, session, view }) {
    view.share({
      title: "Add User",
    });
    var phoneCode = await this.phoneCode();
    return view.render("User.add", {
      phoneCode: phoneCode,
    });
  }

  async store({ auth, request, response }) {
    if (auth.user.institution_id == null) {
      return response.redirect(Route.url("root"));
    }

    const data = request.only([
      "first_name",
      "last_name",
      "email",
      "cpf",
      "role",
      "phone",
      "password",
    ]);

    const user = await User.query().where("email", "=", data.email).first();
    if (user) {
      return response.redirect("back");
    }

    await User.create({ ...data, institution_id: auth.user.institution_id });
    return response.redirect(Route.url("user.manage"));
  }

  async edit({ route, request, response, session, view }) {
    view.share({
      title: "Edit User",
    });
    var params = request.params;
    if (!params || !params.id) {
      response.redirect("not_found");
    }
    let user = await this._validateData(params.id);
    if (request.method() == "POST") {
      const data = request.only([
        "first_name",
        "last_name",
        "email",
        "cpf",
        "role",
        "phone",
        "password",
      ]);
      user.first_name = data.first_name;
      user.last_name = data.last_name;
      user.email = data.email;
      user.cpf = data.cpf;
      user.role = data.role;
      user.phone = data.phone;
      if (data.password) {
        user.password = data.password;
      }
      try {
        await user.save();
        return response.redirect(Route.url("user.manage"));
      } catch (ex) {
        console.log({ ex });
        Logger.error(ex.message);
      }
    }
    // let phoneCode = await this.phoneCode();
    // return response.send({ ne: 0 });
    return view.render("User.edit", {
      user,
    });
  }

  async destroy({ params, response }) {
    const user = await User.find(params.id);
    console.log({ params, user });
    await user.delete();
    return response.redirect(Route.url("user.manage"));
  }

  async _validateData(id) {
    if (!id) {
      throw new Error("Invalid User ID");
    }
    let user = await User.query().where("id", "=", id).first();
    // return user;

    if (!user || !user.id) {
      throw new Error("User does not exit");
    }
    return user;
  }
}

module.exports = UserController;

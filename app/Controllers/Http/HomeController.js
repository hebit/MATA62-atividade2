"use strict";

const Route = use("Route");
const User = use("App/Models/User");
const path = require("path");
const fs = require("fs-extra");

class HomeController {
  async index({ view }) {
    var breadcrumb = [
      {
        name: "Home",
        url: Route.url("/"),
        icon: "fa-dashboard",
        class: "",
      },
      {
        name: "Dashboard",
        url: "javascript:void(0)",
        icon: "",
        class: "active",
      },
    ];
    view.share({
      title: "Dashboard",
      breadcrumb: breadcrumb,
    });
    return view.render("dashboard.index");
  }
}

module.exports = HomeController;

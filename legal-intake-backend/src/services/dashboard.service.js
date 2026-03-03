"use strict";

const db = require("../models");
const ApiError = require("../utils/apiError");

const Case = db.Case;
const User = db.User;

class DashboardService {
  static async getStats() {
    const totalCases = await Case.count();

    const pendingIntake = await Case.count({
      where: { status: "open" },
    });

    const activeLawyers = await User.count({
      where: { role: "lawyer" },
    });

    return {
      totalCases,
      pendingIntake,
      activeLawyers,
    };
  }
}

module.exports = DashboardService;
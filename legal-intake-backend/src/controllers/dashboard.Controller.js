"use strict";

const DashboardService = require("../services/dashboard.service.js");

exports.getStats = async (request, reply) => {
  const stats = await DashboardService.getStats();

  return reply.send(stats);
};
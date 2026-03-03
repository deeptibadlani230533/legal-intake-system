"use strict";

const MatterService = require("../services/matter.service.js");

class MatterController {

  static async createMatter(req, reply) {
    const matter = await MatterService.createMatter(req.body);

    return reply.code(201).send({
      success: true,
      message: "Matter created successfully",
      data: matter,
    });
  }

  static async getAllMatters(req, reply) {
    const matters = await MatterService.getAllMatters();

    return reply.send({
      success: true,
      message: "Matters fetched successfully",
      data: matters,
    });
  }

  static async getMatterById(req, reply) {
    const { id } = req.params;
    const matter = await MatterService.getMatterById(id);

    return reply.send({
      success: true,
      message: "Matter fetched successfully",
      data: matter,
    });
  }

  static async updateMatter(req, reply) {
    const { id } = req.params;
    const updatedMatter = await MatterService.updateMatter(id, req.body);

    return reply.send({
      success: true,
      message: "Matter updated successfully",
      data: updatedMatter,
    });
  }

  static async deleteMatter(req, reply) {
    const { id } = req.params;
    await MatterService.deleteMatter(id);

    return reply.send({
      success: true,
      message: "Matter deleted successfully",
    });
  }

  static async updateMatterStatus(req, reply) {
    const { id } = req.params;
    const { status } = req.body;

    const updatedMatter =
      await MatterService.updateMatterStatus(id, status);

    return reply.send({
      success: true,
      message: "Matter status updated successfully",
      data: updatedMatter,
    });
  }

  static async expireStale(req, reply) {
    const days = parseInt(req.query.days) || 7;

    const updatedCount =
      await MatterService.expireStaleMatters(days);

    return reply.send({
      success: true,
      message: `Expired matters older than ${days} days`,
      updatedCount,
    });
  }
}

module.exports = MatterController;
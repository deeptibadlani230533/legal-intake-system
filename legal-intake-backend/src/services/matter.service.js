"use strict";

const db = require("../models");
const { Op } = require("sequelize");
const ApiError = require("../utils/apiError");

const Matter = db.Matter;

class MatterService {

  static async createMatter(data) {
    if (!data.title || !data.clientName) {
      throw new ApiError(400, "Title and client name are required");
    }

    return await Matter.create({
      title: data.title,
      description: data.description,
      clientName: data.clientName,
      assignedLawyerId: data.assignedLawyerId || null,
    });
  }

  static async getAllMatters() {
    return await Matter.findAll({
      order: [["createdAt", "DESC"]],
    });
  }

  static async getMatterById(id) {
    const matter = await Matter.findByPk(id);

    if (!matter) {
      throw new ApiError(404, "Matter not found");
    }

    return matter;
  }

  static async updateMatter(id, data) {
    const matter = await this.getMatterById(id);

    matter.title = data.title ?? matter.title;
    matter.description = data.description ?? matter.description;
    matter.clientName = data.clientName ?? matter.clientName;
    matter.assignedLawyerId =
      data.assignedLawyerId ?? matter.assignedLawyerId;

    await matter.save();
    return matter;
  }

  static async deleteMatter(id) {
    const matter = await this.getMatterById(id);
    await matter.destroy();
    return true;
  }

  static async updateMatterStatus(id, newStatus) {
    const matter = await this.getMatterById(id);

    const transitions = {
      open: ["in_progress"],
      in_progress: ["closed"],
      closed: [],
    };

    if (!transitions[matter.status].includes(newStatus)) {
      throw new ApiError(
        400,
        `Invalid transition from ${matter.status} → ${newStatus}`
      );
    }

    matter.status = newStatus;
    await matter.save();

    return matter;
  }

  static async expireStaleMatters(days = 7) {
    if (isNaN(days) || days <= 0) {
      throw new ApiError(400, "Days must be a positive integer");
    }

    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - days);

    const [updatedCount] = await Matter.update(
      {
        status: "closed",
        closedAt: new Date(),
      },
      {
        where: {
          status: "open",
          createdAt: {
            [Op.lt]: thresholdDate,
          },
        },
      }
    );

    return updatedCount;
  }
}

module.exports = MatterService;
"use strict";

const db = require("../models");
const { Op } = require("sequelize");
const ApiError = require("../utils/apiError");

const Task = db.Task;
const Matter = db.Matter;

class TaskService {

  /* CREATE */
  static async createTask(data) {
    const { title, description, dueDate, matterId } = data;

    if (!matterId) {
      throw new ApiError(400, "Matter ID is required");
    }

    const matter = await Matter.findByPk(matterId);
    if (!matter) {
      throw new ApiError(404, "Matter not found");
    }

    return await Task.create({
      title,
      description,
      dueDate,
      matterId,
      status: "pending",
    });
  }

  /* GET ALL */
  static async getAllTasks() {
    return await Task.findAll();
  }

  /* GET BY ID */
  static async getTaskById(id) {
    const task = await Task.findByPk(id);
    if (!task) throw new ApiError(404, "Task not found");
    return task;
  }

  /* UPDATE */
  static async updateTask(id, data) {
    const task = await this.getTaskById(id);
    await task.update(data);
    return task;
  }

  /* DELETE */
  static async deleteTask(id) {
    const task = await this.getTaskById(id);
    await task.destroy();
    return true;
  }

  /* COMPLETE */
  static async completeTask(id) {
    const task = await this.getTaskById(id);

    task.status = "completed";
    await task.save();

    return task;
  }

  /* OVERDUE */
  static async getOverdueTasks() {
    const today = new Date();

    const tasks = await Task.findAll({
      where: {
        status: "pending",
        dueDate: {
          [Op.lt]: today,
        },
      },
      order: [["dueDate", "ASC"]],
    });

    return {
      count: tasks.length,
      tasks,
    };
  }

  /* UPCOMING */
  static async getUpcomingTasks() {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const tasks = await Task.findAll({
      where: {
        status: "pending",
        dueDate: {
          [Op.between]: [today, nextWeek],
        },
      },
      order: [["dueDate", "ASC"]],
    });

    return {
      count: tasks.length,
      tasks,
    };
  }

  /* SUMMARY */
  static async getTaskSummary() {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const pending = await Task.count({
      where: { status: "pending" },
    });

    const completed = await Task.count({
      where: { status: "completed" },
    });

    const overdue = await Task.count({
      where: {
        status: "pending",
        dueDate: { [Op.lt]: today },
      },
    });

    const upcoming = await Task.count({
      where: {
        status: "pending",
        dueDate: { [Op.between]: [today, nextWeek] },
      },
    });

    return {
      pending,
      completed,
      overdue,
      upcoming,
    };
  }
}

module.exports = TaskService;
"use strict";

const TaskService = require("../services/task.service");

/* CREATE */
exports.createTask = async (req, reply) => {
  const task = await TaskService.createTask(req.body);

  return reply.code(201).send({
    message: "Task created successfully",
    task,
  });
};

/* GET ALL */
exports.getAllTasks = async (req, reply) => {
  const tasks = await TaskService.getAllTasks();
  return reply.send(tasks);
};

/* GET BY ID */
exports.getTaskById = async (req, reply) => {
  const task = await TaskService.getTaskById(req.params.id);
  return reply.send(task);
};

/* UPDATE */
exports.updateTask = async (req, reply) => {
  const task = await TaskService.updateTask(
    req.params.id,
    req.body
  );

  return reply.send({
    message: "Task updated successfully",
    task,
  });
};

/* DELETE */
exports.deleteTask = async (req, reply) => {
  await TaskService.deleteTask(req.params.id);

  return reply.send({
    message: "Task deleted successfully",
  });
};

/* COMPLETE */
exports.completeTask = async (req, reply) => {
  const task = await TaskService.completeTask(req.params.id);

  return reply.send({
    message: "Task marked as completed",
    task,
  });
};

/* OVERDUE */
exports.getOverdueTasks = async (req, reply) => {
  const result = await TaskService.getOverdueTasks();
  return reply.send(result);
};

/* UPCOMING */
exports.getUpcomingTasks = async (req, reply) => {
  const result = await TaskService.getUpcomingTasks();
  return reply.send(result);
};

/* SUMMARY */
exports.getTaskSummary = async (req, reply) => {
  const summary = await TaskService.getTaskSummary();
  return reply.send(summary);
};
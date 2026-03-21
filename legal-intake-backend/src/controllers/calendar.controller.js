"use strict";

const calendarService = require("../services/calendar.service");

/* GET /api/calendar?month=3&year=2026 */
const getEvents = async (req, reply) => {
  const month = parseInt(req.query.month) || new Date().getMonth() + 1;
  const year  = parseInt(req.query.year)  || new Date().getFullYear();

  const events = await calendarService.getEvents(
    req.user.id,
    req.user.role,
    month,
    year
  );

  return reply.send(events);
};

/* GET /api/calendar/:id */
const getEventById = async (req, reply) => {
  const event = await calendarService.getEventById(
    req.params.id,
    req.user.id,
    req.user.role
  );

  return reply.send(event);
};

/* POST /api/calendar */
const createEvent = async (req, reply) => {
  const event = await calendarService.createEvent(
    req.body,
    req.user.id
  );

  return reply.code(201).send(event);
};

/* PATCH /api/calendar/:id */
const updateEvent = async (req, reply) => {
  const event = await calendarService.updateEvent(
    req.params.id,
    req.body,
    req.user.id,
    req.user.role
  );

  return reply.send(event);
};

/* DELETE /api/calendar/:id */
const deleteEvent = async (req, reply) => {
  await calendarService.deleteEvent(
    req.params.id,
    req.user.id,
    req.user.role
  );

  return reply.send({ message: "Event deleted successfully" });
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
"use strict";

const { CalendarEvent, Case } = require("../models");
const { Op } = require("sequelize");
const ApiError = require("../utils/apiError");

/* ── CREATE ── */
async function createEvent(data, userId) {
  const { title, type, date, time, notes, caseId } = data;

  if (!title || !date) {
    throw new ApiError(400, "Title and date are required");
  }

  // If caseId is provided, verify the case exists
  if (caseId) {
    const caseExists = await Case.findByPk(caseId);
    if (!caseExists) throw new ApiError(404, "Linked case not found");
  }

  const event = await CalendarEvent.create({
    title,
    type: type || "reminder",
    date,
    time: time || null,
    notes: notes || null,
    caseId: caseId || null,
    userId,
  });

  return event;
}

/* ── GET EVENTS (filtered by month/year) ── */
async function getEvents(userId, role, month, year) {
  // Build date range for the requested month
  const start = new Date(year, month - 1, 1);
  const end   = new Date(year, month, 0); // last day of month

  const startStr = start.toISOString().split("T")[0];
  const endStr   = end.toISOString().split("T")[0];

  // Admin sees all events; others see only their own
  const where =
    role === "admin"
      ? { date: { [Op.between]: [startStr, endStr] } }
      : { userId, date: { [Op.between]: [startStr, endStr] } };

  const events = await CalendarEvent.findAll({
    where,
    order: [["date", "ASC"], ["time", "ASC"]],
  });

  return events;
}

/* ── GET SINGLE ── */
async function getEventById(id, userId, role) {
  const event = await CalendarEvent.findByPk(id);
  if (!event) throw new ApiError(404, "Event not found");

  if (role !== "admin" && event.userId !== userId) {
    throw new ApiError(403, "Forbidden");
  }

  return event;
}

/* ── DELETE ── */
async function deleteEvent(id, userId, role) {
  const event = await CalendarEvent.findByPk(id);
  if (!event) throw new ApiError(404, "Event not found");

  if (role !== "admin" && event.userId !== userId) {
    throw new ApiError(403, "You can only delete your own events");
  }

  await event.destroy();
  return true;
}

/* ── UPDATE ── */
async function updateEvent(id, data, userId, role) {
  const event = await CalendarEvent.findByPk(id);
  if (!event) throw new ApiError(404, "Event not found");

  if (role !== "admin" && event.userId !== userId) {
    throw new ApiError(403, "You can only edit your own events");
  }

  await event.update(data);
  return event;
}

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  deleteEvent,
  updateEvent,
};
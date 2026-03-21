"use strict";

const calendarController = require("../controllers/calendar.controller");
const authenticate = require("../middleware/authMiddleware");
const allowRoles   = require("../middleware/rolePolicy");

async function calendarRoutes(app) {
  app.get(
    "/calendar",
    { preHandler: [authenticate, allowRoles("admin", "lawyer", "client")] },
    calendarController.getEvents
  );

  app.get(
    "/calendar/:id",
    { preHandler: [authenticate, allowRoles("admin", "lawyer", "client")] },
    calendarController.getEventById
  );

  app.post(
    "/calendar",
    { preHandler: [authenticate, allowRoles("admin", "lawyer", "client")] },
    calendarController.createEvent
  );

  app.patch(
    "/calendar/:id",
    { preHandler: [authenticate, allowRoles("admin", "lawyer", "client")] },
    calendarController.updateEvent
  );

  app.delete(
    "/calendar/:id",
    { preHandler: [authenticate, allowRoles("admin", "lawyer", "client")] },
    calendarController.deleteEvent
  );
}

module.exports = calendarRoutes; 
"use strict";

const MatterController = require("../controllers/matter.controller.js");

const authenticate = require("../middleware/authMiddleware.js");

const allowRoles = require("../middleware/rolePolicy.js");


async function matterRoutes(fastify, options) {
  // Create Matter (Admin only)
  fastify.post(
    "/matters",
    {
      preHandler: [authenticate, allowRoles("admin")],
    },
    MatterController.createMatter
  );

  // Get All Matters (Admin + Lawyer)
  fastify.get(
    "/matters",
    {
      preHandler: [authenticate, allowRoles("admin", "lawyer")],
    },
    MatterController.getAllMatters
  );

  // Expire Stale Matters (Admin only)
fastify.patch(
  "/matters/expire-stale",
  {
    preHandler: [authenticate, allowRoles("admin")],
  },
  MatterController.expireStale
);

  // Get Matter by ID (Admin + Lawyer)
  fastify.get(
    "/matters/:id",
    {
      preHandler: [authenticate, allowRoles("admin", "lawyer")],
    },
    MatterController.getMatterById
  );


  // Update Matter Details (Admin only)
fastify.put(
  "/matters/:id",
  {
    preHandler: [authenticate, allowRoles("admin")],
  },
  MatterController.updateMatter
);


// Delete Matter (Admin only)
fastify.delete(
  "/matters/:id",
  {
    preHandler: [authenticate, allowRoles("admin")],
  },
  MatterController.deleteMatter
);


  // Update Matter Status (Lawyer only)
  fastify.patch(
    "/matters/:id/status",
    {
      preHandler: [authenticate, allowRoles("lawyer")],
    },
    MatterController.updateMatterStatus
  );


  
}

module.exports = matterRoutes;

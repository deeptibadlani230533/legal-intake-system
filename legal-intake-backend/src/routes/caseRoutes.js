const caseController = require("../controllers/caseController");
const authenticate = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/rolePolicy");
const {
  createCaseSchema,
  updateStatusSchema,
  assignLawyerSchema,
} = require("../schemas/case.schema");
async function caseRoutes(app) {

  app.post(
    "/cases",
    { preHandler: [authenticate, allowRoles("client")],
      schema: createCaseSchema,
    },
    caseController.createCase
  );

  app.get(
    "/cases",
    { preHandler: [authenticate, allowRoles("lawyer", "admin", "client")] },
    caseController.getAllCases
  );

  app.get(
    "/cases/:id",
    { preHandler: [authenticate, allowRoles("lawyer", "admin", "client")] },
    caseController.getCaseById
  );

  app.patch(
    "/cases/:id/status",
    { preHandler: [authenticate, allowRoles("admin")],
      schema: updateStatusSchema,
     },
    caseController.updateCaseStatus
  );

  app.delete(
    "/cases/:id",
    { preHandler: [authenticate, allowRoles("admin")] },
    caseController.deleteCase
  );

  app.put(
    "/cases/:id",
    { preHandler: [authenticate, allowRoles("admin")] },
    caseController.updateCase
  );

  app.patch(
    "/cases/:id/assign",
    { preHandler: [authenticate, allowRoles("admin")],
      schema: assignLawyerSchema,
     },
    caseController.assignLawyer
  );

  app.patch(
    "/cases/:id/accept",
    { preHandler: [authenticate, allowRoles("lawyer")] },
    caseController.acceptCase
  );

  app.get(
    "/lawyer/cases",
    { preHandler: [authenticate, allowRoles("lawyer")] },
    caseController.getLawyerCases
  );

  app.patch(
    "/cases/:id/start",
    { preHandler: [authenticate, allowRoles("lawyer")] },
    caseController.startCase
  );

  app.patch(
    "/cases/:id/close",
    { preHandler: [authenticate, allowRoles("lawyer")] },
    caseController.closeCase
  );

  app.get(
  "/cases/:id/activity",
  {
    preHandler: [authenticate, allowRoles("admin", "lawyer", "client")]
  },
  caseController.getCaseActivity
);
}

module.exports = caseRoutes;
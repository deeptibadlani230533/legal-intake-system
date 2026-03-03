const authenticate = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/rolePolicy");

async function protectedRoutes(app) {
  
  // Admin Dashboard
  app.get(
    "/admin-dashboard",
    { preHandler: [authenticate, allowRoles("admin")] },
    async () => {
      return { message: "Welcome Admin" };
    }
  );

  // Lawyer Dashboard
  app.get(
    "/lawyer-cases",
    { preHandler: [authenticate, allowRoles("lawyer")] },
    async () => {
      return { message: "Welcome Lawyer" };
    }
  );

  // Client Portal
  app.get(
    "/client-portal",
    { preHandler: [authenticate, allowRoles("client")] },
    async () => {
      return { message: "Welcome Client" };
    }
  );
}

module.exports = protectedRoutes;

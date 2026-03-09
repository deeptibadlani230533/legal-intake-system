const userController = require("../controllers/userController");
const authenticate = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/rolePolicy");


async function userRoutes(app) {
  app.get(
    "/users",
    {
      preHandler: [authenticate, allowRoles("admin")],
    },
    userController.getAllUsers
  );

  app.get(
  "/users/lawyers",
  {
    preHandler: [authenticate, allowRoles("admin")],
  },
  userController.getLawyers
);

// DELETE USER
  app.delete(
    "/users/:id",
    {
      preHandler: [authenticate, allowRoles("admin")],
    },
    userController.deleteUser
  );

  app.get(
  "/users/:id/activity",
  {
    preHandler: [authenticate, allowRoles("admin")],
  },
  userController.getUserActivity
);

}




module.exports = userRoutes;
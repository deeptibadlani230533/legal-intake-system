const taskController = require("../controllers/task.controller");
const authenticate = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/rolePolicy");

async function taskRoutes(app) {

  // ✅ Create Task
  app.post(
    "/tasks",
    { preHandler: [authenticate, allowRoles("lawyer", "admin")] },
    taskController.createTask
  );

  // ✅ Get All Tasks
  app.get(
    "/tasks",
    { preHandler: [authenticate] },
    taskController.getAllTasks
  );

  // ✅ Get Task By ID
  app.get(
    "/tasks/:id",
    { preHandler: [authenticate] },
    taskController.getTaskById
  );

  // ✅ Update Task
  app.put(
    "/tasks/:id",
    { preHandler: [authenticate, allowRoles("lawyer", "admin")] },
    taskController.updateTask
  );

  // ✅ Delete Task
  app.delete(
    "/tasks/:id",
    { preHandler: [authenticate, allowRoles("admin")] },
    taskController.deleteTask
  );

  // ✅ Mark Task Completed
  app.patch(
    "/tasks/:id/complete",
    { preHandler: [authenticate] },
    taskController.completeTask
  );

  // ✅ Overdue Tasks
  app.get(
    "/tasks/overdue",
    { preHandler: [authenticate] },
    taskController.getOverdueTasks
  );

  // ✅ Upcoming Tasks
  app.get(
    "/tasks/upcoming",
    { preHandler: [authenticate] },
    taskController.getUpcomingTasks
  );

  // ✅ Task Summary Dashboard
  app.get(
    "/tasks/summary",
    { preHandler: [authenticate] },
    taskController.getTaskSummary
  );
}

module.exports = taskRoutes;

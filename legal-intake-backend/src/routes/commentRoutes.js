"use strict";

const commentController = require("../controllers/comment.controller");
const authenticate = require("../middleware/authMiddleware");
const allowRoles   = require("../middleware/rolePolicy");

async function commentRoutes(app) {

  // GET all comments for a case
  app.get(
    "/cases/:id/comments",
    { preHandler: [authenticate, allowRoles("admin", "lawyer", "client")] },
    commentController.getComments
  );

  // POST a new comment on a case
  app.post(
    "/cases/:id/comments",
    { preHandler: [authenticate, allowRoles("admin", "lawyer", "client")] },
    commentController.createComment
  );

  // DELETE a specific comment
  app.delete(
    "/cases/:caseId/comments/:commentId",
    { preHandler: [authenticate, allowRoles("admin", "lawyer", "client")] },
    commentController.deleteComment
  );
}

module.exports = commentRoutes;
"use strict";

const commentService = require("../services/comment.service");

/* GET /api/cases/:id/comments */
const getComments = async (req, reply) => {
  const comments = await commentService.getComments(
    req.params.id,
    req.user
  );

  return reply.send(comments);
};

/* POST /api/cases/:id/comments */
const createComment = async (req, reply) => {
  const comment = await commentService.createComment(
    req.params.id,
    req.body.text,
    req.user
  );

  return reply.code(201).send(comment);
};

/* DELETE /api/cases/:caseId/comments/:commentId */
const deleteComment = async (req, reply) => {
  await commentService.deleteComment(
    req.params.commentId,
    req.user
  );

  return reply.send({ message: "Comment deleted successfully" });
};

module.exports = {
  getComments,
  createComment,
  deleteComment,
};
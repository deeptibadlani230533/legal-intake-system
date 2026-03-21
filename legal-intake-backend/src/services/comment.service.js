"use strict";

const { CaseComment, User, Case } = require("../models");
const ApiError = require("../utils/apiError");

/* ── GET COMMENTS FOR A CASE ── */
async function getComments(caseId, user) {
  // Verify case exists and user has access
  const caseItem = await Case.findByPk(caseId);
  if (!caseItem) throw new ApiError(404, "Case not found");

  // Clients can only see comments on their own cases
  if (user.role === "client" && caseItem.userId !== user.id) {
    throw new ApiError(403, "Forbidden");
  }

  const comments = await CaseComment.findAll({
    where: { caseId },
    order: [["createdAt", "ASC"]],
    include: [
      {
        model: User,
        as: "author",
        attributes: ["id", "name", "role"],
      },
    ],
  });

  // Mark which comments belong to the requesting user
  return comments.map((c) => ({
    id:        c.id,
    text:      c.text,
    caseId:    c.caseId,
    createdAt: c.createdAt,
    isMine:    c.userId === user.id,
    author: {
      id:   c.author?.id,
      name: c.author?.name,
      role: c.author?.role,
    },
  }));
}

/* ── CREATE COMMENT ── */
async function createComment(caseId, text, user) {
  if (!text || !text.trim()) {
    throw new ApiError(400, "Comment text cannot be empty");
  }

  // Verify case exists and user has access
  const caseItem = await Case.findByPk(caseId);
  if (!caseItem) throw new ApiError(404, "Case not found");

  if (user.role === "client" && caseItem.userId !== user.id) {
    throw new ApiError(403, "Forbidden");
  }

  if (
    user.role === "lawyer" &&
    caseItem.assignedLawyerId !== user.id
  ) {
    throw new ApiError(403, "You are not assigned to this case");
  }

  const comment = await CaseComment.create({
    text: text.trim(),
    caseId,
    userId: user.id,
  });

  // Re-fetch with author info for the response
  const full = await CaseComment.findByPk(comment.id, {
    include: [
      {
        model: User,
        as: "author",
        attributes: ["id", "name", "role"],
      },
    ],
  });

  return {
    id:        full.id,
    text:      full.text,
    caseId:    full.caseId,
    createdAt: full.createdAt,
    isMine:    true,
    author: {
      id:   full.author?.id,
      name: full.author?.name,
      role: full.author?.role,
    },
  };
}

/* ── DELETE COMMENT ── */
async function deleteComment(commentId, user) {
  const comment = await CaseComment.findByPk(commentId);
  if (!comment) throw new ApiError(404, "Comment not found");

  // Only the author or admin can delete
  if (user.role !== "admin" && comment.userId !== user.id) {
    throw new ApiError(403, "You can only delete your own comments");
  }

  await comment.destroy();
  return true;
}

module.exports = {
  getComments,
  createComment,
  deleteComment,
};
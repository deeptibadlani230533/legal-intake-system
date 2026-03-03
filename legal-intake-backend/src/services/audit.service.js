const db = require("../models");

const logActivity = async ({
  userId,
  action,
  entityType,
  entityId,
  meta = {},
}) => {
  try {
    await db.AuditLog.create({
      userId,
      action,
      entityType,
      entityId,
      meta,
    });
  } catch (error) {
    console.error("Audit log failed:", error.message);
  }
};

//ADD THIS FUNCTION
const getCaseActivity = async (caseId) => {
  return await db.AuditLog.findAll({
    where: {
      entityType: "CASE",
      entityId: caseId,
    },
    include: [
      {
        model: db.User,
        as: "user",
        attributes: ["id", "name", "role"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });
};

module.exports = {
  logActivity,
  getCaseActivity, 
};
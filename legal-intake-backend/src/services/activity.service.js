const db = require("../models");

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
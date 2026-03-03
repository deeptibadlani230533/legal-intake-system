"use strict";

const { Case } = require("../models");
const ApiError = require("../utils/apiError");
const { logActivity } = require("./audit.service");

/* ---------------- CREATE ---------------- */

async function createCase(data, userId) {
  console.log("🔥 Incoming createCase data:", data);
  const { caseTitle, clientName, clientEmail } = data;

  

  const newCase = await Case.create({
    ...data,
    status: "open",
    userId,
  });

  await logActivity({
    userId,
    action: "CASE_CREATED",
    entityType: "CASE",
    entityId: newCase.id,
    meta: {
      caseTitle: newCase.caseTitle,
      clientName: newCase.clientName,
    },
  });

  return newCase;
}

/* ---------------- GET ALL ---------------- */

async function getAllCases(user) {
  if (user.role === "admin") {
    return await Case.findAll();
  }

  if (user.role === "lawyer") {
    return await Case.findAll({
      where: { assignedLawyerId: user.id },
      order: [["createdAt", "DESC"]],
    });
  }

  if (user.role === "client") {
    return await Case.findAll({
      where: { userId: user.id },
      order: [["createdAt", "DESC"]],
    });
  }

  throw new ApiError(403, "Unauthorized role");
}

/* ---------------- GET BY ID ---------------- */

async function getCaseById(id, user) {
  const caseItem = await Case.findByPk(id);
  if (!caseItem) throw new ApiError(404, "Case not found");

  if (user.role === "client" && caseItem.userId !== user.id) {
    throw new ApiError(403, "Forbidden");
  }

  return caseItem;
}

/* ---------------- UPDATE STATUS ---------------- */

async function updateCaseStatus(id, status, user) {
  if (user.role !== "admin") {
    throw new ApiError(403, "Only admin can update status");
  }

  const caseItem = await Case.findByPk(id);
  if (!caseItem) throw new ApiError(404, "Case not found");

  const oldStatus = caseItem.status;

  caseItem.status = status;
  await caseItem.save();

  await logActivity({
    userId: user.id,
    action: "CASE_STATUS_UPDATED",
    entityType: "CASE",
    entityId: caseItem.id,
    meta: {
      oldStatus,
      newStatus: status,
    },
  });

  return caseItem;
}

/* ---------------- UPDATE CASE ---------------- */

async function updateCase(id, data, user) {
  const caseItem = await Case.findByPk(id);
  if (!caseItem) throw new ApiError(404, "Case not found");

  const previousData = { ...caseItem.toJSON() };

  await caseItem.update(data);

  await logActivity({
    userId: user.id,
    action: "CASE_UPDATED",
    entityType: "CASE",
    entityId: caseItem.id,
    meta: {
      previousData,
      updatedFields: data,
    },
  });

  return caseItem;
}

/* ---------------- DELETE CASE ---------------- */

async function deleteCase(id, user) {
  const caseItem = await Case.findByPk(id);
  if (!caseItem) throw new ApiError(404, "Case not found");

  await logActivity({
    userId: user.id,
    action: "CASE_DELETED",
    entityType: "CASE",
    entityId: caseItem.id,
    meta: {
      caseTitle: caseItem.caseTitle,
    },
  });

  await caseItem.destroy();
  return true;
}

/* ---------------- ASSIGN LAWYER ---------------- */

async function assignLawyer(caseId, lawyerId, user) {
  const caseData = await Case.findByPk(caseId);
  if (!caseData) throw new ApiError(404, "Case not found");

  if (caseData.status === "closed") {
    throw new ApiError(400, "Cannot assign a closed case");
  }

  if (caseData.assignedLawyerId) {
    throw new ApiError(400, "Case is already assigned to a lawyer");
  }

  if (caseData.status !== "open") {
    throw new ApiError(400, "Only open cases can be assigned");
  }

  caseData.assignedLawyerId = lawyerId;
  caseData.status = "assigned";
  await caseData.save();

  await logActivity({
    userId: user.id,
    action: "CASE_ASSIGNED",
    entityType: "CASE",
    entityId: caseData.id,
    meta: {
      assignedTo: lawyerId,
    },
  });

  return caseData;
}

/* ---------------- ACCEPT CASE ---------------- */

async function acceptCase(caseId, lawyerId) {
  const caseData = await Case.findByPk(caseId);
  if (!caseData) throw new ApiError(404, "Case not found");

  if (caseData.assignedLawyerId !== lawyerId) {
    throw new ApiError(403, "You are not assigned to this case");
  }

  if (caseData.status !== "assigned") {
    throw new ApiError(400, "Case must be in assigned state to accept");
  }

  caseData.status = "in_progress";
  await caseData.save();

  await logActivity({
    userId: lawyerId,
    action: "CASE_ACCEPTED",
    entityType: "CASE",
    entityId: caseData.id,
  });

  return caseData;
}

/* ---------------- CLOSE CASE ---------------- */

async function closeCase(caseId, lawyerId) {
  const caseData = await Case.findByPk(caseId);
  if (!caseData) throw new ApiError(404, "Case not found");

  if (caseData.assignedLawyerId !== lawyerId) {
    throw new ApiError(403, "Not your case");
  }

  if (caseData.status !== "in_progress") {
    throw new ApiError(400, "Case must be in progress to close");
  }

  caseData.status = "closed";
  await caseData.save();

  await logActivity({
    userId: lawyerId,
    action: "CASE_CLOSED",
    entityType: "CASE",
    entityId: caseData.id,
  });

  return caseData;
}

/* ---------------- LAWYER CASES ---------------- */

async function getLawyerCases(lawyerId) {
  const cases = await Case.findAll({
    where: { assignedLawyerId: lawyerId },
    order: [["createdAt", "DESC"]],
  });

  return {
    count: cases.length,
    cases,
  };
}

module.exports = {
  createCase,
  getAllCases,
  getCaseById,
  updateCaseStatus,
  updateCase,
  deleteCase,
  assignLawyer,
  acceptCase,
  closeCase,
  getLawyerCases,
};
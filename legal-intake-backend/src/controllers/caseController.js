const caseService = require("../services/case.service");
const { getCaseActivity: getCaseActivityService } = require("../services/audit.service");
const createCase = async (req, reply) => {
  console.log("🚀 Controller req.body:", req.body);
  const result = await caseService.createCase(
    req.body,
    req.user.id
  );

  return reply.code(201).send({
    message: "Case created successfully",
    case: result,
  });
};

/* GET ALL */
const getAllCases = async (req, reply) => {
  const cases = await caseService.getAllCases(req.user);
  return reply.send(cases);
};

/* GET BY ID */
const getCaseById = async (req, reply) => {
  const caseItem = await caseService.getCaseById(
    req.params.id,
    req.user
  );
  return reply.send(caseItem);
};

/* UPDATE STATUS */
const updateCaseStatus = async (req, reply) => {
  const caseItem = await caseService.updateCaseStatus(
    req.params.id,
    req.body.status,
    req.user
  );
  return reply.send(caseItem);
};

/* DELETE */
const deleteCase = async (req, reply) => {
  await caseService.deleteCase(req.params.id,req.user);
  return reply.send({ message: "Case deleted successfully" });
};

/* UPDATE */
const updateCase = async (req, reply) => {
  const caseItem = await caseService.updateCase(
    req.params.id,
    req.body
  );
  return reply.send(caseItem);
};

/* ASSIGN */
const assignLawyer = async (req, reply) => {
  const caseData = await caseService.assignLawyer(
    req.params.id,
    req.body.lawyerId,
    req.user
  );

  return reply.send({
    message: "Lawyer assigned successfully",
    case: caseData,
  });
};

/* ACCEPT */
const acceptCase = async (req, reply) => {
  const caseData = await caseService.acceptCase(
    req.params.id,
    req.user.id
  );

  return reply.send({
    message: "Case accepted successfully",
    case: caseData,
  });
};

/* START */
const startCase = async (req, reply) => {
  const caseData = await caseService.startCase(
    req.params.id,
    req.user.id
  );

  return reply.send(caseData);
};

/* CLOSE */
const closeCase = async (req, reply) => {
  const caseData = await caseService.closeCase(
    req.params.id,
    req.user.id
  );

  return reply.send({
    message: "Case closed successfully",
    case: caseData,
  });
};

/* LAWYER CASES */
const getLawyerCases = async (req, reply) => {
  const result = await caseService.getLawyerCases(req.user.id);
  return reply.send(result);
};


const getCaseActivity = async (req, reply) => {
  const activity = await getCaseActivityService(req.params.id
  );
  return reply.send(activity);
};

module.exports = {
  createCase,
  getAllCases,
  getCaseById,
  updateCaseStatus,
  deleteCase,
  updateCase,
  assignLawyer,
  acceptCase,
  startCase,
  closeCase,
  getLawyerCases,
  getCaseActivity
};
"use strict";

/* CREATE CASE */
const createCaseSchema = {
  body: {
    type: "object",
    required: ["caseTitle", "clientName", "clientEmail"],
    properties: {
      caseTitle: { type: "string", minLength: 3 },
      description: { type: "string" },

      clientName: { type: "string", minLength: 3 },
      clientEmail: { type: "string", format: "email" },
      clientPhone: { type: "string" },
      clientAddress: { type: "string" },

      category: { type: "string" },
      incidentDate: { type: "string", format: "date" },
      opponentName: { type: "string" },
      claimAmount: { type: "number" }
    },
    additionalProperties: false,
  },
};

/* UPDATE STATUS */
const updateStatusSchema = {
  body: {
    type: "object",
    required: ["status"],
    properties: {
      status: {
        type: "string",
        enum: ["open", "assigned", "in_progress", "closed"],
      },
    },
    additionalProperties: false,
  },
};

/* ASSIGN LAWYER */
const assignLawyerSchema = {
  body: {
    type: "object",
    required: ["lawyerId"],
    properties: {
      lawyerId: { type: "integer" },
    },
    additionalProperties: false,
  },
};

module.exports = {
  createCaseSchema,
  updateStatusSchema,
  assignLawyerSchema,
};
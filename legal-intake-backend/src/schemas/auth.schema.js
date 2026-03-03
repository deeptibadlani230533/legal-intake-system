"use strict";

/* SIGNUP */
const signupSchema = {
  body: {
    type: "object",
    required: ["name", "email", "password", "role"],
    properties: {
      name: { type: "string", minLength: 3 },
      email: { type: "string", format: "email" },
      password: { type: "string", minLength: 6 },
      role: {
        type: "string",
        enum: ["admin", "lawyer", "client"],
      },
    },
    additionalProperties: false,
  },
};

/* LOGIN */
const loginSchema = {
  body: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string", format: "email" },
      password: { type: "string", minLength: 6 },
    },
    additionalProperties: false,
  },
};

/* REQUEST OTP */
const requestOtpSchema = {
  body: {
    type: "object",
    required: ["email"],
    properties: {
      email: { type: "string", format: "email" },
    },
    additionalProperties: false,
  },
};

/* VERIFY OTP */
const verifyOtpSchema = {
  body: {
    type: "object",
    required: ["email", "otp"],
    properties: {
      email: { type: "string", format: "email" },
      otp: { type: "string", minLength: 4, maxLength: 6 },
    },
    additionalProperties: false,
  },
};

/* RESET PASSWORD */
const resetPasswordSchema = {
  body: {
    type: "object",
    required: ["email", "newPassword"],
    properties: {
      email: { type: "string", format: "email" },
      newPassword: { type: "string", minLength: 6 },
    },
    additionalProperties: false,
  },
};

module.exports = {
  signupSchema,
  loginSchema,
  requestOtpSchema,
  verifyOtpSchema,
  resetPasswordSchema,
};
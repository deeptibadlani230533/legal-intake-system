const authController= require("../controllers/authController");
const {
  signupSchema,
  loginSchema,
  requestOtpSchema,
  verifyOtpSchema,
  resetPasswordSchema,
} = require("../schemas/auth.schema");

async function authRoutes(fastify, options) {

  fastify.post(
    "/signup",
    { schema: signupSchema },
    authController.signup
  );

  fastify.post(
    "/login",
    { schema: loginSchema },
    authController.login
  );

  fastify.post(
    "/request-otp",
    { schema: requestOtpSchema },
    authController.requestOTP
  );

  fastify.post(
    "/verify-otp",
    { schema: verifyOtpSchema },
    authController.verifyOTP
  );

  fastify.post(
    "/reset-password",
    { schema: resetPasswordSchema },
    authController.resetPassword
  );
}

module.exports = authRoutes;
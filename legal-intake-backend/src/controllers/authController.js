const authService = require("../services/auth.service");

exports.login = async (request, reply) => {
  const { email, password } = request.body;
  const result = await authService.login(email, password, reply);
  return reply.send(result);
};

exports.signup = async (request, reply) => {
  const { name, email, password, role } = request.body;
  const result = await authService.signup(name, email, password, role);
  return reply.code(201).send(result);
};

exports.requestOTP = async (request, reply) => {
  const { email } = request.body;
  const result = await authService.requestOTP(email);
  return reply.send(result);
};

exports.verifyOTP = async (request, reply) => {
  const { email, otp } = request.body;
  const result = await authService.verifyOTP(email, otp);
  return reply.send(result);
};

exports.resetPassword = async (request, reply) => {
  const { email, newPassword } = request.body;
  const result = await authService.resetPassword(email, newPassword);
  return reply.send(result);
};
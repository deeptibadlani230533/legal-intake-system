const bcrypt = require("bcrypt");
const db = require("../models");
const ApiError = require("../utils/apiError");
const { sendOTPEmail } = require("../utils/emailService");
const User = db.User;
const OTP = db.OTP;

async function login(email, password, reply) {
  const foundUser = await User.findOne({ where: { email } });

  if (!foundUser) {
    throw new ApiError(401, "Invalid email");
  }

  const match = await bcrypt.compare(password, foundUser.passwordHash);

  if (!match) {
    throw new ApiError(401, "Invalid password");
  }

  const token = await reply.jwtSign(
    { id: foundUser.id, role: foundUser.role },
    { expiresIn: "1d" }
  );

  return {
    message: "Login successful",
    token,
    role: foundUser.role,
  };
}

async function signup(name, email, password, role) {
  const existingUser = await User.findOne({ where: { email } });

  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    email,
    passwordHash,
    role,
  });

  return {
    message: "Signup successful",
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    },
  };
}

async function requestOTP(email) {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // 🔥 Delete all previous OTPs properly
  await OTP.destroy({
    where: { email }
  });

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 5);

  await OTP.create({
    email,
    code,
    expiresAt,
    verified: false,
  });

  await sendOTPEmail(email, code);

  return {
    message: "OTP sent to your email successfully",
  };
}

async function verifyOTP(email, code) {
  code = String(code);

  const otpRecord = await OTP.findOne({
    where: { email, code, verified: false },
    order: [["createdAt", "DESC"]],
  });

  if (!otpRecord) {
    throw new ApiError(400, "Invalid or expired OTP");
  }

  if (otpRecord.expiresAt < new Date()) {
    throw new ApiError(400, "OTP expired");
  }

  otpRecord.verified = true;
  await otpRecord.save();

  return { message: "OTP verified successfully" };
}


async function resetPassword(email, newPassword) {
  const otpRecord = await OTP.findOne({
    where: { email, verified: true },
    order: [["createdAt", "DESC"]],
  });

  if (!otpRecord) {
    throw new ApiError(400, "OTP not verified");
  }

  if (otpRecord.expiresAt < new Date()) {
    throw new ApiError(400, "OTP expired");
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await User.update(
    { passwordHash },
    { where: { email } }
  );

  // 🔥 Completely remove OTP after successful reset
  await otpRecord.destroy();

  return { message: "Password reset successful" };
}

module.exports = {
  login,
  signup,
  requestOTP,
  verifyOTP,
  resetPassword,
};

const { User } = require("../models");

exports.getAllUsers = async (req, reply) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "role"],
    });

    return reply.send(users);
  } catch (err) {
    return reply.code(500).send({ message: "Server error" });
  }
};

exports.getLawyers = async (req, reply) => {
  try {
    const lawyers = await User.findAll({
      where: { role: "lawyer" },
      attributes: ["id", "name", "email"],
      order: [["createdAt", "DESC"]],
    });

    return reply.send(lawyers);
  } catch (err) {
    return reply.code(500).send({ message: "Failed to fetch lawyers" });
  }
};
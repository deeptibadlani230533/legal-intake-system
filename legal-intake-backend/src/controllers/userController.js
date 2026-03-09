
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

exports.deleteUser = async (req, reply) => {
  const { id } = req.params;

  try {
    const result = await req.server.db.query(
      "DELETE FROM users WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return reply.code(404).send({ message: "User not found" });
    }

    return reply.send({ message: "User deleted successfully" });

  } catch (error) {
    console.error(error);
    return reply.code(500).send({ message: "Server error" });
  }
};
function allowRoles(...roles) {
  return async function (request, reply) {
    try {
      console.log("Decoded user:", request.user);
      console.log("User role:", request.user?.role);
      console.log("Allowed roles:", roles);

      const userRole = request.user.role;

      if (!roles.includes(userRole)) {
        return reply.code(403).send({
          message: "Forbidden You don’t have permission",
        });
      }
    } catch (err) {
      return reply.code(500).send({
        message: "Role policy error",
      });
    }
  };
}

module.exports = allowRoles;  
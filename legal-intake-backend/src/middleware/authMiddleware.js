async function authenticate(request, reply) {
  try {
    const decoded = await request.jwtVerify();

    request.user = decoded;  

  } catch (err) {
    return reply.code(401).send({
      message: "Unauthorized Token missing or invalid",
    });
  }
}

module.exports = authenticate;
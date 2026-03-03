const fp = require("fastify-plugin");

async function jwtPlugin(fastify, options) {
  fastify.register(require("@fastify/jwt"), {
    secret: process.env.JWT_SECRET,
  });
}

module.exports = fp(jwtPlugin);
const fastifyOauth2 = require("@fastify/oauth2");
const oauthController = require("../controllers/oauthController");

async function oauthRoutes(fastify, options) {

  // Register OAuth plugin
  await fastify.register(fastifyOauth2, {
    name: "githubOAuth2",
    scope: ["user:email"],
    credentials: {
      client: {
        id: process.env.GITHUB_CLIENT_ID,
        secret: process.env.GITHUB_CLIENT_SECRET,
      },
      auth: fastifyOauth2.GITHUB_CONFIGURATION,
    },
    callbackUri: "http://13.200.123.199:3000/auth/github/callback",
  });

  // Start login
  fastify.get("/auth/github", oauthController.githubLogin);

  // GitHub callback
  fastify.get("/auth/github/callback", oauthController.githubCallback);

}

module.exports = oauthRoutes;
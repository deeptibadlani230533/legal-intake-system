const fastifyOauth2 = require("@fastify/oauth2");
const { app } = require("../app");

async function oauthRoutes(fastify, options) {

  // Register OAuth plugin INSIDE this route plugin
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

  // Route: start github login
  fastify.get("/auth/github", async function (request, reply) {
    const redirectUrl = fastify.githubOAuth2.generateAuthorizationUri(request);
    reply.redirect(redirectUrl);
  });

  // Route: github callback
  fastify.get("/auth/github/callback", async function (request, reply) {
    const token =
      await fastify.githubOAuth2.getAccessTokenFromAuthorizationCodeFlow(
        request
      );

    const response = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${token.token.access_token}`,
      },
    });

    const githubUser = await response.json();

    reply.send({
      message: "GitHub login success",
      user: githubUser,
    });
  });
}

module.exports = oauthRoutes;
app.register(require("./routes/oauthRoutes.js"));

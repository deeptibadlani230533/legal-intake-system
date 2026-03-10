const fastifyOauth2 = require("@fastify/oauth2");

async function oauthRoutes(fastify) {

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

  // STEP 1: manually create redirect route
  fastify.get("/auth/github", async function (request, reply) {
    const redirect = fastify.githubOAuth2.generateAuthorizationUri(request);
    reply.redirect(redirect);
  });

  // STEP 2: handle callback
  fastify.get("/auth/github/callback", async function (request, reply) {

    const token = await fastify.githubOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);

    const response = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${token.token.access_token}`,
      },
    });

    const githubUser = await response.json();

    reply.send({
      message: "GitHub login success",
      user: githubUser
    });

  });

}

module.exports = oauthRoutes;
const { app } = require("../app");

async function oauthRoutes(fastify, options) {

  fastify.get("/auth/github/callback", async function (request, reply) {

    const token = await fastify.githubOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);

    const response = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${token.token.access_token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    const githubUser = await response.json();

    reply.send({
      message: "GitHub login successful",
      user: githubUser,
    });
  });

}

module.exports = oauthRoutes;
app.register(require("./routes/oauthRoutes.js"));

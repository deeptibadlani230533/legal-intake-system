async function githubLogin(request, reply) {

  const authUrl = this.githubOAuth2.generateAuthorizationUri(request);

  reply.redirect(authUrl);

}

async function githubCallback(request, reply) {

  const token =
    await this.githubOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);

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

}

module.exports = {
  githubLogin,
  githubCallback,
};
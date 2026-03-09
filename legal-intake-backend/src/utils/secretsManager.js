const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");

const client = new SecretsManagerClient({
  region: "ap-south-1",
});

async function loadSecrets() {
  try {
    const command = new GetSecretValueCommand({
      SecretId: "legal-intake-secrets",
    });

    const response = await client.send(command);
    const secrets = JSON.parse(response.SecretString);

    return secrets;

  } catch (error) {
    console.error("Error loading secrets:", error);
    throw error;
  }
}

module.exports = loadSecrets;
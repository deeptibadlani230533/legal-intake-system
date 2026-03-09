const app = require("./app");
const db = require("./models");
const loadSecrets = require("./utils/secretsManager");

async function startServer() {
  try {

    if (process.env.NODE_ENV === "production") {
      const secrets = await loadSecrets();

      process.env.JWT_SECRET = secrets.JWT_SECRET;
      process.env.EMAIL_USER = secrets.EMAIL_USER;
      process.env.EMAIL_PASS = secrets.EMAIL_PASS;
      process.env.DB_PASS = secrets.DB_PASS;
      process.env.POSTGRES_PASSWORD = secrets.POSTGRES_PASSWORD;

      console.log("Secrets loaded from AWS");
    }

    await db.sequelize.sync();

    const seedAdmin = require("./database/seeders/seedAdmin.js");
    await seedAdmin();

    await app.listen({ port: 3000, host: "0.0.0.0" });

    console.log("Server running");

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

startServer();
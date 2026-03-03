const app = require("./app");
const db = require("./models");


async function startServer() {
  try {
   await db.sequelize.sync();
   const seedAdmin=require('./database/seeders/seedAdmin.js')
   await seedAdmin();

    await app.listen({ port: 3000, host: "0.0.0.0"});
    console.log("Server running");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

startServer();
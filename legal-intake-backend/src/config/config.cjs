module.exports = {
  development: {
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASS || "root",
    database: process.env.DB_NAME || "legal_intake_db",
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres"
  }
};
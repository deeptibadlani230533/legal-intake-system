const Fastify = require("fastify");
const dotenv = require("dotenv");

dotenv.config();

const app = Fastify({ logger: true });
exports.app = app;
const cors = require("@fastify/cors");
const caseRoutes = require("./routes/caseRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
app.setErrorHandler(require("./utils/errorHandler"));
app.register(cors, {
  origin: true,
  methods: ["GET", "POST", "PUT","PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

app.register(require("./plugins/jwt"));
app.register(require('@fastify/multipart'), {
  limits: {
    fileSize: 50 * 1024 * 1024,
  }
});

// Routes
app.register(require("./routes/authRoutes.js"),      { prefix: "/api/auth" });
app.register(require("./routes/protectedRoutes.js"), { prefix: "/api" });
app.register(require("./routes/caseRoutes.js"),      { prefix: "/api" });
app.register(require("./routes/userRoutes.js"),      { prefix: "/api" });
app.register(require("./routes/matterRoutes.js"),    { prefix: "/api" });
app.register(require("./routes/taskRoutes.js"),      { prefix: "/api" });
app.register(require("./routes/dashboardRoutes"),    { prefix: "/api/dashboard" });
app.register(require("./routes/documentRoutes.js"),  { prefix: "/api/documents" });

// ── New routes ──
app.register(require("./routes/calendarRoutes.js"),  { prefix: "/api" });
app.register(require("./routes/commentRoutes.js"),   { prefix: "/api" });

// Health Check
app.get("/health", async () => {
  return {
    status: "OK",
    message: "Backend Running",
  };
});

module.exports = app;
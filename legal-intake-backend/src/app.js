const Fastify = require("fastify");
const dotenv = require("dotenv");

dotenv.config();

const app = Fastify({ logger: true });

const cors = require("@fastify/cors");
const caseRoutes = require("./routes/caseRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
app.setErrorHandler(require("./utils/errorHandler"));
app.register(cors, {
  origin: true
});

app.register(require("./plugins/jwt"));
app.register(require('@fastify/multipart'), {
  limits: {
    fileSize: 50 * 1024 * 1024 
  }
  
});

// Routes
app.register(require("./routes/authRoutes.js"), { prefix: "/api/auth" });
app.register(require("./routes/protectedRoutes.js"), { prefix: "/api" });

app.register(require("./routes/caseRoutes.js"), { prefix: "/api" });
app.register(require("./routes/userRoutes.js"), { prefix: "/api" });
app.register(require("./routes/matter.Routes.js"), { prefix: "/api" });
app.register(require("./routes/task.Routes.js"), { prefix: "/api" });
app.register(require("./routes/dashboardRoutes"), {
  prefix: "/api/dashboard",
});
app.register(require("./routes/document.Routes.js"), {
  prefix: "/api/documents",
});

// Health Check
app.get("/health", async () => {
  return {
    status: "OK",
    message: "Backend Running",
  };
});

module.exports = app;

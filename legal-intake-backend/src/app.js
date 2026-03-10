const Fastify = require("fastify");
const dotenv = require("dotenv");

dotenv.config();

const app = Fastify({ logger: true });
exports.app = app;
const fastifyOauth2 = require("@fastify/oauth2");
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
    fileSize: 50 * 1024 * 1024 
  }
  
});

app.register(fastifyOauth2, {
  name: "githubOAuth2",
  scope: ["user:email"],
  credentials: {
    client: {
      id: process.env.GITHUB_CLIENT_ID,
      secret: process.env.GITHUB_CLIENT_SECRET,
    },
    auth: fastifyOauth2.GITHUB_CONFIGURATION,
  },
  startRedirectPath: "/auth/github",
  callbackUri: "http://13.200.123.199:3000/auth/github/callback",
});

// Routes
app.register(require("./routes/authRoutes.js"), { prefix: "/api/auth" });
app.register(require("./routes/protectedRoutes.js"), { prefix: "/api" });
app.register(require("./routes/oAuthRoutes.js"));

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

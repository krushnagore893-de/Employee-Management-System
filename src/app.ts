// backend/src/server.ts
import fastify from "fastify";
import dotenv from "dotenv";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import modelInitializationPlugin from "./plugins/modelinitializer-plugin";
import sequelizePlugin from "./plugins/sequelize-plugin";


dotenv.config({ quiet: true });
const PORT = parseInt(process.env.PORT || '8000', 10);
const HOST = process.env.HOST || '0.0.0.0';

const app = fastify({
  logger: {
    level: process.env.LOG_LEVEL || "info",
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "SYS:standard",
        ignore: "pid,hostname"
      }
    }
  }
});

// --------------------
// CORS Setup
// --------------------
function registerCorePlugins() {
  app.register(cors, {
    origin: (origin, cb) => {
      // Allow requests with no origin (Postman, curl)
      if (!origin) return cb(null, true);

      // Allow localhost (Flutter web/dev)
      if (origin.startsWith("http://localhost")) return cb(null, true);
      if (origin.startsWith("http://127.0.0.1")) return cb(null, true);

      // Block others
      // cb(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  });

  // Register multipart for file uploads
  app.register(multipart, {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB max file size
    },
  });
}



// --------------------
// Custom Raw Body Parser
// --------------------
async function customRawParser() {
  app.addContentTypeParser(['application/json', 'text/plain'], { parseAs: 'buffer' }, (req, body, done) => {
    try {
      (req as any).rawBody = body;
      try {
        const json = JSON.parse(body.toString());
        done(null, json);
      } catch {
        done(null, body.toString());
      }
    } catch (err) {
      console.error("Error in content parser:", err);
      done(err as Error, undefined);
    }
  });
}

// --------------------
// Health Check Route
// --------------------
function setupHealthCheck() {
  app.get("/auth/health-check", async (request, reply) => {
    try {
      await app.sequelize.authenticate();
      return reply.status(200).send({
        message: "MySQL Connected",
        name: "Auth API",
        version: "1.0.0",
        status: 200,
        dependencies: [
          {
            type: "database-mysql",
            status: true,
            required: true,
          },
        ],
        timestamp: new Date().toUTCString(),
      });
    } catch (error) {
      return reply.status(503).send({
        message: "MySQL connection failed",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
}

// --------------------
// Register Routes
// --------------------
async function registerRoutes() {
  const authRoutes = (await import("./routes/index")).default;
  app.register(authRoutes, { prefix: "/v1/api" });
}


// --------------------
// Start Server
// -------------------- 
const start = async () => {
  try {
    setupHealthCheck();
    registerCorePlugins();
    await customRawParser();
    await app.register(sequelizePlugin);
    await app.register(modelInitializationPlugin);

    await app.sequelize.sync({ force: false });
    app.log.info('Database tables created successfully');

    await registerRoutes();
    await app.listen({ port: PORT, host: HOST });
    app.log.info(`Server is running on http://localhost:${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();

import { FastifyInstance, FastifyPluginOptions } from "fastify";
import userRoutes from "./user.routes";
import employeeRoutes from "./employee.routes";
import companyRoutes from "./company.routes";
import departmentRoutes from "./department.routes";
import roleRoutes from "./role.routes";
import userMappingRoutes from "./userMapping.routes";


export default async function routes(fastify: FastifyInstance, opts: FastifyPluginOptions) {
  fastify.get("/health", async (request, reply) => {
    return { status: "ok", timestamp: new Date().toISOString() };
  });

  // Register user routes
  await fastify.register(userRoutes,{ prefix: "/users" });
    await fastify.register(employeeRoutes,{ prefix: "/employee" });
  await fastify.register(companyRoutes,{ prefix: "/companys" });
  await fastify.register(departmentRoutes,{ prefix: "/departments" });
  await fastify.register(roleRoutes,{ prefix: "/roles" });
  await fastify.register(userMappingRoutes,{prefix:"/user-mapping"})


};


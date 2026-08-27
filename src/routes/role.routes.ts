import { FastifyInstance } from "fastify";

import roleController from "../controllers/role.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";


async function roleRoutes(fastify: FastifyInstance) {

    // Create Role
    fastify.post(
        "/create-role",
        {
            preHandler: [
                authMiddleware
            ]
        },
        roleController.createRole
    );


    // Get All Roles
    fastify.get(
        "/getAll-role",
        {
            preHandler: [
                authMiddleware
            ]
        },
        roleController.getAllRoles
    );


    // Get Role By ID
    fastify.get(
        "/role/:role_id",
        {
            preHandler: [
                authMiddleware
            ]
        },
        roleController.getRoleById
    );


    // Update Role
    fastify.put(
        "/role/:role_id/update-user",
        {
            preHandler: [
                authMiddleware
            ]
        },
        roleController.updateRole
    );


    // Delete Role
    fastify.delete(
        "/role/:role_id/delete-role",
        {
            preHandler: [
                authMiddleware
            ]
        },
        roleController.deleteRole
    );
}


export default roleRoutes;
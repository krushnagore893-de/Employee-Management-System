import { FastifyInstance } from "fastify";

import UserMappingController
    from "../controllers/userMapping.controller";

import { authMiddleware }
    from "../middleware/auth.middleware";


export default async function userMappingRoutes(
    fastify: FastifyInstance
) {


    // ==========================================
    // Create User Mapping
    // ==========================================

    fastify.post(
        "/create-user-mapping",
        {
            preHandler: [
                authMiddleware
            ]
        },
        UserMappingController
            .createUserMapping
            .bind(UserMappingController)
    );


    // ==========================================
    // Get All User Mappings
    // ==========================================

    fastify.get(
        "/get-all-user-mappings",
        {
            preHandler: [
                authMiddleware
            ]
        },
        UserMappingController
            .getAllUserMappings
            .bind(UserMappingController)
    );


    // ==========================================
    // Get User Mapping By ID
    // ==========================================

    fastify.get(
        "/get-user-mapping/:id",
        {
            preHandler: [
                authMiddleware
            ]
        },
        UserMappingController
            .getUserMappingById
            .bind(UserMappingController)
    );


    // ==========================================
    // Update User Mapping
    // ==========================================

    fastify.put(
        "/update-user-mapping/:id",
        {
            preHandler: [
                authMiddleware
            ]
        },
        UserMappingController
            .updateUserMapping
            .bind(UserMappingController)
    );


    // ==========================================
    // Delete User Mapping
    // ==========================================

    fastify.delete(
        "/delete-user-mapping/:id",
        {
            preHandler: [
                authMiddleware
            ]
        },
        UserMappingController
            .deleteUserMapping
            .bind(UserMappingController)
    );

}
import { FastifyInstance } from "fastify";

import UserController from "../controllers/user.controller";

import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";


export default async function userRoutes(
    fastify: FastifyInstance
) {

    // =========================
    // Create User
    // Admin Only
    // =========================
    fastify.post(
        "/create-user",
        {
            preHandler: [
                authMiddleware,
                roleMiddleware(
                    "ceb77592-f457-4a97-b955-7f14475d0bdf"
                )
            ]
        },
        UserController.createUser.bind(
            UserController
        )
    );


    // =========================
    // Get All Users
    // Login Required
    // =========================
    fastify.get(
        "/get-all-users",
        {
            preHandler: authMiddleware
        },
        UserController.getAllUsers.bind(
            UserController
        )
    );


    // =========================
    // Get User By ID
    // Login Required
    // =========================
    fastify.get(
        "/get-user/:id",
        {
            preHandler: authMiddleware
        },
        UserController.getUserById.bind(
            UserController
        )
    );


    // =========================
    // Update User
    // Admin Only
    // =========================
    fastify.put(
        "/update-user/:id",
        {
            preHandler: [
                authMiddleware,
                roleMiddleware(
                    "ceb77592-f457-4a97-b955-7f14475d0bdf"
                )
            ]
        },
        UserController.updateUser.bind(
            UserController
        )
    );


    // =========================
    // Delete User
    // Admin Only
    // =========================
    fastify.delete(
        "/delete-user/:id",
        {
            preHandler: [
                authMiddleware,
                roleMiddleware(
                    "ceb77592-f457-4a97-b955-7f14475d0bdf"
                )
            ]
        },
        UserController.deleteUser.bind(
            UserController
        )
    );


    // =========================
    // Login
    // Public API
    // =========================
    fastify.post(
        "/login",
        UserController.login.bind(
            UserController
        )
    );
}
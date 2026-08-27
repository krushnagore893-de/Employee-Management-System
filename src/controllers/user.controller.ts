import { FastifyRequest, FastifyReply } from "fastify";
import userService from "../services/user.service";

class UserController {

    // =========================
    // Create User
    // =========================
    async createUser(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        try {

            const userData = request.body as any;

            console.log("========== CREATE USER ==========");
            console.log("BODY:", request.body);
            console.log("USER DATA:", userData);
            console.log("EMAIL:", userData?.email);
            console.log("=================================");

            const response =
                await userService.createUser(userData);

            return reply.status(201).send({
                success: true,
                message: "User created successfully",
                data: response
            });

        } catch (error: any) {

            console.error(
                "CREATE USER ERROR:",
                error
            );

            return reply.status(500).send({
                success: false,
                message: error.message
            });
        }
    }


    // =========================
    // Get All Users
    // =========================
    async getAllUsers(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        try {

            const query =
                request.query as any;

            const response =
                await userService.getAllUsers(query);

            return reply.status(200).send({
                success: true,
                message: "Users fetched successfully",
                data: response
            });

        } catch (error: any) {

            console.error(
                "GET ALL USERS ERROR:",
                error
            );

            return reply.status(500).send({
                success: false,
                message: error.message
            });
        }
    }


    // =========================
    // Get User By ID
    // =========================
    async getUserById(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        try {

            const { id } =
                request.params as {
                    id: string
                };

            const response =
                await userService.getUserById(id);

            return reply.status(200).send({
                success: true,
                message: "User fetched successfully",
                data: response
            });

        } catch (error: any) {

            console.error(
                "GET USER ERROR:",
                error
            );

            return reply.status(404).send({
                success: false,
                message: error.message
            });
        }
    }


    // =========================
    // Update User
    // =========================
    async updateUser(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        try {

            const { id } =
                request.params as {
                    id: string
                };

            const data =
                request.body as any;

            const response =
                await userService.updateUser(
                    id,
                    data
                );

            return reply.status(200).send({
                success: true,
                message: "User updated successfully",
                data: response
            });

        } catch (error: any) {

            console.error(
                "UPDATE USER ERROR:",
                error
            );

            return reply.status(404).send({
                success: false,
                message: error.message
            });
        }
    }


    // =========================
    // Delete User
    // =========================
    async deleteUser(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        try {

            const { id } =
                request.params as {
                    id: string
                };

            const response =
                await userService.deleteUser(id);

            return reply.status(200).send({
                success: true,
                message: response.message
            });

        } catch (error: any) {

            console.error(
                "DELETE USER ERROR:",
                error
            );

            return reply.status(404).send({
                success: false,
                message: error.message
            });
        }
    }


    // =========================
    // Login
    // =========================
    async login(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        try {

            const {
                email,
                password
            } = request.body as {
                email: string;
                password: string;
            };

            const response =
                await userService.login(
                    email,
                    password
                );

            return reply.status(200).send(
                response
            );

        } catch (error: any) {

            console.error(
                "LOGIN ERROR:",
                error
            );

            return reply.status(500).send({
                success: false,
                message: error.message
            });
        }
    }
}

export default new UserController();
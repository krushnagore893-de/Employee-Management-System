import { FastifyRequest, FastifyReply } from "fastify";
import roleService from "../services/role.service";

class RoleController {

    // Create Role
    async createRole(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        try {

            const roleData =
                request.body as any;

            const response =
                await roleService.createRole(
                    roleData
                );

            return reply.status(201).send({
                message: "Role created successfully",
                data: response
            });

        } catch (error: any) {

            if (
                error.message ===
                "Role already exists"
            ) {
                return reply.status(409).send({
                    message: error.message
                });
            }

            return reply.status(500).send({
                message: "Internal Server Error",
                error: error.message
            });
        }
    }


    // Get All Roles
    async getAllRoles(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        try {

            const query =
                request.query as any;

            const response =
                await roleService.getAllRoles(
                    query
                );

            return reply.status(200).send({
                message: "Roles fetched successfully",
                data: response
            });

        } catch (error: any) {

            return reply.status(500).send({
                message: "Internal Server Error",
                error: error.message
            });
        }
    }


    // Get Role By ID
    async getRoleById(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        try {

            const { roleId } =
                request.params as {
                    roleId: string;
                };

            const response =
                await roleService.getRoleById(
                    String(roleId)
                );

            return reply.status(200).send({
                message: "Role fetched successfully",
                data: response
            });

        } catch (error: any) {

            if (
                error.message ===
                "Role not found"
            ) {
                return reply.status(404).send({
                    message: error.message
                });
            }

            return reply.status(500).send({
                message: "Internal Server Error",
                error: error.message
            });
        }
    }


    // Update Role
    async updateRole(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        try {

            const { roleId } =
                request.params as {
                    roleId: string;
                };

            const roleData =
                request.body as any;

            const response =
                await roleService.updateRole(
                    String(roleId),
                    roleData
                );

            return reply.status(200).send({
                message: "Role updated successfully",
                data: response
            });

        } catch (error: any) {

            if (
                error.message ===
                "Role not found"
            ) {
                return reply.status(404).send({
                    message: error.message
                });
            }

            return reply.status(500).send({
                message: "Internal Server Error",
                error: error.message
            });
        }
    }


    // Delete Role
    async deleteRole(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        try {

            const { roleId } =
                request.params as {
                    roleId: string;
                };

            const response =
                await roleService.deleteRole(
                    String(roleId)
                );

            return reply.status(200).send(response);

        } catch (error: any) {

            if (
                error.message ===
                "Role not found"
            ) {
                return reply.status(404).send({
                    message: error.message
                });
            }

            return reply.status(500).send({
                message: "Internal Server Error",
                error: error.message
            });
        }
    }
}

export default new RoleController();
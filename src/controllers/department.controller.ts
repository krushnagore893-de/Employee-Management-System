import {
    FastifyRequest,
    FastifyReply
} from "fastify";

import departmentService from "../services/department.service";

class DepartmentController {

    // Create Department
    async createDepartment(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        try {

            const departmentData =
                request.body as any;

            const department =
                await departmentService.createDepartment(
                    departmentData
                );

            return reply.status(201).send({
                message:
                    "Department created successfully",
                data: department
            });

        } catch (error: any) {

            return reply.status(500).send({
                message:
                    "Internal Server Error",
                error:
                    error.message
            });
        }
    }


    // Get All Departments
    async getAllDepartments(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        try {

            const query =
                request.query as any;

            const departments =
                await departmentService.getAllDepartments(
                    query
                );

            return reply.status(200).send({
                message:
                    "Departments fetched successfully",
                data: departments
            });

        } catch (error: any) {

            return reply.status(500).send({
                message:
                    "Internal Server Error",
                error:
                    error.message
            });
        }
    }


    // Get Department By ID
    async getDepartmentById(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        try {

            const { id } =
                request.params as {
                    id: string;
                };

            // UUID check
            if (!id) {
                return reply.status(400).send({
                    message:
                        "Department ID is required"
                });
            }

            console.log(
                "Department ID:",
                id
            );

            const department =
                await departmentService.getDepartmentById(
                    id
                );

            return reply.status(200).send({
                message:
                    "Department fetched successfully",
                data:
                    department
            });

        } catch (error: any) {

            if (
                error.message ===
                "Department not found"
            ) {
                return reply.status(404).send({
                    message:
                        "Department not found"
                });
            }

            return reply.status(500).send({
                message:
                    "Internal Server Error",
                error:
                    error.message
            });
        }
    }


    // Update Department
    async updateDepartment(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        try {

            const { id } =
                request.params as {
                    id: string;
                };

            const departmentData =
                request.body as any;

            if (!id) {
                return reply.status(400).send({
                    message:
                        "Department ID is required"
                });
            }

            const department =
                await departmentService.updateDepartment(
                    id,
                    departmentData
                );

            return reply.status(200).send({
                message:
                    "Department updated successfully",
                data:
                    department
            });

        } catch (error: any) {

            if (
                error.message ===
                "Department not found"
            ) {
                return reply.status(404).send({
                    message:
                        "Department not found"
                });
            }

            if (
                error.message ===
                "Department already exists"
            ) {
                return reply.status(409).send({
                    message:
                        "Department already exists"
                });
            }

            return reply.status(500).send({
                message:
                    "Internal Server Error",
                error:
                    error.message
            });
        }
    }


    // Delete Department
    async deleteDepartment(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        try {

            const { id } =
                request.params as {
                    id: string;
                };

            if (!id) {
                return reply.status(400).send({
                    message:
                        "Department ID is required"
                });
            }

            const result =
                await departmentService.deleteDepartment(
                    id
                );

            return reply.status(200).send(
                result
            );

        } catch (error: any) {

            if (
                error.message ===
                "Department not found"
            ) {
                return reply.status(404).send({
                    message:
                        "Department not found"
                });
            }

            return reply.status(500).send({
                message:
                    "Internal Server Error",
                error:
                    error.message
            });
        }
    }
}

export default new DepartmentController();
